#!/bin/sh
set -e

GEOLITE_DOWNLOAD_ON_BOOT="${GEOLITE_DOWNLOAD_ON_BOOT:-true}"
GEOLITE_FAIL_FAST="${GEOLITE_FAIL_FAST:-false}"

echo "[startup] Inicializando API..."

if [ "$GEOLITE_DOWNLOAD_ON_BOOT" = "true" ]; then
  echo "[startup] GeoLite boot download: ON"

  if ./scripts/download-geolite.sh; then
    echo "[startup] GeoLite validado no boot"
  else
    echo "[startup] Falha ao preparar GeoLite no boot"

    if [ "$GEOLITE_FAIL_FAST" = "true" ]; then
      echo "[startup] GEOLITE_FAIL_FAST=true, abortando inicializacao"
      exit 1
    fi

    echo "[startup] Seguindo inicializacao sem bloquear a API (GEOLITE_FAIL_FAST=false)"
  fi
else
  echo "[startup] GeoLite boot download: OFF (GEOLITE_DOWNLOAD_ON_BOOT=false)"
fi

exec node dist/server.js
