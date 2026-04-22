FROM python:3.12-slim

WORKDIR /app

# Install dependencies first (cached layer)
COPY ai-chat-backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY ai-chat-backend/ ./ai-chat-backend/

# Copy documentation content (baked into the image so the AI can read it)
COPY docs/ ./docs/
COPY nomba-api-reference/ ./nomba-api-reference/
COPY nomba-api-changelog/ ./nomba-api-changelog/
COPY developer-resources/ ./developer-resources/

WORKDIR /app/ai-chat-backend

# Cloud Run injects $PORT at runtime (default 8080)
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}"]
