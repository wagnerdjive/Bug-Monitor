#!/bin/bash

cd spring-backend && java -jar target/error-tracker-api-1.0.0.jar &
SPRING_PID=$!

cd /home/runner/workspace && npm run vite:dev &
VITE_PID=$!

trap "kill $SPRING_PID $VITE_PID 2>/dev/null" EXIT

wait
