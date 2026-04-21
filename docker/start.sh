#!/usr/bin/env bash
set -euo pipefail

cd /app/backend

if [[ "${RUN_MIGRATIONS:-false}" == "true" ]]; then
  npm run prisma:migrate:deploy
fi

npm run start:prod &
backend_pid=$!

cleanup() {
  kill -TERM "$backend_pid" 2>/dev/null || true
}
trap cleanup INT TERM

nginx -g 'daemon off;' &
nginx_pid=$!

wait -n "$backend_pid" "$nginx_pid"
exit_code=$?

kill -TERM "$backend_pid" "$nginx_pid" 2>/dev/null || true
wait "$backend_pid" "$nginx_pid" 2>/dev/null || true

exit "$exit_code"
