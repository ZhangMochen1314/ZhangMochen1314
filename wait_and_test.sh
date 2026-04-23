#!/bin/bash
echo "Waiting for uv sync to finish..."
while pgrep -f "uv sync" > /dev/null; do
  sleep 5
done
echo "uv sync finished. Starting backend and frontend in daemon mode..."
cd /workspace/deer-flow
make dev-daemon
echo "Waiting for services to be ready on port 3000..."
while ! curl -s http://localhost:3000 > /dev/null; do
  sleep 5
done
echo "Services ready! Running dogfood..."
npx agent-browser --session deepres-local open http://localhost:3000
npx agent-browser --session deepres-local wait --load networkidle
npx agent-browser --session deepres-local screenshot --annotate /workspace/deer-flow/output/qa/screenshots/initial.png
npx agent-browser --session deepres-local snapshot -i > /workspace/deer-flow/output/qa/snapshot.txt
npx agent-browser --session deepres-local close
echo "Dogfood exploration done."