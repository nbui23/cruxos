#!/bin/sh
set -eu

: "${DATABASE_URL:?DATABASE_URL is required}"
PORT="${PORT:-3000}"

npx prisma db push
exec npx next start --hostname 0.0.0.0 --port "$PORT"
