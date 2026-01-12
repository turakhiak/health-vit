#!/bin/bash
# Sources the local development environment

# 1. Add local Node.js to PATH
export PATH="$PWD/.tools/node-v20.11.0-darwin-arm64/bin:$PATH"

# 2. Activate Python backend venv
if [ -d "venv" ]; then
    source venv/bin/activate
fi

echo "Environment Configured!"
echo "Node: $(node -v)"
echo "NPM: $(npm -v)"
echo "Python: $(python3 --version)"
echo ""
echo "To run frontend: cd frontend && npm run dev"
echo "To run backend:  uvicorn backend.main:app --reload"
