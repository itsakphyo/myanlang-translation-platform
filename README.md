# Project Setup Guide

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
pip install alembic pydantic pydantic[email] pydantic_settings python-jose passlib fastapi_mail python-multipart pandas bcrypt fastapi psycopg2-binary
```

**Note:** Make sure PostgreSQL is installed before running `psycopg2-binary`.

### 3. Database Setup
Log in to your local PostgreSQL and create the database:
```sql
CREATE DATABASE texta;
```

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
