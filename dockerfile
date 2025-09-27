# Dockerfile (backend) — place in repo root and name Dockerfile (or Dockerfile.backend)
FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1
WORKDIR /app

# Copy requirements from Backend folder
COPY Backend/requirements.txt ./requirements.txt

# Install system deps + python deps
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
    build-essential gcc g++ libhdf5-dev libblas-dev liblapack-dev \
 && python -m pip install --upgrade pip setuptools wheel \
 && pip install -r requirements.txt \
 && apt-get remove -y build-essential gcc g++ \
 && apt-get autoremove -y \
 && rm -rf /var/lib/apt/lists/*

# Copy backend source
COPY Backend/ ./

ENV PORT=8000
EXPOSE 8000

# Use api:app as your FastAPI entrypoint (you said file is api.py)
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]
