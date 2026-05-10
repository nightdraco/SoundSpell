FROM python:3.11-slim

WORKDIR /app

# Install system dependencies necessary for PostgreSQL adapters
RUN apt-get update && apt-get install -y libpq-dev gcc && rm -rf /var/lib/apt/lists/*

# Install Python dependencies (including psycopg2 for future Postgres integration)
# Note: If you have a requirements.txt, you can replace this RUN with:
# COPY requirements.txt . && pip install -r requirements.txt
RUN pip install --no-cache-dir fastapi uvicorn nltk psycopg2-binary sqlalchemy

# Copy the backend source code
COPY ./backend .

EXPOSE 8000

# Run the FastAPI application with live-reload enabled for development
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]