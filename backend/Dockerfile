# Backend Dockerfile
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application files
COPY . .

# Expose port
# EXPOSE 8000

# Start FastAPI app
# ✅ Do this
CMD ["fastapi", "run", "/main.py"]