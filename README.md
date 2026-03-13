**Full-Stack Project Management Web Application**

📌 Overview

Project Vajra is a modern full-stack project management platform designed to help teams organize work, collaborate efficiently, and track project progress in a centralized workspace.

The application enables users to create workspaces, manage projects, assign tasks, invite team members, monitor analytics, and track deadlines through a clean and intuitive interface.

It is built using modern web technologies and deployed on Vercel for seamless accessibility.

🚀 Live Demo
🌐 Live Application:
[https://your-project-link.vercel.app](https://project-vajra-kiit.vercel.app/)

✨ Features
Feature	Description
🔐 Google Authentication Secure login using Google accounts Managed By Clerk.
🏢 Workspace Management	Create and manage multiple workspaces
📁 Project Management	Organize projects within workspaces
👥 Team Collaboration	Invite members and assign roles where all functions & events been handled by Inngest
✅ Task Management	Create, assign, update, and delete tasks
📊 Analytics Dashboard	Visualize tasks by status, type, and priority using recharts library
📅 Calendar View	Track task deadlines using date-fns library
💬 Task Comments	Communicate directly within tasks
📧 Email Invitations	Send invitations and notifications via email using Nodemailer with Brevo SMTP.
📌 Sidebar Navigation	Quick access to projects and tasks


🖥️ Application Workflow
User Login
     ↓
Create Workspace
     ↓
Create Project
     ↓
Invite Team Members
     ↓
Create & Assign Tasks
     ↓
Track Progress (Analytics + Calendar)
     ↓
Collaborate through Comments


🛠️ **Tech Stack**

Frontend

React.js
JavaScript
HTML5
CSS3

Backend

Node.js
Express.js

Database

Neon PostgreSQL

Authentication

Google OAuth - Managed By CLlerk

Deployment

Vercel

🏗️ System Architecture
Frontend (React)
      ↓
API Layer (Node.js + Express)
      ↓
Database (PostgreSQL)
      ↓
External Services
   • Google Authentication (Clerk)
   • Email Notification System 
   
📂 Project Structure
Project-Vajra
│
├── frontend
│   ├── components
│   ├── pages
│   ├── hooks
│   └── services
│
├── backend
│   ├── controllers
│   ├── routes
│   ├── models
│   └── middleware
│
├── database
│
└── README.md

⚙️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/your-username/project-vajra.git
2️⃣ Navigate to the project directory
cd project-vajra
3️⃣ Install dependencies
npm install
4️⃣ Start the development server
npm run dev


👩‍💻 Author

Sanjana Singh & Sanidhya Kamthan
Project Vajra – Project Management System
