# billeasyAssignment

A RESTful API built with Node.js, Express, and MongoDB for managing book reviews.

## Features

- User registration and login with JWT tokens
- Password hashing with bcrypt
- Add new books (authenticated users only)
- Get all books with pagination
- Get book details with reviews
- Submit reviews (one per user per book)
- Update and delete your own reviews
- Search books by title or author (case-insensitive)
- Partial matching support

## Installation Guide

1. Clone or download this project
2. Install dependencies:
   ```bash
   npm install jsonwebtoken express dotenv bcrypt mongoose
   ```

3. Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/bookreview
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=3000
   ```

4. Start MongoDB service (if using local MongoDB)

5. Run the server:
   ```bash
   node server.js
   ```


## Example Usage with curl

### 1. Register a new user
```bash
curl -X POST http://localhost:3000/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"testuser","email":"test@example.com","password":"123"}'
```

### 2. Login to get JWT token
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123"}'
```

### 3. Add a book (use token from login response)
```bash
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"1984","author":"George Orwell","genre":"Dystopian Fiction"}'
```

### 4. Get all books
```bash
curl http://localhost:3000/books
```

### 5. Search books
```bash
curl "http://localhost:3000/search?title=1984"
```

## Database Schema

### User
- `name` (String, required, unique)
- `email` (String, required, unique)
- `password` (String, required, hashed)

### Book
- `title` (String, required)
- `author` (String, required)
- `genre` (String, required)

### Review
- `book` (ObjectId, ref: Book, required)
- `user` (ObjectId, ref: User, required)
- `rating` (Number, 1-5, required)
- `comment` (String, required)
- `createdAt` (Date)
- `updatedAt` (Date)

