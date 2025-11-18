# Madani Course Management System

A full-stack MERN application for managing students, courses, and exams with a modern UI built with React, Tailwind CSS, and Vite.

## Features

- Student management with CRUD operations
- Course management
- Exam management with image upload
- Role-based access control (admin)
- Responsive design with Tailwind CSS
- Form validation with React Hook Form + Zod
- Data fetching with React Query
- CSV export and print functionality
- Docker support for local development
- Deployment configurations for Vercel and Render

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tool
- Tailwind CSS v4 for styling
- React Router v6 for routing
- React Query for data fetching
- React Hook Form + Zod for form validation
- Framer Motion for animations
- Lucide React for icons

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- GridFS for image storage
- Helmet for security
- Express Rate Limit for rate limiting
- Winston for logging
- Joi and Express Validator for validation

## Getting Started

### Prerequisites
- Node.js (v18 or later)
- MongoDB (local or Atlas)
- Docker (optional, for containerization)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Madani_Course
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create a `.env` file in the backend directory:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/madani_course
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d
ADMIN_USERNAME=admin@example.com
ADMIN_PASSWORD=password123
```

5. Create uploads directory for file storage:
```bash
mkdir backend/uploads
```

### Running the Application

#### Option 1: Using Docker (Recommended for local development)
```bash
# From the root directory
docker-compose up --build
```

#### Option 2: Running services separately

1. Start MongoDB (if using local instance):
```bash
mongod
```

2. Start the backend:
```bash
cd backend
npm run dev
```

3. Start the frontend:
```bash
cd frontend
npm run dev
```

### Seeding Initial Data

To create an initial admin user:
```bash
cd backend
npm run seed:admin
```

## Deployment

### Deploying to Vercel (Frontend)

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Set the following environment variables in Vercel:
   - `REACT_APP_API_URL` - Your backend API URL

### Deploying to Render (Backend)

1. Push your code to a GitHub repository
2. Connect your repository to Render
3. Set the following environment variables in Render:
   - `MONGO_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Your JWT secret
   - `ADMIN_USERNAME` - Admin username
   - `ADMIN_PASSWORD` - Admin password

### Docker Deployment

You can also deploy using Docker:

1. Build and run with docker-compose:
```bash
docker-compose up --build -d
```

## API Documentation

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register (admin only)

### Students
- `GET /api/students` - Get all students (with pagination and filters)
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create student (admin only)
- `PUT /api/students/:id` - Update student (admin only)
- `DELETE /api/students/:id` - Delete student (admin only)

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create course (admin only)
- `PUT /api/courses/:id` - Update course (admin only)
- `DELETE /api/courses/:id` - Delete course (admin only)

### Exams
- `GET /api/exam` - Get exam
- `PUT /api/exam` - Update exam (admin only)

### File Uploads
- `POST /api/uploads` - Upload file (admin only)
- `GET /api/uploads/:id` - Get file
- `DELETE /api/uploads/:id` - Delete file (admin only)

### Export
- `GET /api/export/students` - Export students to CSV (admin only)

## Folder Structure

```
madani-course/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── scripts/
│   │   └── server.js
│   ├── uploads/
│   ├── .env
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── validation/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── vite.config.ts
│   └── package.json
├── docker-compose.yml
└── render.yaml
```

## Environment Variables

### Backend (.env)
| Variable | Description | Required |
|----------|-------------|----------|
| NODE_ENV | Environment (development/production) | Yes |
| PORT | Server port | Yes |
| MONGO_URI | MongoDB connection string | Yes |
| JWT_SECRET | Secret for JWT token signing | Yes |
| JWT_EXPIRE | JWT token expiration time | Yes |
| ADMIN_USERNAME | Admin username/email | Yes |
| ADMIN_PASSWORD | Admin password | Yes |

### Frontend (Vite)
| Variable | Description | Required |
|----------|-------------|----------|
| REACT_APP_API_URL | Backend API URL | Yes (for production) |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue on the GitHub repository.