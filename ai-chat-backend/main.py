import json
import os
import time
from collections import defaultdict
from pathlib import Path

import anthropic
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
from pydantic import BaseModel

from docs_loader import load_all_docs, search_docs

# Load .env first, fall back to .env.example for local dev convenience
_here = Path(__file__).parent
load_dotenv(_here / ".env") or load_dotenv(_here / ".env.example")

app = FastAPI(title="Nomba Docs AI")

# Restrict to specific origins in production — set ALLOWED_ORIGINS as a comma-separated list
_allowed_origins = [o.strip() for o in os.environ.get("ALLOWED_ORIGINS", "*").split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

_docs = []
_client: anthropic.Anthropic | None = None
_cache: dict[str, str] = {}  # normalized question → full response text
_CACHE_MAX = 500              # evict oldest when limit is reached
_CACHE_FILE = _here / "response_cache.json"

# Rate limiting — sliding window per IP
_RATE_LIMIT = 10             # max questions per day per IP
_RATE_WINDOW = 86400         # 24 hours in seconds
_rate_buckets: dict[str, list[float]] = defaultdict(list)

# Input constraints
_MAX_QUESTION_LEN = 100


def _check_rate_limit(ip: str) -> tuple[bool, int]:
    """Returns (allowed, remaining_count)."""
    now = time.time()
    cutoff = now - _RATE_WINDOW
    bucket = [t for t in _rate_buckets[ip] if t > cutoff]
    _rate_buckets[ip] = bucket
    if len(bucket) >= _RATE_LIMIT:
        return False, 0
    _rate_buckets[ip].append(now)
    return True, _RATE_LIMIT - len(_rate_buckets[ip])


def _load_cache_from_disk() -> dict[str, str]:
    try:
        return json.loads(_CACHE_FILE.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError):
        return {}


def _save_cache_to_disk() -> None:
    _CACHE_FILE.write_text(json.dumps(_cache), encoding="utf-8")


def _cache_key(question: str) -> str:
    return " ".join(question.lower().split())

SYSTEM_PROMPT = """You are a helpful assistant for the Nomba Developer documentation.
Answer questions using the provided documentation context. Be thorough and accurate — explain the why, not just the what.
Where relevant, include key parameters, expected responses, and any important caveats or gotchas a developer should know.
If the answer is not covered in the context, say so clearly rather than guessing.
For multi-step instructions, use numbered lists. For technical details like field names or values, use inline code formatting.
Only answer questions related to Nomba APIs, payments, and developer documentation.
If a question is off-topic, harmful, or unrelated to Nomba, politely decline and redirect the user."""


@app.on_event("startup")
async def startup():
    global _docs, _client, _cache
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise RuntimeError("ANTHROPIC_API_KEY is not set. Add it to .env or .env.example.")
    _client = anthropic.Anthropic(api_key=api_key)
    _docs = load_all_docs()
    _cache.update(_load_cache_from_disk())
    print(f"Loaded {len(_docs)} documentation pages, {len(_cache)} cached responses")


@app.get("/widget.js", include_in_schema=False)
async def serve_widget():
    path = _here / "widget.js"
    if not path.exists():
        raise HTTPException(status_code=404, detail="Widget file not found")
    return FileResponse(path, media_type="application/javascript")


class ChatRequest(BaseModel):
    question: str


@app.post("/api/chat")
async def chat(req: ChatRequest, request: Request):
    ip = request.client.host if request.client else "unknown"
    allowed, remaining = _check_rate_limit(ip)
    if not allowed:
        raise HTTPException(
            status_code=429,
            detail="You have reached your 10 questions per day limit. Please try again tomorrow.",
            headers={"X-Questions-Remaining": "0"},
        )

    question = req.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    if len(question) > _MAX_QUESTION_LEN:
        raise HTTPException(status_code=400, detail=f"Question too long. Please keep it under {_MAX_QUESTION_LEN} characters.")

    key = _cache_key(question)

    rl_headers = {"X-Questions-Remaining": str(remaining)}

    # Cache hit — stream the stored response back instantly, no Claude call
    if key in _cache:
        cached_text = _cache[key]
        def serve_cached():
            yield f"data: {json.dumps({'text': cached_text})}\n\n"
            yield "data: [DONE]\n\n"
        return StreamingResponse(serve_cached(), media_type="text/event-stream", headers=rl_headers)

    # Cache miss — call Claude, accumulate response, then store it
    relevant = search_docs(_docs, question)
    context = "\n\n---\n\n".join(
        f"[{doc['title']}]\n{doc['content']}" for doc in relevant
    ) if relevant else "No matching documentation found."

    def generate():
        chunks = []
        with _client.messages.stream(
            model="claude-haiku-4-5-20251001",
            max_tokens=1024,
            system=[
                {
                    "type": "text",
                    "text": SYSTEM_PROMPT,
                    "cache_control": {"type": "ephemeral"},
                }
            ],
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": f"Documentation context:\n\n{context}",
                            "cache_control": {"type": "ephemeral"},
                        },
                        {
                            "type": "text",
                            "text": f"Question: {question}",
                        },
                    ],
                }
            ],
            extra_headers={"anthropic-beta": "prompt-caching-2024-07-31"},
        ) as stream:
            for text in stream.text_stream:
                chunks.append(text)
                yield f"data: {json.dumps({'text': text})}\n\n"

        # Store full response in cache after streaming completes
        if len(_cache) >= _CACHE_MAX:
            _cache.pop(next(iter(_cache)))  # evict oldest entry
        _cache[key] = "".join(chunks)
        _save_cache_to_disk()

        yield "data: [DONE]\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream", headers=rl_headers)


@app.get("/health")
async def health():
    return {"status": "ok", "docs_loaded": len(_docs), "cache_size": len(_cache)}
