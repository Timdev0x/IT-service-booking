# IT Service Booking System

A modern, professional booking system for IT consultancy services built with React, Express.js, and PostgreSQL.

## Features

### User Features
- **Service Booking Form**: Clean, modern form with collapsible service selection
- **Multiple IT Services**: Consultancy, Networking, Computer Maintenance, Cybersecurity
- **Real-time Confirmation**: Instant booking confirmation with tracking ID
- **Responsive Design**: Mobile-first, works on all devices

### Admin Features
- **Secure Login**: Admin authentication with bcrypt password hashing
- **Dashboard Analytics**: Overview of bookings, completion rates, and client statistics
- **Booking Management**: Update booking status, delete bookings
- **Client Management**: View all clients with contact information
- **Sidebar Navigation**: Professional admin interface with responsive design

## Technology Stack

### Frontend
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui components
- TanStack Query for state management
- Wouter for routing
- React Hook Form + Zod validation

### Backend
- Express.js + TypeScript
- PostgreSQL with Drizzle ORM
- bcrypt for password hashing
- Express sessions for authentication
- Zod for request validation

### Database
- PostgreSQL (Neon Database)
- Drizzle ORM with migrations
- Relational data modeling

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Timdev0x/IT-service-booking.git
   cd IT-service-booking
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

4.** Download Postgresql** https://get.enterprisedb.com/postgresql/postgresql-17.5-2-windows-x64.exe
   ```bash
psql -c "CREATE DATABASE it_booking_system;"

   # Database configuration 
   DATABASE_URL=your_database_url
   SESSION_SECRET=your_session_secret
   ```

5. **Push database schema**
   ```bash
   npm run db:push
   ```

6. **Start the application**
   ```bash
   npm run dev
   ```

## Default Admin Credentials

- **Username**: admin
- **Password**: admin

*Please change these credentials in production!*

## API Endpoints

### Public Endpoints
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:id` - Get booking details

### Admin Endpoints (Protected)
- `POST /api/login` - Admin login
- `POST /api/logout` - Admin logout
- `GET /api/auth/check` - Check authentication status
- `GET /api/bookings` - Get all bookings
- `PATCH /api/bookings/:id` - Update booking status
- `DELETE /api/bookings/:id` - Delete booking
- `GET /api/clients` - Get all clients
- `GET /api/analytics` - Get booking analytics

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
├── server/                 # Express backend
│   ├── routes.ts           # API routes
│   ├── storage.ts          # Database layer
│   └── db.ts               # Database connection
├── shared/                 # Shared types and schemas
│   └── schema.ts           # Database schema
└── package.json
```

## Database Schema

### Users Table
- Admin user accounts with hashed passwords

### Clients Table
- Customer information (name, email, phone, registration date)

### Bookings Table
- Service bookings with client relationships
- Status tracking (pending, completed)
- Automatic booking ID generation

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio

### Adding New Services
1. Update the `services` array in `client/src/components/booking-form.tsx`
2. Add corresponding icons and colors
3. Update service validation schemas if needed

### Database Migrations
Use Drizzle's push-based approach:
```bash
npm run db:push
```

## Deployment

The application is optimized for deployment on Replit with:
- Environment-based configuration
- Automatic database provisioning
- Built-in session management
- Production-ready bundling

## Security Features

- Password hashing with bcrypt
- Session-based authentication
- CSRF protection through proper session configuration
- Input validation with Zod
- SQL injection prevention with Drizzle ORM

## Future Enhancements

- Employee assignment to bookings
- Email notifications
- Calendar integration
- Advanced analytics and reporting
- Multi-role user management
- Payment processing integration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
