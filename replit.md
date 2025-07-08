# IT Service Booking System

## Overview

A complete IT consultancy booking system with modern UI and admin dashboard. The system provides a professional booking form for clients and a comprehensive admin panel for managing bookings, clients, and analytics. Built with React, Express.js, PostgreSQL, and includes secure admin authentication.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **Authentication**: Session-based admin authentication
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: bcrypt password hashing + express-session
- **Validation**: Zod for request validation
- **Session Management**: Memory store with proper security configuration
- **API Design**: RESTful endpoints with authentication middleware

## Key Components

### Frontend Components
- **BookingForm**: Collapsible service selection with modern styling
- **LoginForm**: Secure admin authentication interface
- **AdminDashboard**: Analytics cards, booking management, client CRM
- **Sidebar Layout**: Professional admin interface with responsive design
- **Authentication**: useAuth hook for session management

### Backend Components
- **Authentication System**: Login/logout endpoints with session management
- **Database Layer**: Drizzle ORM with PostgreSQL adapter
- **Storage Service**: Full CRUD operations for bookings and clients
- **Route Protection**: Middleware for admin-only endpoints
- **Validation**: Comprehensive Zod schemas for all data

### Database Schema
- **Users**: Admin accounts with bcrypt hashed passwords
- **Clients**: Customer information with contact details and registration tracking
- **Bookings**: Service records with status tracking, auto-generated IDs, and client relationships

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **Session Security**: HTTP-only cookies, proper expiration
- **Route Protection**: Authentication middleware for admin endpoints
- **Input Validation**: Zod validation on all user inputs
- **SQL Injection Prevention**: Drizzle ORM parameterized queries

## Services Offered

1. **IT Consultancy**: Strategic guidance and expert advice
2. **Networking**: Professional network setup and optimization
3. **Computer Maintenance**: Hardware and software maintenance solutions
4. **Cybersecurity**: Security assessment and protection services

## Data Flow

1. **Public Booking**: Client submits form → service selection → client creation/lookup → booking creation → confirmation with tracking ID
2. **Admin Authentication**: Login form → credential validation → session creation → dashboard access
3. **Admin Management**: Dashboard analytics → booking status updates → client management → real-time updates
4. **Session Management**: Authentication checks → protected route access → secure logout

## External Dependencies

### Database
- **PostgreSQL**: Primary database with Neon serverless hosting
- **Drizzle ORM**: Type-safe database operations
- **Connection Pooling**: WebSocket-based for serverless environments

### Authentication
- **bcrypt**: Password hashing and validation
- **express-session**: Session management with memory store
- **Session Security**: HTTP-only cookies with proper configuration

### UI Framework
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide Icons**: Consistent iconography
- **shadcn/ui**: Pre-built component library

## Deployment Strategy

### Development
- Vite HMR for frontend development
- Express server with TypeScript via tsx
- Database schema push with Drizzle Kit
- Default admin user auto-creation

### Production
- Vite build optimization
- ESBuild server bundling
- Environment-based database configuration
- Session security with HTTPS

### Database Management
- Push-based schema deployment
- Type-safe migrations with Drizzle
- Automatic relationship management

## Default Credentials

- **Username**: admin
- **Password**: admin

*These should be changed in production environments*

## Recent Changes

- **July 08, 2025**: Initial system setup with booking form and basic admin panel
- **July 08, 2025**: Added secure admin authentication with bcrypt password hashing
- **July 08, 2025**: Implemented sidebar layout for admin dashboard with responsive design
- **July 08, 2025**: Protected all admin endpoints with authentication middleware
- **July 08, 2025**: Created comprehensive README and prepared for GitHub repository

## Future Enhancements

- Employee assignment system for internal booking management
- Email notifications for booking confirmations
- Advanced analytics and reporting features
- Multi-role user management system
- Calendar integration for appointment scheduling

## User Preferences

- **Communication Style**: Simple, everyday language
- **Design Preference**: Modern, professional styling with good color scheme
- **Functionality Focus**: Embeddable booking widget suitable for existing websites
- **Admin Features**: CRM-like client management with booking analytics