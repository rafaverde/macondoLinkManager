#!/bin/sh
set -e

DB_DIR="./data"
TMP_DIR="./data/tmp"

CITY_DB="$DB_DIR/GeoLite2-City.mmdb"
ASN_DB="$DB_DIR/GeoLite2-ASN.mmdb"

download_mmdb() {
  edition="$1"
  filename="$2"

  echo "⬇️  Baixando $edition..."
  curl -fSL --retry 3 --retry-delay 2 \
    -u "$MAXMIND_LICENSE_KEY:" \
    "https://download.maxmind.com/app/geoip_download?edition_id=$edition&license_key=$MAXMIND_LICENSE_KEY&suffix=tar.gz" \
    -o "$TMP_DIR/$edition.tar.gz"

  echo "📦 Extraindo $edition..."
  tar -xzf "$TMP_DIR/$edition.tar.gz" -C "$TMP_DIR"

  mmdb_path=$(find "$TMP_DIR" -name "$filename" | head -n 1)
  if [ -z "$mmdb_path" ]; then
    echo "❌ $filename não encontrado"
    return 1
  fi

  mkdir -p "$DB_DIR"
  cp "$mmdb_path" "$DB_DIR/$filename"
  echo "✅ $edition pronto em $DB_DIR/$filename"
}

needs_download=0
if [ ! -f "$CITY_DB" ] || [ ! -f "$ASN_DB" ]; then
  needs_download=1
fi

if [ "$needs_download" -eq 0 ]; then
  echo "✅ GeoLite2 já está disponível em $DB_DIR"
  exit 0
fi

if [ -z "$MAXMIND_LICENSE_KEY" ]; then
  echo "❌ MAXMIND_LICENSE_KEY não definida e DB GeoLite2 está incompleta."
  exit 1
fi

mkdir -p "$TMP_DIR"

if [ ! -f "$CITY_DB" ]; then
  download_mmdb "GeoLite2-City" "GeoLite2-City.mmdb"
fi

if [ ! -f "$ASN_DB" ]; then
  download_mmdb "GeoLite2-ASN" "GeoLite2-ASN.mmdb"
fi

if [ ! -f "$CITY_DB" ] || [ ! -f "$ASN_DB" ]; then
  echo "❌ Falha ao garantir GeoLite2 City + ASN em $DB_DIR"
  exit 1
fi

echo "✅ GeoLite2 City + ASN disponíveis em $DB_DIR"

rm -rf "$TMP_DIR"
