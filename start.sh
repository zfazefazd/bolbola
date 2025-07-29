#!/bin/bash
set -e

echo "Starting Galactic Quest backend..."
echo "PORT environment variable: $PORT"

cd backend

# Use PORT environment variable provided by Render, fallback to 8001
if [ -z "$PORT" ]; then
    echo "Warning: PORT not set, using default 8001"
    export PORT=8001
fi

exec uvicorn server:app --host 0.0.0.0 --port $PORT --workers 1