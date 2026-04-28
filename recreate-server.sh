#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

COMPOSE_FILE="docker-compose.yaml"
DB_SERVICE_NAME="db"
SERVER_SERVICE_NAME="server"
SERVICES=("$DB_SERVICE_NAME" "$SERVER_SERVICE_NAME")

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is not installed or not available in PATH."
  exit 1
fi

if [[ ! -f "$COMPOSE_FILE" ]]; then
  echo "Missing $COMPOSE_FILE in $SCRIPT_DIR."
  exit 1
fi

echo "Removing existing containers for services: ${SERVICES[*]} (if present)..."
docker compose -f "$COMPOSE_FILE" rm -f -s "${SERVICES[@]}" || true

echo "Recreating services: ${SERVICES[*]}..."
docker compose -f "$COMPOSE_FILE" up -d --build --force-recreate --remove-orphans "${SERVICES[@]}"

echo "Running DB migrations..."
docker compose -f "$COMPOSE_FILE" exec -T "$SERVER_SERVICE_NAME" npm run db:migrate

echo "Done. Current services status:"
docker compose -f "$COMPOSE_FILE" ps "${SERVICES[@]}"