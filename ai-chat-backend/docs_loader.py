import json
import re
from pathlib import Path

DOCS_ROOT = Path(__file__).parent.parent
OPENAPI_FILE = DOCS_ROOT / "nomba-api-reference" / "openapi.json"

EXCLUDED_DIRS = {".git", "node_modules", "ai-chat-backend", ".mintlify", "images", "logo", "support"}
INCLUDED_EXTENSIONS = {".mdx", ".md", ".json"}


def load_all_docs():
    docs = []
    for file_path in DOCS_ROOT.rglob("*"):
        if not file_path.is_file():
            continue
        if file_path.suffix not in INCLUDED_EXTENSIONS:
            continue
        if any(part in EXCLUDED_DIRS for part in file_path.parts):
            continue

        try:
            raw = file_path.read_text(encoding="utf-8")
            title = _extract_title(raw, file_path)
            content = _clean_mdx(raw)
            if len(content.strip()) < 50:
                continue
            docs.append({
                "path": str(file_path.relative_to(DOCS_ROOT)),
                "title": title,
                "content": content,
            })
        except Exception:
            pass

    docs.extend(_load_openapi_docs())
    return docs


def _load_openapi_docs():
    try:
        spec = json.loads(OPENAPI_FILE.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError):
        return []

    docs = []
    for path, methods in spec.get("paths", {}).items():
        for method, op in methods.items():
            if method not in {"get", "post", "put", "patch", "delete"}:
                continue

            operation_id = op.get("operationId", "")
            description = op.get("description", "")
            tags = ", ".join(op.get("tags", []))

            lines = [f"{method.upper()} {path}"]
            if tags:
                lines.append(f"Tag: {tags}")
            if description:
                lines.append(f"Description: {description}")

            # Parameters (path/query)
            params = op.get("parameters", [])
            if params:
                lines.append("Parameters:")
                for p in params:
                    name = p.get("name", "")
                    pdesc = p.get("description", "")
                    required = " (required)" if p.get("required") else ""
                    lines.append(f"  {name}{required}: {pdesc}" if pdesc else f"  {name}{required}")

            # Request body description only (no schema)
            req_body = op.get("requestBody", {})
            if req_body.get("description"):
                lines.append(f"Request body: {req_body['description']}")

            # Response descriptions
            responses = op.get("responses", {})
            if responses:
                lines.append("Responses:")
                for code, resp in responses.items():
                    rdesc = resp.get("description", "")
                    if rdesc:
                        lines.append(f"  {code}: {rdesc}")

            title = operation_id or f"{method.upper()} {path}"
            docs.append({
                "path": f"openapi:{method.upper()} {path}",
                "title": title,
                "content": "\n".join(lines),
            })

    return docs


def search_docs(docs, question: str, max_results: int = 3, max_chars: int = 800):
    stop_words = {
        "the", "a", "an", "is", "it", "to", "do", "how", "what", "i", "can",
        "my", "for", "in", "of", "and", "or", "with", "this", "that", "be",
        "are", "was", "get", "use", "will", "does", "from", "on", "at",
    }
    words = {w for w in re.split(r"\W+", question.lower()) if w and w not in stop_words}

    if not words:
        return docs[:max_results]

    scored = []
    for doc in docs:
        body = doc["title"].lower() + " " + doc["content"].lower()
        content_score = sum(body.count(w) for w in words)
        title_score = sum(10 for w in words if w in doc["title"].lower())
        scored.append((content_score + title_score, doc))

    scored.sort(key=lambda x: x[0], reverse=True)
    top_score = scored[0][0] if scored else 0
    min_score = max(1, top_score * 0.2)  # must be at least 20% as relevant as top result
    results = []
    for score, doc in scored[:max_results]:
        if score < min_score:
            break
        results.append({**doc, "content": doc["content"][:max_chars]})

    return results


def _extract_title(content: str, file_path: Path) -> str:
    m = re.search(r'^---\s*\ntitle:\s*["\']?(.+?)["\']?\s*\n', content, re.MULTILINE)
    if m:
        return m.group(1).strip()
    m = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
    if m:
        return m.group(1).strip()
    return file_path.stem.replace("-", " ").title()


def _clean_mdx(content: str) -> str:
    # Remove frontmatter
    content = re.sub(r"^---\s*\n.*?\n---\s*\n", "", content, flags=re.DOTALL)
    # Remove import/export statements
    content = re.sub(r"^(import|export)\s+.*$", "", content, flags=re.MULTILINE)
    # Collapse code blocks to a placeholder so context stays meaningful
    content = re.sub(r"```[\s\S]*?```", "[code example]", content)
    # Strip JSX/HTML tags
    content = re.sub(r"<[^>]+>", " ", content)
    # Strip markdown link syntax, keep label text: [label](url) → label
    content = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", content)
    # Strip bold/italic markers
    content = re.sub(r"\*{1,3}([^*]+)\*{1,3}", r"\1", content)
    # Strip heading markers (## Heading → Heading)
    content = re.sub(r"^#{1,6}\s+", "", content, flags=re.MULTILINE)
    # Clean up extra blank lines
    content = re.sub(r"\n{3,}", "\n\n", content)
    return content.strip()
