#!/bin/bash

# Start backend on port 8001
cd /app/backend
/root/.venv/bin/uvicorn server:app --host 0.0.0.0 --port 8001 --workers 1 --reload &

# Start frontend on port 3000  
cd /app/frontend
PORT=3000 HOST=0.0.0.0 yarn start &

# Simple port forwarder for external access
socat TCP-LISTEN:80,fork TCP:localhost:3000 &
socat TCP-LISTEN:8000,fork TCP:localhost:8001 &

wait