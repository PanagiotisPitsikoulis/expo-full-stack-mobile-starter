#!/bin/zsh
set -euo pipefail

cd /Users/panagiotispitsikoulis/Desktop/temp/projects/rn/project/apps/mobile

export EXPO_PUBLIC_API_BASE_URL="${EXPO_PUBLIC_API_BASE_URL:-http://localhost:4001}"
export NODE_OPTIONS="${NODE_OPTIONS:---no-deprecation}"
export EXPO_NO_TELEMETRY=1

exec ./node_modules/.bin/expo start --clear --port 8092
