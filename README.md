# Mentorship Platform 🚀

A full-stack role-based mentorship platform where students can connect with mentors, send mentorship requests, and manage their learning journey  with mentor approval and admin moderation.

---

## 🔥 Features

### 👤 Authentication & Authorization
- Secure user registration and login
- JWT-based authentication
- Role-based access control (Student, Mentor, Admin)

### 🎓 Student Features
- Browse approved mentors
- Search and filter mentors by expertise
- View mentor profiles
- Send mentorship requests
- Track request status (pending / accepted / rejected)
- View connected mentors

### 🧑‍🏫 Mentor Features
- View incoming mentorship requests
- Accept or reject requests
- View current mentees
- Manage mentor profile information

### 🛡️ Admin Features
- View pending mentor registrations
- Approve or reject mentors
- Control mentor visibility on the platform

---

## 🧠 Project Workflow

1. User registers as Student or Mentor  
2. Mentor accounts require Admin approval  
3. Students browse approved mentors  
4. Students send mentorship requests  
5. Mentors accept or reject requests  
6. Accepted requests create a mentor–mentee connection  

---

## 🛠️ Tech Stack

### Frontend
- React
- React Router DOM
- Tailwind CSS
- Magic UI components

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

---

## 🔐 Security Highlights

- Backend-enforced role-based authorization
- Ownership checks on all sensitive actions
- Mentor approval system
- Duplicate mentorship request prevention
- Secure JWT handling with expiry
- Sensitive fields excluded from API responses

---

## 📁 Project Structure

```txt
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── context/
│   │   └── utils/
│   └── package.json
│
├── Backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   └── server.js
│   └── package.json
│
└── README.md
