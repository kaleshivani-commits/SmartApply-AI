# SmartApply AI – Intelligent Job Application Tracker

SmartApply AI is a Java Full Stack web application designed to help job seekers manage, organize, and track their job applications in one place.

The application integrates Google Gemini AI to provide AI-powered assistance with job description analysis.

## Features

### Job Application Management
- Add new job applications
- View all saved job applications
- Edit existing job applications
- Delete job applications
- Store application details in MySQL database

### Search and Filtering
- Search applications
- Filter applications by status
- Combine search and status filters
- Reset search and filters

### Dashboard
- View job application statistics
- Track application progress

### AI Integration
- Google Gemini API integration
- AI-powered job description analysis

## Technology Stack

### Frontend
- React.js
- Vite
- JavaScript
- HTML5
- CSS3
- Axios

### Backend
- Java 17
- Spring Boot
- Spring Data JPA
- Hibernate
- Maven
- REST APIs

### Database
- MySQL 8
- MySQL Workbench

### AI
- Google Gemini API

## Project Structure

```text
SmartApply-AI/
│
├── README.md
├── smartapply-frontend/
├── _smartapply-backend/
└── .gitignore
```

## Prerequisites

- Java 17
- Node.js and npm
- MySQL 8
- Eclipse IDE
- Visual Studio Code

## How to Run the Project

### 1. Database Setup

- Start MySQL Server.
- Create the `smartapply_db` database if it does not already exist.
- Configure the database connection in the backend configuration.

### 2. Run the Backend

- Open the backend project in Eclipse.
- Configure your MySQL credentials.
- Configure the Gemini API key securely.
- Run the Spring Boot application.

Backend URL:

`http://localhost:8080`

### 3. Run the Frontend

Open the terminal inside the `smartapply-frontend` folder and execute:

```bash
npm install
npm run dev
```

Frontend URL:

`http://localhost:5173`

## Security

- Keep API keys and database passwords private.
- Never upload secret credentials to GitHub.
- Use environment variables or secure configuration for sensitive information.

## Project Objective

This project demonstrates practical Java Full Stack development skills, including React frontend development, Spring Boot backend development, REST API integration, MySQL database operations, and AI integration.

## Future Enhancements

- User authentication and authorization
- Resume analysis
- AI-powered interview preparation
- Advanced application analytics

## Author

Shivani Kale

