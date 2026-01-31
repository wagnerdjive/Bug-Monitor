# TechMonitor (Logra) - Error Monitoring Platform

## Overview

TechMonitor (branded as "Logra") is an error monitoring and tracking platform. The frontend is a React/TypeScript SPA that communicates with a Spring Boot backend. Users can create projects, receive API keys, and monitor error events captured via SDK integrations across multiple platforms (JavaScript, Python, iOS, Android, etc.).

The application supports multi-language localization (English, Portuguese, Spanish), user authentication with role-based access (ADMIN/USER), project management, team invitations, and detailed error event tracking with breadcrumbs, device info, and stack traces.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite (dev server on port 80, proxies `/api` to backend on port 8080)
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with CSS variables for theming
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion
- **Charts**: Recharts for data visualization

### Component Architecture
- Components live in `src/components/` with UI primitives in `src/components/ui/`
- Pages are in `src/pages/` following a file-based structure
- Custom hooks in `src/hooks/` handle authentication, projects, events, and toasts
- Internationalization via `src/i18n/` with JSON locale files

### Authentication & Authorization
- Session-based authentication via Spring Session JDBC
- Role-based access control (ADMIN can manage users/invitations, USER has standard access)
- Protected routes redirect unauthenticated users to `/auth`
- Invitation system for onboarding new team members

### API Communication
- All API calls go through `/api/*` endpoints
- Development proxy configured in `vite.config.ts` to forward to `http://localhost:8080`
- `apiRequest` helper in `src/lib/queryClient.ts` handles fetch with credentials

### Production Deployment
- Build outputs static files to `dist/`
- `server.js` serves the built SPA via Express on configurable port (default 5000)
- Frontend build also outputs to `spring-backend/src/main/resources/static/` for embedded serving

## External Dependencies

### Backend Services
- **Spring Boot Backend**: Java-based REST API running on port 8080
- **PostgreSQL Database**: Stores users, projects, error_events, invitations, and sessions
- **Spring Session JDBC**: Persistent session management

### Third-Party Integrations
- **Keycloak** (optional): SSO authentication when `keycloakEnabled` feature flag is true
- **Email Service** (optional): For sending invitations when `emailEnabled` is true

### Key npm Dependencies
- `@tanstack/react-query`: Server state management
- `@radix-ui/*`: Accessible UI primitives
- `react-hook-form` + `zod`: Form handling and validation
- `recharts`: Data visualization
- `date-fns`: Date formatting
- `framer-motion`: Animations
- `lucide-react`: Icons
- `wouter`: Routing