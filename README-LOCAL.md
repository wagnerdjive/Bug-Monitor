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

## Google OAuth Integration

To enable Google authentication, follow these steps:

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Select **Web application** as the application type
6. Add the following:
   - **Authorized JavaScript origins**: 
     - `http://localhost:5000` (development)
     - `https://your-domain.com` (production)
   - **Authorized redirect URIs**:
     - `http://localhost:5001/api/oauth2/callback/google` (development)
     - `https://your-domain.com/api/oauth2/callback/google` (production)
7. Save and copy the **Client ID** and **Client Secret**

### 2. Configure Backend (Spring Boot)

Add the following dependencies to `spring-backend/pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-client</artifactId>
</dependency>
```

Add the following to `spring-backend/src/main/resources/application.properties`:

```properties
# Google OAuth2
spring.security.oauth2.client.registration.google.client-id=${GOOGLE_CLIENT_ID}
spring.security.oauth2.client.registration.google.client-secret=${GOOGLE_CLIENT_SECRET}
spring.security.oauth2.client.registration.google.scope=email,profile
spring.security.oauth2.client.registration.google.redirect-uri={baseUrl}/api/oauth2/callback/google
```

### 3. Set Environment Variables

Set the following environment variables:

```bash
# Backend (Spring Boot)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Frontend (Vite) - Enables the Google button
VITE_GOOGLE_AUTH_ENABLED=true
```

### 4. Implement OAuth2 Handler

Create a new controller to handle the OAuth2 callback:

```java
// spring-backend/src/main/java/com/errortracker/controller/OAuth2Controller.java
@RestController
@RequestMapping("/api/oauth2")
public class OAuth2Controller {
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/callback/google")
    public ResponseEntity<?> googleCallback(
            @AuthenticationPrincipal OAuth2User principal,
            HttpServletRequest request) {
        
        String email = principal.getAttribute("email");
        String name = principal.getAttribute("name");
        String picture = principal.getAttribute("picture");
        
        // Find or create user
        User user = userService.findByEmail(email)
            .orElseGet(() -> userService.createFromOAuth(email, name, picture));
        
        // Create session
        HttpSession session = request.getSession(true);
        session.setAttribute("userId", user.getId());
        
        // Redirect to dashboard
        return ResponseEntity.status(HttpStatus.FOUND)
            .header("Location", "/")
            .build();
    }
}
```

### 5. Update Security Configuration

Update `SecurityConfig.java` to include OAuth2 login:

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .oauth2Login(oauth2 -> oauth2
            .authorizationEndpoint(auth -> auth
                .baseUri("/api/oauth2/authorization")
            )
            .redirectionEndpoint(redir -> redir
                .baseUri("/api/oauth2/callback/*")
            )
            .defaultSuccessUrl("/", true)
        )
        // ... rest of your configuration
    ;
    return http.build();
}
```

### 6. Enable Google Auth in Frontend

Set the environment variable to enable the Google button:

```bash
# In your .env file (root directory)
VITE_GOOGLE_AUTH_ENABLED=true
```

When `VITE_GOOGLE_AUTH_ENABLED=true`, the "Coming Soon" label is removed and the Google button becomes clickable, redirecting to `/api/oauth2/authorization/google`.

---

## Production Build

1. **Frontend**: `npm run build` (outputs to `dist/`)
2. **Backend**: `cd spring-backend && ./mvnw clean package` (outputs a JAR file in `target/`)

You can then run the JAR:
```bash
java -jar spring-backend/target/error-tracker-api-1.0.0.jar
```
