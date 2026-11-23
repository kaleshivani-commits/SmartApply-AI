# SmartApply AI – Job Application Tracker

SmartApply AI is a Java Full Stack web application designed to help job seekers manage, organize, and track their job applications in one place.

The application integrates Google Gemini AI to provide AI-powered job description analysis and assistance.

## Features

### Job Application Management

- Add new job applications
- View all saved job applications
- Edit existing job applications
- Delete job applications
- Store application details in MySQL database

### Search and Filtering

- Search job applications
- Filter applications by application status
- Combine search and status filters
- Reset search and filters

### Dashboard

- View application statistics
- Monitor job application progress

### AI Integration

- Google Gemini AI integration
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

- MySQL
- MySQL Workbench

### AI

- Google Gemini API

## Project Structure

```text
SmartApplyAI/
│
├── smartapply-frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
└── _smartapply-backend/
    └── smartapply-backend/
        ├── src/
        │   └── main/
        │       ├── java/
        │       └── resources/
        └── pom.xml
```

## Prerequisites

Before running the project, make sure you have:

- Java 17
- Node.js and npm
- MySQL
- Eclipse IDE
- Visual Studio Code

## How to Run the Project

### 1. Database Setup

- Open MySQL Workbench.
- Start your MySQL connection.
- Create the database used by the backend.
- Configure the database credentials in the backend configuration.

### 2. Run the Backend

- Open the backend project in Eclipse.
- Make sure the MySQL database is running.
- Run the Spring Boot application.

Backend URL:

http://localhost:8080

### 3. Run the Frontend

- Open the smartapply-frontend folder in VS Code.
- Open the terminal.
- Execute:

```bash
npm install
npm run dev
```

### 4. Open the Application

Open your browser and visit:

http://localhost:5173

## Future Enhancements

- User authentication and authorization
- Resume analysis
- AI-powered interview preparation
- Advanced application analytics

## Author

Shivani Kale
