#!/bin/bash

# Script para generar previews automáticamente
# Este script:
# 1. Inicia un servidor local
# 2. Ejecuta el generador de previews
# 3. Detiene el servidor

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "🚀 Iniciando servidor local..."
python3 -m http.server 8888 > /dev/null 2>&1 &
SERVER_PID=$!
trap "kill $SERVER_PID 2>/dev/null || true" EXIT

sleep 2

echo "📸 Generando previews..."
node generate-previews.js "$@"

echo "✅ Completado. Servidor detenido."
