# Madani Course Management System

A professional MERN application for Student Management with Courses and Exam pages.

## Quick Start

1. Install all dependencies:
```bash
npm run install:all
```

2. Start both frontend and backend servers:
```bash
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend development server on http://localhost:5173

## Manual Start

Alternatively, you can start the servers manually:

### Backend
```bash
cd backend
npm run dev
```

### Frontend
```bash
cd frontend
npm run dev
```

## Docker Deployment

You can also run the application using Docker:

```bash
docker-compose up
```

This will start:
- MongoDB on port 27017
- Backend server on port 5000
- Frontend server on port 3000

## Default Admin Credentials

Email: admin@example.com
Password: admin123

## API Documentation

Import the Postman collection `Madani Course Management System.postman_collection.json` for API testing.