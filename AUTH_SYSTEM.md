# Authentication System Documentation

## Overview
This API includes a basic authentication system with JWT token support, using PostgreSQL for data storage and Docker for containerization.

## Features
- **User Registration** (Sign Up) with email and password
- **User Authentication** (Sign In) with JWT tokens
- **Token Validation**
- **Password Hashing** using BCrypt
- **PostgreSQL Database** for user storage
- **Docker Compose** for easy deployment

## API Endpoints

### 1. Sign Up (Register)
**POST** `/api/auth/signup`

Request body:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

Response (201 Created):
```json
{
  "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...",
  "email": "user@example.com",
  "userId": 1
}
```

### 2. Sign In (Login)
**POST** `/api/auth/signin`

Request body:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

Response (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...",
  "email": "user@example.com",
  "userId": 1
}
```

### 3. Validate Token
**GET** `/api/auth/validate`

Headers:
```
Authorization: Bearer <your_jwt_token>
```

Response (200 OK):
```json
{
  "valid": true
}
```

## Running with Docker Compose

### Start the application:
```bash
docker-compose up -d
```

This will:
- Start PostgreSQL on port 5432
- Build and start the Spring Boot API on port 8080
- Create the `bookaidb` database
- Automatically create the `users` table (via Hibernate)

### Stop the application:
```bash
docker-compose down
```

### View logs:
```bash
docker-compose logs -f app
```

## Project Structure

```
src/main/kotlin/org/example/bookaiapi/
├── controller/
│   ├── AuthController.kt         # Auth endpoints
│   └── GlobalExceptionHandler.kt # Exception handling
├── service/
│   └── AuthService.kt            # Business logic
├── entity/
│   └── User.kt                   # User model
├── repository/
│   └── UserRepository.kt         # Database access
├── dto/
│   └── AuthDTO.kt                # Request/Response DTOs
├── security/
│   ├── JwtTokenProvider.kt       # JWT token generation
│   └── SecurityConfig.kt         # Security configuration
└── exception/
    └── AuthExceptions.kt         # Custom exceptions
```

## Environment Variables

Configure in `.env` or `docker-compose.yml`:

- `DB_HOST`: PostgreSQL host (default: localhost)
- `DB_PORT`: PostgreSQL port (default: 5432)
- `DB_NAME`: Database name (default: bookaidb)
- `DB_USER`: Database user (default: postgres)
- `DB_PASSWORD`: Database password (default: postgres)
- `JWT_SECRET`: Secret key for JWT signing (⚠️ Change in production!)
- `JWT_EXPIRATION`: Token expiration time in milliseconds (default: 86400000 = 24 hours)

## Error Responses

### User Already Exists (400)
```json
{
  "error": "Email already registered"
}
```

### Invalid Credentials (400)
```json
{
  "error": "Invalid email or password"
}
```

### User Not Found (404)
```json
{
  "error": "User not found"
}
```

## Security Notes

⚠️ **Important for Production:**
1. Change `JWT_SECRET` to a strong, random key
2. Use HTTPS/TLS for all connections
3. Store passwords securely (already hashed with BCrypt)
4. Implement rate limiting for auth endpoints
5. Add CORS configuration if needed
6. Consider adding password complexity requirements
7. Implement refresh token mechanism for better security

## Testing

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

**Login:**
```bash
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

**Validate Token:**
```bash
curl -X GET http://localhost:8080/api/auth/validate \
  -H "Authorization: Bearer <your_token>"
```

## Technology Stack

- **Language**: Kotlin
- **Framework**: Spring Boot 4.1.0
- **Database**: PostgreSQL 16
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: BCrypt
- **JDK**: Java 21
- **Container**: Docker & Docker Compose
