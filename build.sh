#!/bin/bash
# Build script for production deployment

echo "Building Vite frontend..."
npm install
npm run build

echo "Building Spring Boot backend..."
cd spring-backend
./mvnw clean package -DskipTests
cd ..

echo "Build complete. The frontend is now bundled within the Spring Boot JAR in src/main/resources/static"
