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

## Common Issues & Troubleshooting

### Java Version Error (`UnsupportedClassVersionError`)
If you see an error like `java.lang.UnsupportedClassVersionError: ... has been compiled by a more recent version of the Java Runtime (class file version 61.0)`, but `javac -version` shows `17`, it means your **Runtime (java)** is different from your **Compiler (javac)**.

**Solution**: 
1. Check which `java` version is being used: `java -version`.
2. Ensure `java` also points to version 17. On Ubuntu, you can use:
   ```bash
   sudo update-alternatives --config java
   ```
   And select the version 17.

### Script Path Errors
If `start-dev.sh` still shows path errors, make sure you are running it from the **root** directory of the project, not from inside the `client` folder.
```bash
# Correct way (from root):
npm run dev

# If you are inside client/, go back:
cd ..
npm run dev
```

## Feature Flags

TechMonitor uses feature flags to enable/disable optional features. These are controlled via environment variables on the backend:

| Flag | Environment Variable | Default | Description |
|------|---------------------|---------|-------------|
| Keycloak SSO | `KEYCLOAK_ENABLED` | `false` | Enable Keycloak OAuth2/OIDC authentication |
| Email Notifications | `EMAIL_ENABLED` | `false` | Enable SMTP email sending for invitations |

The frontend automatically fetches these flags from `/api/feature-flags` and adjusts the UI accordingly.

## Keycloak SSO Integration (Optional)

TechMonitor supports Keycloak for Single Sign-On (SSO) authentication. Keycloak is a free, open-source identity and access management solution.

### 1. Set Up Keycloak Server

1. Download and run Keycloak from [keycloak.org](https://www.keycloak.org/downloads)
   ```bash
   # Using Docker
   docker run -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:latest start-dev
   ```

2. Access Keycloak Admin Console at `http://localhost:8080/admin`

3. Create a new realm called `techmonitor`

4. Create a new client:
   - **Client ID**: `techmonitor`
   - **Client Protocol**: `openid-connect`
   - **Access Type**: `confidential`
   - **Valid Redirect URIs**: 
     - `http://localhost:5001/api/oauth2/callback/keycloak` (development)
     - `https://your-domain.com/api/oauth2/callback/keycloak` (production)
   - **Web Origins**: `+`

5. Go to the **Credentials** tab and copy the **Secret**

### 2. Configure Environment Variables

Set the following environment variables:

```bash
# Enable Keycloak authentication
KEYCLOAK_ENABLED=true

# Keycloak configuration
KEYCLOAK_CLIENT_ID=techmonitor
KEYCLOAK_CLIENT_SECRET=your-client-secret
KEYCLOAK_ISSUER_URI=http://localhost:8080/realms/techmonitor

# Application base URL (for redirect URIs)
APP_BASE_URL=http://localhost:5000
```

### 3. First User is Admin

The first user to authenticate via Keycloak (or any method) automatically becomes an ADMIN. Subsequent users are assigned the USER role.

## SMTP Email Configuration (Optional)

TechMonitor can send invitation emails via SMTP when the email feature is enabled.

### 1. Configure SMTP Server

Set the following environment variables:

```bash
# Enable email sending
EMAIL_ENABLED=true

# SMTP configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Email sender settings
EMAIL_FROM=noreply@techmonitor.app
APP_BASE_URL=http://localhost:5000
```

### 2. Gmail App Password (if using Gmail)

1. Enable 2-Step Verification on your Google account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Generate a new app password for "Mail"
4. Use this password as `SMTP_PASSWORD`

### 3. Email Behavior

When `EMAIL_ENABLED=true`:
- Invitation emails are sent automatically when creating invitations
- Password reset emails are sent when requested

When `EMAIL_ENABLED=false`:
- Email content is logged to the console (useful for development)
- The invitation token is visible in the logs

---

## Production Build

1. **Frontend**: `npm run build` (outputs to `dist/`)
2. **Backend**: `cd spring-backend && ./mvnw clean package` (outputs a JAR file in `target/`)

You can then run the JAR:
```bash
java -jar spring-backend/target/error-tracker-api-1.0.0.jar
```
