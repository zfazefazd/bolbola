#!/bin/bash
cd backend
exec uvicorn server:app --host 0.0.0.0 --port $PORT