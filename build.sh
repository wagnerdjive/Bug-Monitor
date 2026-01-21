#!/bin/bash
# Build script for production deployment

echo "Building Spring Boot backend..."
cd spring-backend
./mvnw clean package -DskipTests
cd ..

echo "Building Vite frontend..."
npm install
npm run build

echo "Build complete."
