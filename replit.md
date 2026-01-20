# SentryClone - Error Tracking Platform

## Overview

SentryClone is a real-time error tracking and performance monitoring platform for developers. It allows users to create projects, integrate SDKs into their applications, and monitor error events with detailed stack traces, device info, and breadcrumbs. The application follows a monorepo structure with a React frontend, Express backend, and PostgreSQL database.

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

### Legacy Backend (deprecated)
- The original Express.js backend in `server/` is still present but not in use
- The new Spring Boot backend runs on port 5001, with Vite proxying API calls from port 5000

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` defines all database tables
- **Key Tables**:
  - `users` - User accounts (managed by Replit Auth)
  - `sessions` - Session storage for authentication
  - `projects` - User projects with API keys for SDK integration
  - `errorEvents` - Error events ingested from client SDKs
- **Migrations**: Drizzle Kit with `db:push` command for schema sync

### Authentication Flow
- Uses Replit's OpenID Connect provider for authentication
- Session-based auth stored in PostgreSQL
- Protected routes use `isAuthenticated` middleware
- User info accessible via `req.user.claims.sub` for user ID

### API Structure
- `/api/projects` - CRUD operations for projects
- `/api/projects/:id/events` - Error events for a project
- `/api/events/:id` - Individual event details
- `/api/ingest` - Public endpoint for SDK error submission (authenticated via API key)
- `/api/auth/user` - Get current authenticated user

### Build System
- Development: Vite dev server with HMR, proxied through Express
- Production: Vite builds to `dist/public`, esbuild bundles server to `dist/index.cjs`
- Path aliases: `@/` for client src, `@shared/` for shared code

## External Dependencies

### Database
- PostgreSQL (required, connection via `DATABASE_URL` environment variable)
- Drizzle ORM for type-safe database queries
- connect-pg-simple for session storage

### Authentication
- Replit Auth (OpenID Connect)
- Passport.js with openid-client strategy
- Required env vars: `ISSUER_URL`, `REPL_ID`, `SESSION_SECRET`

### UI Libraries
- Radix UI primitives (dialogs, dropdowns, forms, etc.)
- Recharts for data visualization
- Lucide React for icons
- date-fns for date formatting

### Key NPM Packages
- `drizzle-orm` / `drizzle-kit` - Database ORM and migrations
- `@tanstack/react-query` - Server state management
- `zod` - Schema validation (shared between client/server)
- `wouter` - Client-side routing
- `express-session` - Session middleware