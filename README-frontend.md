# Visitor Pass Management System - Frontend

React frontend for the Visitor Pass Management System with JWT authentication, role-based dashboards, visitor registration with photo upload, QR code passes, and PDF badge download.

## Live Demo

- **Frontend App:** https://naseem-visitor-pass-frontend.netlify.app
- **Backend API:** https://visitor-pass-backend-azj3.onrender.com

Note:First load may take ~50 seconds as the free Render server spins up.

## Demo Credentials

| Role     | Email                  | Password    |
|----------|------------------------|-------------|
| Admin    | admin@visitor.com      | admin123    |
| Security | security@visitor.com   | security123 |
| Employee | naseem@visitor.com     | naseem123   |

## Features

- Login with JWT token stored in localStorage
- Role-based navigation (Admin sees all, Employee sees own visitors, Security sees checkpoint)
- Dashboard with visitor statistics (Admin/Security)
- Visitor registration form with photo upload and preview
- Visitor table with photo, status badges, and pass codes
- Visitor Pass modal with QR code display
- PDF badge download with visitor details, photo, and QR code
- Approve / Delete visitor actions
- Security checkpoint for Check-In / Check-Out using pass codes
- Dark theme professional UI

## Tech Stack

- Framework:React 18
- Routing:React Router DOM
- HTTP Client:Axios with JWT interceptor
- Styling:Custom CSS with dark theme
- Deployment:Netlify

## Pages

| Page       | Route       | Access          | Description                    |
|------------|-------------|-----------------|--------------------------------|
| Login      | /           | Public          | Sign in with demo credentials  |
| Dashboard  | /dashboard  | All roles       | Stats and recent visitors      |
| Visitors   | /visitors   | All roles       | Register, approve, manage      |
| Security   | /security   | Admin/Security  | Check-in / Check-out           |

## Project Structure

visitor-pass-frontend/
├── public/
├── src/
│   ├── components/
│   │   └── Navbar.js
│   ├── pages/
│   │   ├── Login.js
│   │   ├── Dashboard.js
│   │   ├── Visitors.js
│   │   └── Security.js
│   ├── services/
│   │   └── api.js
│   ├── App.js
│   ├── App.css
│   └── index.js
└── package.json

## Setup Instructions

1. Clone the repository:
   git clone https://github.com/Naseem030583/visitor-pass-frontend.git
   cd visitor-pass-frontend

2. Install dependencies:
   npm install

3. Update API URL in `src/services/api.js`:
   js
   baseURL: 'http://localhost:3000/api'  // for local development

4. Start the app:
   npm start

5. App runs at `http://localhost:3001`

