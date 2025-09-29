# Aura HR Solutions - Internship Management Platform

**"Earn While You Learn"** - A comprehensive internship management platform connecting students with real-world projects and enabling HR teams to manage internship programs efficiently.

## 🚀 Features

### For Students
- **Profile Management**: Complete profile with skills, education, and experience
- **Project Discovery**: Browse and apply for projects based on skills and interests
- **Time Tracking**: Automatic time logging with login/logout functionality
- **File Management**: Upload resumes, download project files, submit completed work
- **Progress Tracking**: Monitor project status, submissions, and earnings
- **Dashboard**: Comprehensive overview of active projects, submissions, and statistics

### For Admins (HR Teams)
- **Student Management**: View and manage registered students
- **Project Management**: Create, assign, and monitor projects
- **Submission Review**: Review and approve/reject student submissions
- **Timesheet Approval**: Monitor and approve student work hours
- **Analytics & Reports**: Generate reports on productivity, hours, and payouts
- **Role-based Access**: Different permission levels for admins

### Core Features
- **JWT Authentication**: Secure role-based authentication system
- **File Upload/Download**: Secure file management with virus scanning preparation
- **Real-time Time Tracking**: Automatic timesheet generation
- **Skill-based Matching**: Intelligent project assignment based on student skills
- **Responsive Design**: Modern, mobile-friendly interface
- **RESTful API**: Well-documented API endpoints

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads
- **Bcrypt** for password hashing
- **Joi** for input validation
- **Helmet** for security headers
- **CORS** for cross-origin requests

### Frontend (Coming Soon)
- **Next.js** (React framework)
- **TailwindCSS** for styling
- **Axios** for API calls
- **React Context** for state management

## 📁 Project Structure

```
aura-hr-solutions/
├── backend/
│   ├── config/
│   │   ├── database.js
│   │   └── config.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── models/
│   │   ├── Student.js
│   │   ├── Admin.js
│   │   ├── Project.js
│   │   ├── Submission.js
│   │   └── Timesheet.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── students.js
│   │   ├── admin.js
│   │   ├── projects.js
│   │   ├── submissions.js
│   │   ├── timesheets.js
│   │   └── files.js
│   ├── utils/
│   │   └── jwt.js
│   ├── uploads/
│   ├── server.js
│   ├── seed.js
│   └── package.json
└── frontend/ (Coming Soon)
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aura-hr-solutions/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/aura-hr-solutions
   JWT_SECRET=your-super-secret-jwt-key
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Seed the database** (Optional)
   ```bash
   npm run seed
   ```
   This creates sample data including admin and student accounts.

6. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

The backend server will start on `http://localhost:5000`

### Default Credentials (After Seeding)

- **Super Admin**: admin@aurahrsoltuions.com / admin123
- **HR Admin**: hr@aurahrsolutions.com / hr123
- **Student**: student@example.com / student123

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/register/student` | Register new student | Public |
| POST | `/api/auth/register/admin` | Register new admin | Super Admin |
| POST | `/api/auth/login` | Login user | Public |
| POST | `/api/auth/logout` | Logout user | Private |
| GET | `/api/auth/me` | Get current user | Private |
| PUT | `/api/auth/profile` | Update profile | Private |
| PUT | `/api/auth/change-password` | Change password | Private |

### Student Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/students/dashboard` | Get dashboard data | Student |
| GET | `/api/students/projects` | Get available projects | Student |

### Admin Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/admin/dashboard` | Get admin dashboard | Admin |
| GET | `/api/admin/students` | Get all students | Admin |

### Project Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/projects` | Get all projects | Public |
| GET | `/api/projects/:id` | Get single project | Public |

### File Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/files/upload/resume` | Upload resume | Private |
| POST | `/api/files/upload/profile-pic` | Upload profile picture | Private |
| GET | `/api/files/download/:filename` | Download file | Private |

## 🗄️ Database Models

### Student Model
- Personal information (name, email, phone)
- Skills and expertise level
- Education and experience
- Projects and submissions
- Time tracking and earnings

### Admin Model
- Admin information and role
- Permissions and department
- Created projects and reviews

### Project Model
- Project details and requirements
- Skills required and difficulty level
- Budget and timeline
- Assigned students and status

### Submission Model
- Student work submissions
- Review status and feedback
- File attachments and grades
- Revision history

### Timesheet Model
- Time tracking with login/logout
- Break management
- Approval workflow
- Earnings calculation

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt with salt rounds
- **Input Validation**: Joi schema validation
- **File Upload Security**: File type and size restrictions
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS Configuration**: Controlled cross-origin requests
- **Security Headers**: Helmet.js for security headers

## 🚀 Deployment

### Backend Deployment (Render/Heroku)

1. **Environment Variables**
   Set the following environment variables:
   ```
   MONGODB_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   NODE_ENV=production
   PORT=5000
   ```

2. **Build Command**
   ```bash
   npm install
   ```

3. **Start Command**
   ```bash
   npm start
   ```

### Database (MongoDB Atlas)

1. Create a MongoDB Atlas cluster
2. Get the connection string
3. Update the `MONGODB_URI` environment variable

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 📞 Support

For support and questions, please contact:
- Email: support@aurahrsolutions.com
- Website: [Aura HR Solutions](https://aurahrsolutions.com)

---

**Aura HR Solutions** - Empowering the next generation of professionals through meaningful internship experiences. 🌟
