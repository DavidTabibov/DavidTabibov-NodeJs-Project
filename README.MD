# Business Cards API Project

A RESTful API for managing business cards and users with authentication, authorization, and comprehensive error handling.

## Core Features

- Complete user management system (register, login, update, delete)
- Business card management (create, read, update, delete)
- Role-based authorization (Regular, Business, Admin users)
- User blocking after failed login attempts
- Automatic business card number generation
- Comprehensive error logging system

## Technical Stack

- Node.js & Express.js
- MongoDB (supports both local and Atlas)
- JWT for authentication
- Bcrypt for password hashing
- Joi for input validation
- Morgan for request logging
- CORS for security

## Getting Started

### Prerequisites
- Node.js
- MongoDB (local or Atlas account)
- Git

### Installation
2. Install dependencies:
```bash
npm install
```

3. Environment setup:
- Copy .env.example to .env
- Update the following variables:
```env
# Server Configuration
PORT=3000
NODE_ENV=development
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/business-cards
MONGODB_URI_ATLAS=mongodb+srv://davidtabibov2:f7Sd457Sd!$@cluster0.gndhj.mongodb.net/business-cards?retryWrites=true&w=majority
# JWT Configuration
JWT_SECRET=your_jwt_secret_key
# CORS Configuration
ALLOWED_ORIGIN=http://localhost:5173
```

4. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Initial Data

The system includes three pre-configured users:

1. Regular User
   - Email: regular@example.com
   - Password: Aa123456!
   - Role: Regular user

2. Business User
   - Email: business@example.com
   - Password: Aa123456!
   - Role: Business user

3. Admin User
   - Email: admin@example.com
   - Password: Aa123456!
   - Role: Admin

## API Endpoints

### Authentication

```
POST /api/users/login          - User login
POST /api/users               - User registration
```

### Users

```
GET /api/users/:id            - Get user details (own profile or admin)
GET /api/users               - Get all users (admin only)
PUT /api/users/:id           - Update user details (own profile)
PATCH /api/users/:id         - Change business status
DELETE /api/users/:id        - Delete user (own profile or admin)
```

### Cards

```
GET /api/cards
GET /api/cards/my-cards
GET /api/cards/:id
POST /api/cards (business only)
PUT /api/cards/:id
PATCH /api/cards/:id (like/unlike)
PATCH /api/cards/:id/biz-number (admin only)
DELETE /api/cards/:id
```

## Security Features

1. Password Hashing
   - All passwords are hashed using bcrypt
   - Salt rounds: 10

2. JWT Authentication
   - Tokens include: _id, isBusiness, isAdmin
   - Token expiration: 24 hours

3. User Blocking
   - Blocks user after 3 failed login attempts
   - Block duration: 24 hours
   - Automatic unblock after duration

4. Input Validation
   - Comprehensive Joi validation for all inputs
   - Custom error messages
   - Data sanitization

## Error Handling

- All errors are logged to daily files
- Error log format includes:
  - Timestamp
  - Error message
  - Request details
  - Stack trace (development only)

## Project Structure
```
cardsserver/
├── app.js                 # Application entry point
├── package.json
├── .env
├── .gitignore
└── src/
    ├── Config/
    │   ├── db.js                  # Database connection configuration
    │   └── initialData.js         # Initial users and cards setup
    ├── Controllers/
    │   ├── authController.js      # Authentication operations
    │   ├── userController.js      # User operations (CRUD)
    │   ├── cardController.js      # Basic card operations
    │   ├── cardOperations.js      # Advanced card operations
    │   └── cardUtils.js           # Card helper functions
    ├── Middleware/
    │   ├── authMiddleware.js      # JWT verification and role checks
    │   ├── errorMiddleware.js     # Error handling and logging
    │   ├── corsMiddleware.js      # CORS configuration
    │   └── loggerMiddleware.js    # Request logging
    ├── Public/                    # Static public files
    │   ├── Images/                 # Image assets
    │   │   └── default-card-image.jpg  # Default card image
    ├── Schemas/
    │   ├── userSchema.js         # User data model
    │   └── cardSchema.js         # Card data model
    ├── Routes/
    │   ├── userRoutes.js         # User routes definitions
    │   └── cardRoutes.js         # Card routes definitions
    ├── Services/
    │   ├── tokenService.js       # JWT handling
    │   ├── bizNumberService.js    # Business number management
    │   └── loginAttemptsService.js # Login attempts tracking
    └── Utils/
        └── validators/
            ├── userValidators.js  # User input validation
            └── cardValidators.js  # Card input validation

```

## Scripts

Available commands:
```bash
# Start in development mode with auto-reload
npm run dev

# Start in production mode
npm start

# Run tests
npm test
```

## Development Notes

- Server entry point is `app.js`
- Error logs are stored in `/src/Logs`
- Development mode includes:
  - Detailed error messages
  - Nodemon auto-restart
  - Environment-specific logging
- Production mode:
  - Optimized for performance
  - Limited error details
  - Security enhancements
- Environment variables control:
  - MongoDB connection (local/Atlas)
  - CORS settings
  - JWT secrets
- Uses cross-env for environment management
- CORS is configured for frontend application

## Troubleshooting

1. MongoDB Connection Issues:
   - Check if MongoDB is running locally
   - Verify connection string in .env
   - Ensure network access for Atlas

2. Server Start Issues:
   - Check port availability (default 3000)
   - Verify all dependencies are installed
   - Check for environment variable issues

3. Authentication Issues:
   - Verify JWT_SECRET is set
   - Check token expiration
   - Ensure correct token format in requests

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.