#!/usr/bin/env bash
set -euo pipefail
npm test
printf "\nNative C++ smoke compile (optional):\n"
if command -v cmake >/dev/null 2>&1; then
  cmake -S native/cpp -B native/cpp/build
  cmake --build native/cpp/build
else
  echo "cmake not installed; skipping native compile"
fi
