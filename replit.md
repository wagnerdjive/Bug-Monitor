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

### API Structure
- `/api/register` - User registration
- `/api/login` - User login
- `/api/logout` - User logout
- `/api/auth/user` - Get current authenticated user
- `/api/projects` - CRUD operations for projects
- `/api/projects/:id/events` - Error events for a project
- `/api/events/:id` - Individual event details
- `/api/ingest` - Public endpoint for SDK error submission (authenticated via API key)

### Build System
- Development: Vite dev server with HMR on port 5000, Spring Boot on port 5001
- Vite proxies `/api` requests to Spring Boot backend
- Path aliases: `@/` for client src, `@shared/` for shared code, `@assets/` for assets

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
