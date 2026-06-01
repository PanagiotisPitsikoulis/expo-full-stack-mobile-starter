#!/bin/zsh
set -euo pipefail

cd /Users/panagiotispitsikoulis/Desktop/temp/projects/rn/project

export PORT=4001
export HOST=127.0.0.1

exec /opt/homebrew/bin/node apps/server/src/index.js
