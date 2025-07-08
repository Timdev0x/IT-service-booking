# Professional Services Booking System

## Overview

This is a full-stack web application for managing professional service bookings. It provides a modern, responsive interface for clients to book services and an admin dashboard for managing bookings and clients. The system is built with React, Express.js, and uses PostgreSQL for data persistence.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Validation**: Zod for request validation
- **Session Management**: Built-in session handling
- **API Design**: RESTful endpoints with JSON responses

## Key Components

### Frontend Components
- **BookingForm**: Main booking interface with service selection and form validation
- **AdminDashboard**: Management interface for viewing and updating bookings
- **UI Components**: Comprehensive set of reusable components based on shadcn/ui

### Backend Components
- **Database Layer**: Drizzle ORM with PostgreSQL adapter
- **Storage Service**: Abstracted data access layer with interface-based design
- **Route Handlers**: Express routes for booking and client management
- **Validation**: Zod schemas for data validation

### Database Schema
- **Users**: Admin user accounts with username/password authentication
- **Clients**: Customer information including contact details
- **Bookings**: Service booking records with status tracking and client relationships

## Data Flow

1. **Booking Creation**: Client submits booking form → validation → client creation/lookup → booking creation → confirmation
2. **Admin Management**: Admin views dashboard → fetches bookings/analytics → updates booking status → real-time updates
3. **Data Persistence**: All operations use Drizzle ORM → PostgreSQL database with relationship constraints

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL provider
- **Connection**: WebSocket-based connection pooling for serverless environments

### UI Framework
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide Icons**: Icon library for consistent iconography

### Development Tools
- **Vite**: Build tool and development server
- **ESBuild**: Production bundling
- **TypeScript**: Type safety across the application

## Deployment Strategy

### Development
- Vite development server for frontend hot reloading
- Express server with TypeScript compilation via tsx
- Database migrations through Drizzle Kit

### Production
- Vite build process generates optimized static assets
- ESBuild bundles server code for Node.js deployment
- Environment-based configuration for database connections

### Database Management
- Drizzle migrations stored in `/migrations` directory
- Schema definitions in shared directory for type safety
- Push-based deployment with `db:push` command

## Changelog

- July 08, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.