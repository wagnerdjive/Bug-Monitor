# TechMonitor - Local Setup Guide

This guide provides instructions on how to run TechMonitor on your local machine.

## Prerequisites

- **Java 17+**: Required for the Spring Boot backend.
- **Node.js 20+**: Required for the React frontend.
- **PostgreSQL**: Required for data persistence.
- **Maven**: To build the backend (optional if using the included `mvnw`).

## Project Structure

- `spring-backend/`: The Spring Boot application (API).
- `client/`: The React frontend (Vite).
- Root directory contains shared configurations and scripts.

## Database Setup

1. Install PostgreSQL on your machine.
2. Create a new database named `techmonitor`.
3. Set up the following environment variables (or update `spring-backend/src/main/resources/application.properties`):
   ```bash
   DATABASE_URL=jdbc:postgresql://localhost:5432/techmonitor
   PGUSER=your_postgres_user
   PGPASSWORD=your_postgres_password
   ```

## Running the Backend

1. Navigate to the backend directory:
   ```bash
   cd spring-backend
   ```
2. Build and run the application:
   ```bash
   ./mvnw spring-boot:run
   ```
   The backend will start on `http://localhost:5001`.

## Running the Frontend

1. Navigate to the root directory (or `client/` if separate):
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:5000` and is configured to proxy API requests to port 5001.

## Environment Variables

Ensure you have a `.env` file in the root directory for any frontend secrets if needed, though most configuration is handled via Spring Boot properties for the backend.

## Production Build

1. **Frontend**: `npm run build` (outputs to `dist/`)
2. **Backend**: `cd spring-backend && ./mvnw clean package` (outputs a JAR file in `target/`)

You can then run the JAR:
```bash
java -jar spring-backend/target/error-tracker-api-1.0.0.jar
```
