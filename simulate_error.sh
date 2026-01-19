#!/bin/bash

# Este script simula o envio de um erro para a API local
# Use: ./simulate_error.sh <SUA_API_KEY>

API_KEY=$1

if [ -z "$API_KEY" ]; then
  echo "Uso: ./simulate_error.sh <SUA_API_KEY>"
  exit 1
fi

curl -X POST http://localhost:5000/api/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "'"$API_KEY"'",
    "type": "error",
    "severity": "high",
    "message": "Simulated error from cURL",
    "stackTrace": "Error: Simulated error\n    at main (app.js:10:5)\n    at Object.<anonymous> (app.js:15:1)",
    "deviceInfo": {
      "os": "Linux",
      "browser": "cURL",
      "version": "7.81.0"
    },
    "occurredAt": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'"
  }'

echo -e "\nErro enviado com sucesso para o projeto!"
