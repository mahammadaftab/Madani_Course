# API Documentation

## Authentication

### Login
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Auth required**: No
- **Data constraints**:
```json
{
  "email": "[valid email address]",
  "password": "[password in plain text]"
}
```
- **Success Response**:
```json
{
  "success": true,
  "token": "[JWT token]",
  "user": {
    "id": "[user id]",
    "email": "[user email]",
    "role": "admin"
  }
}
```

### Register
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Auth required**: No
- **Data constraints**:
```json
{
  "email": "[valid email address]",
  "password": "[password in plain text]",
  "role": "admin"
}
```
- **Success Response**:
```json
{
  "success": true,
  "token": "[JWT token]",
  "user": {
    "id": "[user id]",
    "email": "[user email]",
    "role": "admin"
  }
}
```

## Students

### Get All Students
- **URL**: `/api/students`
- **Method**: `GET`
- **Auth required**: Yes
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Number of items per page (default: 10)
  - `district` (optional): Filter by district
  - `q` (optional): Search query
- **Success Response**:
```json
{
  "success": true,
  "count": 10,
  "total": 100,
  "page": 1,
  "pages": 10,
  "data": [
    {
      "_id": "[student id]",
      "name": "[student name]",
      "phone": "[phone number]",
      "email": "[email address]",
      "district": "[district]",
      "address": "[address]",
      "coursePlace": "[course place]",
      "questions": [
        {
          "qNo": "1",
          "text": "[question text]",
          "mark": 85
        }
      ],
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Student by ID
- **URL**: `/api/students/:id`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**:
```json
{
  "success": true,
  "data": {
    "_id": "[student id]",
    "name": "[student name]",
    "phone": "[phone number]",
    "email": "[email address]",
    "district": "[district]",
    "address": "[address]",
    "coursePlace": "[course place]",
    "questions": [
      {
        "qNo": "1",
        "text": "[question text]",
        "mark": 85
      }
    ],
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Create Student
- **URL**: `/api/students`
- **Method**: `POST`
- **Auth required**: Yes (Admin)
- **Data constraints**:
```json
{
  "name": "[student name]",
  "phone": "[phone number]",
  "email": "[email address]",
  "district": "[district]",
  "address": "[address]",
  "coursePlace": "[course place]",
  "questions": [
    {
      "qNo": "1",
      "text": "[question text]",
      "mark": 85
    }
  ]
}
```
- **Success Response**:
```json
{
  "success": true,
  "data": {
    "_id": "[student id]",
    "name": "[student name]",
    "phone": "[phone number]",
    "email": "[email address]",
    "district": "[district]",
    "address": "[address]",
    "coursePlace": "[course place]",
    "questions": [
      {
        "qNo": "1",
        "text": "[question text]",
        "mark": 85
      }
    ],
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Update Student
- **URL**: `/api/students/:id`
- **Method**: `PUT`
- **Auth required**: Yes (Admin)
- **Data constraints**:
```json
{
  "name": "[student name]",
  "phone": "[phone number]",
  "email": "[email address]",
  "district": "[district]",
  "address": "[address]",
  "coursePlace": "[course place]",
  "questions": [
    {
      "qNo": "1",
      "text": "[question text]",
      "mark": 85
    }
  ]
}
```
- **Success Response**:
```json
{
  "success": true,
  "data": {
    "_id": "[student id]",
    "name": "[student name]",
    "phone": "[phone number]",
    "email": "[email address]",
    "district": "[district]",
    "address": "[address]",
    "coursePlace": "[course place]",
    "questions": [
      {
        "qNo": "1",
        "text": "[question text]",
        "mark": 85
      }
    ],
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Delete Student
- **URL**: `/api/students/:id`
- **Method**: `DELETE`
- **Auth required**: Yes (Admin)
- **Success Response**:
```json
{
  "success": true,
  "data": {}
}
```

## Courses

### Get All Courses
- **URL**: `/api/courses`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**:
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "[course id]",
      "title": "[course title]",
      "description": "[course description]",
      "duration": "[course duration]",
      "fees": 1000,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Course by ID
- **URL**: `/api/courses/:id`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**:
```json
{
  "success": true,
  "data": {
    "_id": "[course id]",
    "title": "[course title]",
    "description": "[course description]",
    "duration": "[course duration]",
    "fees": 1000,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Create Course
- **URL**: `/api/courses`
- **Method**: `POST`
- **Auth required**: Yes (Admin)
- **Data constraints**:
```json
{
  "title": "[course title]",
  "description": "[course description]",
  "duration": "[course duration]",
  "fees": 1000
}
```
- **Success Response**:
```json
{
  "success": true,
  "data": {
    "_id": "[course id]",
    "title": "[course title]",
    "description": "[course description]",
    "duration": "[course duration]",
    "fees": 1000,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Update Course
- **URL**: `/api/courses/:id`
- **Method**: `PUT`
- **Auth required**: Yes (Admin)
- **Data constraints**:
```json
{
  "title": "[course title]",
  "description": "[course description]",
  "duration": "[course duration]",
  "fees": 1000
}
```
- **Success Response**:
```json
{
  "success": true,
  "data": {
    "_id": "[course id]",
    "title": "[course title]",
    "description": "[course description]",
    "duration": "[course duration]",
    "fees": 1000,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Delete Course
- **URL**: `/api/courses/:id`
- **Method**: `DELETE`
- **Auth required**: Yes (Admin)
- **Success Response**:
```json
{
  "success": true,
  "data": {}
}
```

## Exam

### Get Exam
- **URL**: `/api/exam`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**:
```json
{
  "success": true,
  "data": {
    "_id": "[exam id]",
    "title": "[exam title]",
    "description": "[exam description]",
    "imageIds": ["[image id]"],
    "uploadedAt": "2023-01-01T00:00:00.000Z",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Update Exam
- **URL**: `/api/exam`
- **Method**: `PUT`
- **Auth required**: Yes (Admin)
- **Data constraints**:
```json
{
  "title": "[exam title]",
  "description": "[exam description]",
  "imageIds": ["[image id]"]
}
```
- **Success Response**:
```json
{
  "success": true,
  "data": {
    "_id": "[exam id]",
    "title": "[exam title]",
    "description": "[exam description]",
    "imageIds": ["[image id]"],
    "uploadedAt": "2023-01-01T00:00:00.000Z",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

## File Uploads

### Upload File
- **URL**: `/api/uploads`
- **Method**: `POST`
- **Auth required**: Yes (Admin)
- **Data constraints**: Form-data with `image` field
- **Success Response**:
```json
{
  "success": true,
  "data": {
    "id": "[file id]",
    "filename": "[filename]",
    "url": "/api/uploads/[file id]"
  }
}
```

### Get File
- **URL**: `/api/uploads/:id`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**: File stream

### Delete File
- **URL**: `/api/uploads/:id`
- **Method**: `DELETE`
- **Auth required**: Yes (Admin)
- **Success Response**:
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

## Export

### Export Students to CSV
- **URL**: `/api/export/students`
- **Method**: `GET`
- **Auth required**: Yes (Admin)
- **Success Response**: CSV file download