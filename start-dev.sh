#!/bin/bash

# Determine project root
PROJECT_ROOT=$(cd "$(dirname "$0")" && pwd)

# Start Spring Boot backend
echo "Starting Spring Boot backend..."
cd "$PROJECT_ROOT/spring-backend" && java -jar target/error-tracker-api-1.0.0.jar &
SPRING_PID=$!

# Start Vite frontend
echo "Starting Vite frontend..."
cd "$PROJECT_ROOT" && npm run vite:dev &
VITE_PID=$!

# Handle shutdown
trap "kill $SPRING_PID $VITE_PID 2>/dev/null" EXIT

echo "Application started. Backend PID: $SPRING_PID, Frontend PID: $VITE_PID"
wait
