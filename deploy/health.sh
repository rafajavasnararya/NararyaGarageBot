#!/usr/bin/env bash
set -e
URL=${1:-http://localhost:8080/api/health}
echo "Checking $URL"
curl -fsS "$URL"
echo
echo "Health check passed."