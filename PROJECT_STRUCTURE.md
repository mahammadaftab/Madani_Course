# Project Structure

## Root Directory
```
madani-course/
├── backend/                    # Backend application
├── frontend/                   # Frontend application
├── docker-compose.yml          # Docker Compose configuration
├── render.yaml                 # Render deployment configuration
└── README.md                   # Project documentation
```

## Backend Structure
```
backend/
├── src/
│   ├── config/                 # Configuration files
│   │   └── db.js              # Database configuration
│   ├── controllers/            # Request handlers
│   │   ├── auth.controller.js
│   │   ├── course.controller.js
│   │   ├── exam.controller.js
│   │   ├── gridfs.controller.js
│   │   ├── student.controller.js
│   │   └── upload.controller.js
│   ├── middleware/             # Custom middleware
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   ├── validation.middleware.js
│   │   └── rateLimiter.js
│   ├── models/                 # Database models
│   │   ├── Course.js
│   │   ├── Exam.js
│   │   ├── Student.js
│   │   ├── User.js
│   │   └── index.js
│   ├── routes/                 # API routes
│   │   ├── auth.routes.js
│   │   ├── course.routes.js
│   │   ├── exam.routes.js
│   │   ├── export.routes.js
│   │   ├── gridfs.routes.js
│   │   ├── student.routes.js
│   │   └── upload.routes.js
│   ├── scripts/                # Utility scripts
│   │   └── seedAdmin.js
│   ├── utils/                  # Utility functions
│   │   ├── auth.utils.js
│   │   ├── csv.utils.js
│   │   └── logger.js
│   ├── logs/                   # Log files
│   └── server.js               # Application entry point
├── uploads/                    # File uploads directory
├── .env                        # Environment variables
├── .gitignore                  # Git ignore file
├── Dockerfile                  # Docker configuration
├── API_DOCUMENTATION.md        # API documentation
├── package.json                # NPM dependencies and scripts
└── package-lock.json
```

## Frontend Structure
```
frontend/
├── public/                     # Static assets
│   └── favicon.ico
├── src/
│   ├── components/             # Reusable components
│   │   ├── Header.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── Sidebar.tsx
│   │   └── StudentForm.tsx
│   ├── hooks/                  # Custom hooks
│   │   ├── useAuth.ts
│   │   └── useStudentForm.ts
│   ├── pages/                  # Page components
│   │   ├── Courses.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Exam.tsx
│   │   ├── Login.tsx
│   │   ├── StudentDetails.tsx
│   │   └── Students.tsx
│   ├── services/               # API service layer
│   │   ├── apiClient.ts
│   │   ├── authService.ts
│   │   ├── courseService.ts
│   │   ├── examService.ts
│   │   └── studentService.ts
│   ├── types/                  # TypeScript types
│   │   └── index.ts
│   ├── utils/                  # Utility functions
│   │   └── index.ts
│   ├── validation/             # Form validation schemas
│   │   ├── examSchema.ts
│   │   └── studentSchema.ts
│   ├── App.css                 # Global styles
│   ├── App.test.tsx            # App tests
│   ├── App.tsx                 # Main App component
│   ├── index.css               # Tailwind CSS imports
│   ├── main.tsx                # React entry point
│   └── setupTests.ts           # Test setup
├── .gitignore                  # Git ignore file
├── Dockerfile                  # Docker configuration
├── nginx.conf                  # Nginx configuration
├── package.json                # NPM dependencies and scripts
├── package-lock.json
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── tsconfig.app.json
├── tsconfig.node.json
├── vercel.json                 # Vercel configuration
└── vite.config.ts              # Vite configuration
```

## Key Features Implemented

### Backend Features
1. **MVC Architecture**
   - Models for Student, Course, Exam, and User
   - Controllers for handling business logic
   - Routes for API endpoints

2. **Security**
   - JWT-based authentication
   - Role-based access control (admin/user)
   - Input validation with express-validator
   - Rate limiting with express-rate-limit
   - Security headers with helmet

3. **Data Management**
   - MongoDB with Mongoose ODM
   - GridFS for file storage
   - Pagination and filtering for large datasets
   - CSV export functionality

4. **Error Handling**
   - Comprehensive error middleware
   - Logging with Winston
   - Custom error classes

5. **Deployment**
   - Docker support
   - Render deployment configuration
   - Environment-based configuration

### Frontend Features
1. **Modern React Development**
   - TypeScript for type safety
   - React Hooks for state management
   - React Router for navigation
   - React Query for server state management

2. **UI/UX**
   - Tailwind CSS v4 for styling
   - Responsive design
   - Framer Motion for animations
   - Lucide React for icons
   - Form validation with React Hook Form + Zod

3. **Components**
   - ProtectedRoute for authentication
   - Reusable UI components
   - Custom hooks for business logic
   - Service layer for API calls

4. **Features**
   - Student management (CRUD)
   - Course management
   - Exam management with image upload
   - Student details view
   - CSV export and print functionality
   - Search and filtering

5. **Deployment**
   - Vercel deployment configuration
   - Docker support
   - Nginx for production serving

## Development Workflow

### Local Development
1. Use docker-compose for easy setup:
   ```bash
   docker-compose up --build
   ```

2. Or run services separately:
   - Start MongoDB
   - Run backend: `cd backend && npm run dev`
   - Run frontend: `cd frontend && npm run dev`

### Production Deployment
1. **Frontend**: Deploy to Vercel
2. **Backend**: Deploy to Render
3. **Database**: Use MongoDB Atlas

### Testing
1. Unit tests with Jest
2. Integration tests with Supertest
3. End-to-end tests with Cypress (optional)

## Environment Variables

### Backend
- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT signing
- `JWT_EXPIRE`: JWT expiration time
- `ADMIN_USERNAME`: Admin user email
- `ADMIN_PASSWORD`: Admin user password

### Frontend
- `REACT_APP_API_URL`: Backend API URL (for production)

## CI/CD
- GitHub Actions for testing
- Automatic deployments to Vercel and Render
- Docker image building

This structure provides a scalable, maintainable, and production-ready application following modern development practices.