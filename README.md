# MediTrack – Smart Digital Medication Management System

## Overview

MediTrack is a web-based medication management system designed to help patients take medicines on time, track medication adherence, manage prescriptions, and monitor medicine stock levels.
The system provides automated reminders, refill alerts, weekly adherence reports, and caregiver monitoring support.

---

## Features

### Patient Features
- User Registration & Login
- Add and Manage Medicines
- Set Medication Schedules
- Mark Doses as Taken or Missed
- Medicine Stock Tracking
- Refill Alerts
- Upload Prescriptions
- Weekly Adherence Reports
- Export Reports
- Profile Management

### Caregiver Features
- Monitor Patient Adherence
- View Weekly Reports
- Accept or Reject Link requests with Patients
- Receive Patient Updates

---

## Technologies Used

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MySQL

### Other Tools
- Git
- GitHub
- Browser Notification API

---

## System Architecture

The application follows a three-layer architecture:

1. Presentation Layer (Frontend)
2. Application Layer (Backend Logic)
3. Data Layer (MySQL Database)

---

## Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/MediTrack.git
```

### Move into Project Directory

```bash
cd MediTrack
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=meditrack
PORT=5000
```

### Import Database

Import the SQL file into MySQL.

### Run Server

```bash
node server.js
```

### Open Application

```text
http://localhost:5000
```

---

## Project Modules

- Authentication Module
- Medicine Management Module
- Reminder & Notification Module
- Dose Tracking Module
- Prescription Management Module
- Report Generation Module
- Caregiver Management Module

---

## Future Enhancements

- Mobile Application
- SMS Reminders
- Email Notifications
- AI-based Medication Insights
- Doctor Portal
- Cloud Deployment

---

## Team Members

- Aiswarya A
- Angel S S
- Ann Maria George
- Arpitha Nair

---

## My Contributions 

- Developed backend functionalities using Node.js and Express.js.
- Designed and implemented the MySQL database schema.
- Created and managed database tables for users, medicines, prescriptions, and dose records.
- Implemented CRUD operations for medicine management.
- Integrated frontend components with backend APIs.
- Implemented authentication and user data handling.
- Performed database validation.
  
## Academic Project

This project is developed for academic and educational purposes.

## Screenshots

FIG 1.1 Login page

<img width="1920" height="1080" alt="Screenshot (6)" src="https://github.com/user-attachments/assets/0a084993-83fd-4787-bac4-79fb2d835a5a" />

---

FIG 1.2 Registration page
![Uploading Screenshot (18).png…]()


FIG 1.3 Profile Setup
![Uploading Screenshot (20).png…]()


FIG 2.1 Patient Dashboard


FIG 2.2 Medicine Management


FIG 2.3 Medicine list


FIG 2.4 Upcoming Medicine reminders


FIG 2.5 Prescription Management
![Uploading Screenshot (12).png…]()

FIG 2.6 Weekly adherence report


FIG 2.7 Export report


FIG 2.8 Send link request


FIG 2.9 Link Caregiver management


FIG 2.10 Patient profile


FIG 3.1 Caregiver dashboard
![Uploading Screenshot (22).png…]()


FIG 3.2 Caregiver profile
![Uploading Screenshot (23).png…]()

