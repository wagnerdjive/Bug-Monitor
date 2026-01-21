# TechMonitor - Error Tracking Platform

## Overview

TechMonitor is a real-time error tracking and performance monitoring platform for developers. It allows users to create projects, integrate SDKs into their applications, and monitor error events with detailed stack traces, device info, and breadcrumbs. The application follows a monorepo structure with a React frontend and Spring Boot backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state, with custom hooks for data fetching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming (dark mode default)
- **Forms**: React Hook Form with Zod validation via @hookform/resolvers

### Backend Architecture
- **Framework**: Spring Boot 3.2 with Java 17+
- **Location**: `spring-backend/` directory
- **API Design**: RESTful API with controllers in `spring-backend/src/main/java/com/errortracker/controller/`
- **Data Layer**: Spring Data JPA with repositories
- **Authentication**: Spring Security with session-based authentication (BCrypt password hashing)
- **Session Management**: PostgreSQL-backed sessions via Spring Session JDBC

### Data Storage
- **Database**: PostgreSQL with Spring Data JPA
- **Key Tables**:
  - `users` - User accounts with password authentication
  - `spring_session` / `spring_session_attributes` - Session storage for authentication
  - `projects` - User projects with API keys for SDK integration
  - `error_events` - Error events ingested from client SDKs

### Authentication Flow
- Custom session-based authentication using Spring Security
- BCrypt password hashing for secure password storage
- PostgreSQL-backed sessions for horizontal scalability
- Protected routes require authentication via session cookie
- **Keycloak SSO**: Optional OAuth2/OIDC authentication via Keycloak (enabled via `KEYCLOAK_ENABLED=true`)
- First user (via any auth method) automatically becomes ADMIN

### API Structure
- `/api/register` - User registration
- `/api/login` - User login
- `/api/logout` - User logout
- `/api/auth/user` - Get current authenticated user
- `/api/profile` - User profile management (PUT)
- `/api/projects` - CRUD operations for projects
- `/api/projects/:id/events` - Error events for a project
- `/api/projects/:id/users` - Project team members (GET, DELETE)
- `/api/events/:id` - Individual event details
- `/api/ingest` - Public endpoint for SDK error submission (authenticated via API key)
- `/api/feature-flags` - Get feature flags (keycloakEnabled, emailEnabled)
- `/api/oauth2/authorization/keycloak` - Initiate Keycloak SSO login (Spring Security handles callback)

### Recent Features
- **Profile Management**: Users can update their profile (first name, last name, email, profile image URL) at `/profile`
- **SSO Authentication**: Keycloak SSO integration with feature flag control (requires OAuth2 client configuration)
- **Email Notifications**: SMTP-based email service using Zoho Mail (smtp.zoho.com:465 with SSL)
- **Feature Flags**: Backend-controlled feature flags exposed via `/api/feature-flags`
- **Project Team Management**: New "Team" tab in project details to view and remove assigned users
- **Navigation Update**: Profile link added to sidebar user section
- **RBAC**: Role-based access control (ADMIN/USER roles)

### Email Configuration
- **SMTP Server**: smtp.zoho.com (port 465 with SSL)
- **From Address**: Configured via `app.email.from` property
- **Feature Flag**: Controlled by `app.feature.email-enabled` (default: false)
- **Invitation Emails**: Sent when admin invites new users via `/api/admin/invitations`

### Keycloak SSO Configuration
- **Feature Flag**: Controlled by `app.feature.keycloak-enabled` property
- **OAuth2 Login**: Requires Spring Security OAuth2 client registration
- **Graceful Degradation**: If OAuth2 client is not configured, SSO login is disabled even if flag is true

### Build System
- Development: Vite dev server with HMR on port 5000, Spring Boot on port 5001
- Vite proxies `/api` requests to Spring Boot backend
- Path aliases: `@/` for client src, `@assets/` for attached assets

## External Dependencies

### Database
- PostgreSQL (required, connection via `DATABASE_URL` or individual `PG*` environment variables)
- Spring Session JDBC for session storage

### UI Libraries
- Radix UI primitives (dialogs, dropdowns, forms, etc.)
- Recharts for data visualization
- Lucide React for icons
- date-fns for date formatting

### Key NPM Packages
- `@tanstack/react-query` - Server state management
- `zod` - Schema validation
- `wouter` - Client-side routing
- `react-hook-form` - Form handling

## Development

### Running the Application
1. The `start-dev.sh` script starts both servers:
   - Spring Boot backend on port 5001
   - Vite frontend on port 5000
2. All API requests are proxied from Vite to Spring Boot

### Building for Production
1. Build the Spring Boot JAR: `cd spring-backend && mvn clean package`
2. Build the frontend: `npm run build`
3. Run the Spring Boot JAR with static files served or run both servers
