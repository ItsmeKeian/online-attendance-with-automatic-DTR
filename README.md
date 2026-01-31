# Digital DTR System — Employee Attendance Management

**Modern time tracking with photo verification and automated reporting**

A full-stack web application for managing employee attendance and generating Daily Time Records (DTR). The system consists of two main interfaces: a public employee kiosk where staff can log attendance with photo verification, and an admin dashboard for managing employees and viewing attendance records. Built with React and Tailwind CSS, featuring real-time status updates, automated DTR generation, and comprehensive filtering options.

---

## 📋 Portfolio Summary

**Project Type:** Full-Stack Web Application  
**Role:** Frontend Developer  
**Engagement:** Client Project 

**Description:**  
A comprehensive digital attendance management system built for a client, replacing manual timekeeping processes. Delivered a touch-friendly employee kiosk with camera-based attendance logging, an administrative portal for employee lifecycle management, and automated Daily Time Record generation with advanced filtering and print capabilities.

**Key Highlights:**
- ✅ Real-time photo verification for attendance logging
- ✅ Automated DTR generation with date range and department filters
- ✅ Employee management system with CRUD operations
- ✅ Role-based authentication and protected routes
- ✅ Responsive design with modern UI/UX

**Technologies:** React 19, Vite, Tailwind CSS, React Router, PHP REST API, SweetAlert2

---

## Features

### Employee Kiosk
- **Time Tracking**: Record Time In, Lunch Out, Lunch In, and Time Out
- **Photo Capture**: Camera integration for attendance verification
- **Real-time Clock**: Live date and time display
- **Status Checking**: View current attendance status by entering Employee ID
- **Audio Feedback**: Beep sound confirmation on successful attendance recording
- **Strict Flow Control**: Enforces correct sequence of attendance actions

### Admin Dashboard
- **Dashboard Overview**: View system statistics including total employees, present/absent counts
- **Employee Management**: Create and manage employee records
- **Attendance Records**: View and monitor employee attendance history
- **Protected Routes**: Secure admin area with role-based access control

## Tech Stack

- **React** 19.2.0 - UI library
- **Vite** 7.2.4 - Build tool and dev server
- **React Router DOM** 7.12.0 - Client-side routing
- **Tailwind CSS** 4.1.18 - Utility-first CSS framework
- **SweetAlert2** 11.26.17 - Beautiful alert dialogs

## Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn package manager
- Backend API server running (PHP-based API at `http://localhost/online-dtr-api/`)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd online-attendance-with-automatic-DTR
```

2. Install dependencies:
```bash
npm install
```

3. Configure API endpoint (if needed):
   - Update API endpoints in the source files if your backend is hosted at a different URL
   - Default API base URL: `http://localhost/online-dtr-api/`

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in the terminal).

## Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
online-dtr-frontend/
├── public/
│   ├── beep.mp3          # Audio feedback sound
│   └── vite.svg
├── src/
│   ├── components/
│   │   └── CameraModal.jsx      # Camera capture component
│   ├── layouts/
│   │   └── AdminLayout.jsx      # Admin area layout wrapper
│   ├── pages/
│   │   ├── EmployeeKiosk.jsx           # Employee attendance kiosk
│   │   ├── Login.jsx                   # Admin login page
│   │   ├── AdminDashboard.jsx          # Admin dashboard
│   │   ├── AdminEmployees.jsx          # Employee management
│   │   ├── AdminCreateEmployee.jsx     # Create employee form
│   │   ├── AdminAttendanceRecords.jsx  # Attendance records view
│   │   └── PrintDTR.jsx                # Print DTR functionality
│   ├── App.jsx            # Main app component with routing
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Routes

- `/` - Employee Kiosk (public)
- `/admin/login` - Admin login page
- `/admin` - Admin dashboard (protected)
- `/admin/employees` - Employee management (protected)
- `/admin/attendance` - Attendance records (protected)

## API Integration

The frontend communicates with a PHP backend API. Ensure the backend is running and accessible at:
- Base URL: `http://localhost/online-dtr-api/`

### Key API Endpoints Used:
- `POST /attendance/status.php` - Get employee attendance status
- `POST /attendance/time_in.php` - Record time in
- `POST /attendance/lunch_out.php` - Record lunch out
- `POST /attendance/lunch_in.php` - Record lunch in
- `POST /attendance/time_out.php` - Record time out
- `GET /admin/dashboard_stats.php` - Get dashboard statistics

## Usage

### For Employees:
1. Navigate to the home page (`/`)
2. Enter your Employee ID (e.g., EMP-2789)
3. Select the appropriate action button (Time In, Lunch Out, Lunch In, Time Out)
4. Allow camera access when prompted
5. Align your face in the frame and capture your photo
6. Wait for confirmation message and audio feedback

### For Administrators:
1. Navigate to `/admin/login`
2. Log in with admin credentials
3. Access the dashboard to view statistics
4. Manage employees from the Employees section
5. View attendance records from the Attendance section

## Browser Compatibility

- Modern browsers with camera API support
- Chrome, Firefox, Edge, Safari (latest versions)

