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
3. Execute the following SQL script to create the necessary tables:

### Database Schema (PostgreSQL)

```sql
-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    profile_image_url VARCHAR(255),
    role VARCHAR(50) NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE
);

-- Projects Table
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    platform VARCHAR(255) NOT NULL,
    api_key VARCHAR(255) UNIQUE NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITHOUT TIME ZONE
);

-- Error Events Table
CREATE TABLE error_events (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id),
    type VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'unresolved',
    severity VARCHAR(50) NOT NULL DEFAULT 'medium',
    message TEXT NOT NULL,
    stack_trace TEXT,
    device_info JSONB,
    platform_info JSONB,
    tags JSONB,
    breadcrumbs JSONB,
    occurred_at TIMESTAMP WITHOUT TIME ZONE,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    trace_id VARCHAR(255),
    user_name VARCHAR(255)
);

-- Invitations Table
CREATE TABLE invitations (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    invited_by INTEGER NOT NULL REFERENCES users(id),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITHOUT TIME ZONE,
    expires_at TIMESTAMP WITHOUT TIME ZONE
);

-- Project-User Assignments (RBAC)
CREATE TABLE project_users (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    role VARCHAR(50) NOT NULL DEFAULT 'VIEWER',
    created_at TIMESTAMP WITHOUT TIME ZONE,
    UNIQUE(project_id, user_id)
);

-- Spring Session Tables (Required for Authentication)
CREATE TABLE SPRING_SESSION (
        PRIMARY_ID CHAR(36) NOT NULL,
        SESSION_ID CHAR(36) NOT NULL,
        CREATION_TIME BIGINT NOT NULL,
        LAST_ACCESS_TIME BIGINT NOT NULL,
        MAX_INACTIVE_INTERVAL INTEGER NOT NULL,
        EXPIRY_TIME BIGINT NOT NULL,
        PRINCIPAL_NAME VARCHAR(100),
        CONSTRAINT SPRING_SESSION_PK PRIMARY KEY (PRIMARY_ID)
);

CREATE UNIQUE INDEX SPRING_SESSION_IX1 ON SPRING_SESSION (SESSION_ID);
CREATE INDEX SPRING_SESSION_IX2 ON SPRING_SESSION (EXPIRY_TIME);
CREATE INDEX SPRING_SESSION_IX3 ON SPRING_SESSION (PRINCIPAL_NAME);

CREATE TABLE SPRING_SESSION_ATTRIBUTES (
        SESSION_PRIMARY_ID CHAR(36) NOT NULL,
        ATTRIBUTE_NAME VARCHAR(200) NOT NULL,
        ATTRIBUTE_BYTES BYTEA NOT NULL,
        CONSTRAINT SPRING_SESSION_ATTRIBUTES_PK PRIMARY KEY (SESSION_PRIMARY_ID, ATTRIBUTE_NAME),
        CONSTRAINT SPRING_SESSION_ATTRIBUTES_FK FOREIGN KEY (SESSION_PRIMARY_ID) REFERENCES SPRING_SESSION(PRIMARY_ID) ON DELETE CASCADE
);
```

4. Set up the following environment variables (or update `spring-backend/src/main/resources/application.properties`):
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
