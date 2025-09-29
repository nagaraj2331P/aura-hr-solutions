const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('./config/database');
const Admin = require('./models/Admin');
const Student = require('./models/Student');
const Project = require('./models/Project');

const seedData = async () => {
  try {
    // Connect to database
    await connectDB();
    
    console.log('🌱 Starting database seeding...');
    
    // Clear existing data (optional - comment out in production)
    // await Admin.deleteMany({});
    // await Student.deleteMany({});
    // await Project.deleteMany({});
    
    // Create super admin
    const existingSuperAdmin = await Admin.findOne({ role: 'super_admin' });
    if (!existingSuperAdmin) {
      const superAdmin = new Admin({
        name: 'Super Admin',
        email: 'admin@aurahrsoltuions.com',
        password: 'admin123',
        role: 'super_admin',
        department: 'IT'
      });
      await superAdmin.save();
      console.log('✅ Super Admin created');
    } else {
      console.log('ℹ️  Super Admin already exists');
    }
    
    // Create sample regular admin
    const existingAdmin = await Admin.findOne({ email: 'hr@aurahrsolutions.com' });
    if (!existingAdmin) {
      const admin = new Admin({
        name: 'HR Manager',
        email: 'hr@aurahrsolutions.com',
        password: 'hr123',
        role: 'admin',
        department: 'HR'
      });
      await admin.save();
      console.log('✅ HR Admin created');
    } else {
      console.log('ℹ️  HR Admin already exists');
    }
    
    // Create sample student
    const existingStudent = await Student.findOne({ email: 'student@example.com' });
    if (!existingStudent) {
      const student = new Student({
        name: 'John Doe',
        email: 'student@example.com',
        phone: '1234567890',
        password: 'student123',
        skills: ['JavaScript', 'React', 'Node.js'],
        expertise: 'Intermediate',
        bio: 'Passionate web developer looking to gain experience',
        education: {
          degree: 'Bachelor of Computer Science',
          institution: 'Tech University',
          year: 2024
        }
      });
      await student.save();
      console.log('✅ Sample Student created');
    } else {
      console.log('ℹ️  Sample Student already exists');
    }
    
    // Create sample project
    const existingProject = await Project.findOne({ title: 'Sample Web Development Project' });
    if (!existingProject) {
      const admin = await Admin.findOne({ role: 'super_admin' });
      const project = new Project({
        title: 'Sample Web Development Project',
        description: 'Build a responsive landing page for a local business using HTML, CSS, and JavaScript.',
        category: 'Web Development',
        skillsRequired: ['HTML', 'CSS', 'JavaScript'],
        difficulty: 'Beginner',
        estimatedHours: 20,
        hourlyRate: 15,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        requirements: [
          'Responsive design',
          'Cross-browser compatibility',
          'Clean, semantic HTML',
          'Modern CSS techniques'
        ],
        deliverables: [
          'Complete HTML/CSS/JS files',
          'Responsive design documentation',
          'Browser testing report'
        ],
        tags: ['web', 'frontend', 'beginner'],
        createdBy: admin._id,
        status: 'published'
      });
      await project.save();
      console.log('✅ Sample Project created');
    } else {
      console.log('ℹ️  Sample Project already exists');
    }
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Default Credentials:');
    console.log('Super Admin: admin@aurahrsoltuions.com / admin123');
    console.log('HR Admin: hr@aurahrsolutions.com / hr123');
    console.log('Student: student@example.com / student123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding
seedData();
