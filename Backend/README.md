# RelevanTrip Backend

A Node.js backend server with Supabase integration for the RelevanTrip travel application.

## Features

- **Authentication**: User registration, login, and JWT token management
- **Places Management**: CRUD operations for travel destinations
- **Trip Planning**: Create, manage, and organize travel itineraries
- **User Profiles**: Personal preferences and travel history
- **Security**: Row Level Security (RLS) and authentication middleware
- **API**: RESTful API endpoints with proper error handling

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Security**: Helmet, CORS, JWT validation
- **Logging**: Morgan

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account and project

## Setup Instructions

### 1. Install Dependencies

```bash
cd Backend
npm install
```

### 2. Environment Configuration

Copy the environment example file and configure your Supabase credentials:

```bash
cp env.example .env
```

Edit `.env` with your Supabase project details:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### 3. Database Setup

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `database/schema.sql`
4. Execute the SQL to create all tables and policies

### 4. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Places

- `GET /api/places` - Get all places (with filters)
- `GET /api/places/:id` - Get place by ID
- `POST /api/places` - Create new place
- `PUT /api/places/:id` - Update place
- `DELETE /api/places/:id` - Delete place
- `GET /api/places/category/:category` - Get places by category

### Trips

- `GET /api/trips` - Get user's trips
- `GET /api/trips/:id` - Get trip by ID
- `POST /api/trips` - Create new trip
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip
- `POST /api/trips/:id/places` - Add place to trip
- `DELETE /api/trips/:id/places/:placeId` - Remove place from trip

### User

- `GET /api/user/preferences` - Get user preferences
- `PUT /api/user/preferences` - Update user preferences
- `GET /api/user/stats` - Get user statistics
- `GET /api/user/favorites` - Get user's favorite places
- `POST /api/user/favorites` - Add place to favorites
- `DELETE /api/user/favorites/:placeId` - Remove place from favorites
- `GET /api/user/history` - Get travel history

### Health Check

- `GET /health` - Server health status

## Database Schema

The application uses the following main tables:

- **profiles**: Extended user information
- **places**: Travel destinations and attractions
- **trips**: User travel itineraries
- **trip_places**: Junction table linking trips and places
- **user_preferences**: User travel preferences
- **user_favorites**: User's favorite places
- **reviews**: User reviews for places

## Security Features

- **Row Level Security (RLS)**: Database-level access control
- **JWT Authentication**: Secure token-based authentication
- **CORS Protection**: Configurable cross-origin resource sharing
- **Input Validation**: Request body validation and sanitization
- **Error Handling**: Comprehensive error handling without exposing sensitive information

## Development

### Project Structure

```
Backend/
├── config/          # Configuration files
├── database/        # Database schema and migrations
├── middleware/      # Custom middleware
├── routes/          # API route handlers
├── server.js        # Main server file
├── package.json     # Dependencies and scripts
└── README.md        # This file
```

### Adding New Routes

1. Create a new route file in the `routes/` directory
2. Import and use it in `server.js`
3. Follow the existing pattern for error handling and authentication

### Testing

```bash
# Run tests (when implemented)
npm test

# Run with coverage
npm run test:coverage
```

## Deployment

### Environment Variables

Ensure all required environment variables are set in production:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `PORT`
- `NODE_ENV`
- `CORS_ORIGIN`

### Production Considerations

- Use a process manager like PM2
- Set up reverse proxy (Nginx/Apache)
- Enable HTTPS
- Configure proper logging
- Set up monitoring and health checks

## Troubleshooting

### Common Issues

1. **Supabase Connection Error**: Verify your environment variables
2. **CORS Issues**: Check the `CORS_ORIGIN` setting
3. **Authentication Failures**: Ensure JWT tokens are properly formatted
4. **Database Errors**: Verify your Supabase schema is set up correctly

### Logs

The server uses Morgan for HTTP request logging. Check the console output for debugging information.

## Contributing

1. Follow the existing code style
2. Add proper error handling
3. Include input validation
4. Update documentation for new features
5. Test thoroughly before submitting

## License

MIT License - see LICENSE file for details
