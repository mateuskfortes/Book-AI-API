# Book AI API

API de autenticação e explicação com JWT, PostgreSQL, Docker e Spring Boot.

## Features

- User registration (sign up) with email and password
- User authentication (sign in) with JWT tokens
- Token validation
- Password hashing using BCrypt
- PostgreSQL database for user storage
- Docker Compose for easy deployment

## API Endpoints

### Auth

#### Sign Up

**POST** `/api/auth/signup`

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

Response `201 Created`:

```json
{
  "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...",
  "email": "user@example.com",
  "userId": 1
}
```

#### Sign In

**POST** `/api/auth/signin`

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

Response `200 OK`:

```json
{
  "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...",
  "email": "user@example.com",
  "userId": 1
}
```

#### Validate Token

**GET** `/api/auth/validate`

Headers:

```http
Authorization: Bearer <your_jwt_token>
```

Response `200 OK`:

```json
{
  "valid": true
}
```

### AI

#### Explanation

**POST** `/api/ai/explanation`

Headers:

```http
Authorization: Bearer <your_jwt_token>
```

```json
{
  "question": "What is the capital of Brazil?"
}
```

Response `200 OK`:

```json
{
  "explanation": "..."
}
```

## Running with Docker Compose

### Start the application

```bash
docker-compose up -d
```

This will:

- Start PostgreSQL on port 5432
- Build and start the Spring Boot API on port 8080
- Create the `bookaidb` database
- Automatically create the `users` table (via Hibernate)

### Stop the application

```bash
docker-compose down
```

### View logs

```bash
docker-compose logs -f app
```

## Environment Variables

Configure in `.env` or `compose.yaml`:

- `DB_HOST`: PostgreSQL host
- `DB_PORT`: PostgreSQL port
- `DB_NAME`: Database name
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password
- `JWT_SECRET`: Secret key for JWT signing
- `JWT_EXPIRATION`: Token expiration time in milliseconds
- `GEMINI_API_KEY`: Gemini API key
- `EXPLANATION_AI_MODEL`: Model used for explanations

## Testing

### cURL examples

**Register**

```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

**Login**

```bash
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

**Validate Token**

```bash
curl -X GET http://localhost:8080/api/auth/validate \
  -H "Authorization: Bearer <your_token>"
```

**AI Explanation**

```bash
curl -X POST http://localhost:8080/api/ai/explanation \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{"question":"What is the capital of Brazil?"}'
```

## Technology Stack

- Kotlin
- Spring Boot 4.1.0
- PostgreSQL 16
- JWT (JSON Web Tokens)
- BCrypt
- Java 21
- Docker & Docker Compose
