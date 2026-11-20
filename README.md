\# SmartApply AI – Intelligent Job Application Tracker



SmartApply AI is a Java Full Stack web application that helps job seekers manage job applications and prepare for interviews using Gemini AI.



\## Features



\- Dashboard with application statistics

\- Add, edit and delete job applications

\- Search applications by company, job title and location

\- Filter applications by status

\- AI-powered job description analyzer

\- AI-generated interview questions

\- Interview practice mode

\- MySQL database integration



\## Technology Stack



\*\*Frontend\*\*

\- React.js

\- Vite

\- JavaScript

\- Axios

\- CSS



\*\*Backend\*\*

\- Java 17

\- Spring Boot

\- Spring Data JPA

\- Hibernate

\- REST APIs



\*\*Database\*\*

\- MySQL 8



\*\*AI Integration\*\*

\- Google Gemini API



\## Project Structure



```text

SmartApplyAI/

├── smartapply-frontend/

├── \_smartapply-backend/

├── .gitignore

└── README.md

```



\## Running the Project



\### 1. Start MySQL

Make sure your MySQL server is running and the `smartapply\_db` database is available.



\### 2. Start the Backend

Open the backend project in Eclipse and run the Spring Boot application.



Backend URL: `http://localhost:8080`



\### 3. Start the Frontend



Open a terminal inside `smartapply-frontend` and run:



```bash

npm install

npm run dev

```



Frontend URL: `http://localhost:5173`



\## Environment Variables



Configure these environment variables on your system:



\- `DB\_PASSWORD` – MySQL root password

\- `GEMINI\_API\_KEY` – Google Gemini API key



Never upload API keys or passwords to GitHub.



\## Project Purpose



This project demonstrates practical Java Full Stack development skills, REST API integration, database operations, React frontend development and AI integration.

