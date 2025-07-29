#!/bin/bash
set -e

echo "=== Building Galactic Quest App ==="

echo "Building frontend..."
cd frontend
echo "Installing frontend dependencies..."
npm install --legacy-peer-deps
echo "Building React app..."
npm run build
echo "Frontend build completed!"

echo "Installing backend dependencies..."
cd ../backend
echo "Installing Python packages..."
pip install -r requirements.txt
echo "Backend setup completed!"

echo "=== Build completed successfully! ==="
echo "Frontend build location: frontend/build"
echo "Backend location: backend/"