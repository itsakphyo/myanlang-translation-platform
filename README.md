# MynaLang Translation Platform

## Tech Stack

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-Production%20API-009688?logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17.4-4169E1?logo=postgresql&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-ORM-D71F00?logo=sqlalchemy&logoColor=white)
![Alembic](https://img.shields.io/badge/Alembic-Database%20Migration-0052CC?logo=alembic&logoColor=white)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.2-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-4.5.9-646CFF?logo=vite&logoColor=white)
![Material-UI](https://img.shields.io/badge/Material--UI-6.4.2-007FFF?logo=mui&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack%20Query-5.0.0-FF4154?logo=reactquery&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?logo=jsonwebtokens&logoColor=white)
![Pandas](https://img.shields.io/badge/Pandas-Data%20Processing-150458?logo=pandas&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Cloud%20Storage-3448C5?logo=cloudinary&logoColor=white)
![FastAPI Mail](https://img.shields.io/badge/FastAPI%20Mail-Email%20Service-009688?logo=fastapi&logoColor=white)
![Uvicorn](https://img.shields.io/badge/Uvicorn-ASGI%20Server-FF6B6B?logo=uvicorn&logoColor=white)
![Pytest](https://img.shields.io/badge/Pytest-Testing-0A9EDC?logo=pytest&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-v22-339933?logo=nodedotjs&logoColor=white)
![Formik](https://img.shields.io/badge/Formik-Form%20Management-172B4D?logo=formik&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-HTTP%20Client-5A29E4?logo=axios&logoColor=white)

## Project Setup Guide

## Prerequisites
Ensure you have the following installed on your system:

- [PostgreSQL 17.4](https://www.postgresql.org/download/) (Recommended)
- [Python 3.11](https://www.python.org/downloads/) (Recommended)
- [Node.js v22](https://nodejs.org/) (Recommended)

## Installation Steps

### 1. Clone the Project
```sh
cd project_folder
npm install
```

### 2. Setup Backend
```sh
cd project_folder/backend
python -m venv venv
```

#### Activate Virtual Environment
- **Windows**
  ```sh
  project_folder\backend\venv\Scripts\activate
  ```
- **macOS/Linux**
  ```sh
  source project_folder/backend/venv/bin/activate
  ```

#### Install Dependencies
```sh
pip install -r requirements.txt
pip install alembic pydantic pydantic[email] pydantic_settings python-jose passlib fastapi_mail python-multipart pandas bcrypt fastapi psycopg2-binary uvicorn
```

**Note:** Make sure PostgreSQL is installed before running `psycopg2-binary`.

### 3. Database Setup
Log in to your local PostgreSQL and create the database:
```sql
CREATE DATABASE texta;
```

After creating database change the Database URL in the .env file as needed.

Run Alembic migrations in the activated venv of backend:
```sh
alembic upgrade head
```

### 4. Start the Application
```sh
cd project_folder
npm run dev
```

## User Accounts

### Freelancer Registration
You can register as a freelancer using your email.

### Admin Credentials
Use the following credentials to log in as an admin:
```
Email: superadmin@gmail.com
Password: 123456
```

### QA Member Creation
QA members can be created from the QA Member Dashboard in the admin panel.

## Adding Language to the database
Before creating assessment tasks and jobs, the admin must first add the language to the database from the Assessment Task section in the admin dashboard. This language will be displayed to users. It is recommended to name the language in both English and the added language (though adding the native name is optional).

## Freelancer Language Pair Selection
- Freelancers can only select a language pair if an assessment task has been created by the admin.
- Admins can only upload jobs (a collection of translation tasks) for a language pair if an assessment task exists for that pair.

## Job CSV Format
When creating a job with assessment tasks, the CSV file **must** include a column with no header. This column represents the original text for translation. You can find an example CSV file in the project folder.


## Emails
Currently, itsaungkhantphyo@gmail.com is used as company email (sending system notification to freelancers) and itsakphyo@gmail (recieving notification as admin).com is used as admin email. Admin email can be change easily in the .env file and changing company email will required credentials such as app password.
