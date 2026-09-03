# Submit Complaint Feature — TransitHub JU

## 📌 Overview

The **Submit Complaint** feature allows passengers to submit complaints related to their transportation experience.

Passengers can:

* Select a complaint category
* Enter a complaint description
* Optionally associate the complaint with a ride
* Submit the complaint to the backend
* Store the complaint in the MySQL database
* Receive confirmation from the backend

### Supported Complaint Categories

* `DRIVER` — Complaint related to a driver
* `SERVICE` — Complaint related to transportation service
* `RIDE` — Complaint related to a specific ride

---

# 🏗️ Feature Architecture

The feature follows a layered architecture.

```text
Passenger
   │
   ▼
React Complaint Form
   │
   ▼
Complaint Service
   │
   │ POST /api/complaints
   ▼
Express API
   │
   ▼
Complaint Controller
   │
   ▼
Complaint Service
   │
   ▼
Complaint Repository
   │
   ▼
MySQL Database
```

---

# 📁 Frontend Structure

Relevant frontend files:

```text
submit-a-complaint/
│
├── components/
│   ├── complaint-form.jsx
│   ├── complaint-category-selector.jsx
│   ├── complaint-description.jsx
│   ├── complaint-related-ride.jsx
│   └── complaint-submit-button.jsx
│
├── pages/
│   └── submit-a-complaint-page.jsx
│
├── services/
│   └── complaint-service.js
│
└── styles/
    └── complaint.css
```

---

# ⚙️ Prerequisites

Before running the project, install the following:

* Node.js 20+ recommended
* npm
* MySQL 8+
* Git
* A code editor such as VS Code

Check your installed versions:

```bash
node --version
npm --version
mysql --version
git --version
```

---

# 📥 1. Clone the Repository

Clone the project:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Move into the project:

```bash
cd TransitHubJU
```

If the frontend and backend are separate folders:

```bash
cd frontend
```

or:

```bash
cd backend
```

depending on which part you want to run.

---

# 📦 2. Install Dependencies

## Backend

Open a terminal in the backend directory:

```bash
cd backend
npm install
```

## Frontend

Open another terminal:

```bash
cd frontend
npm install
```

---

# 🗄️ 3. MySQL Database Setup

Make sure MySQL is running.

You can use:

* MySQL Server
* XAMPP
* MySQL Workbench
* phpMyAdmin

Create the project database:

```sql
CREATE DATABASE transithub_ju;
```

Select the database:

```sql
USE transithub_ju;
```

Then run the project's database/schema SQL file.

For example:

```bash
mysql -u root -p transithub_ju < database/schema.sql
```

If your project does not contain a schema file, create the required `complaints` table using the SQL provided by the backend team.

---

# 🔐 4. Environment Variables

Do **not** commit passwords or other secrets to GitHub.

Create a `.env` file inside the backend directory.

Example:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=transithub_ju
```

If your backend uses additional environment variables, add them here.

### Important

The `.env` file should be included in `.gitignore`:

```gitignore
.env
.env.*
!.env.example
```

Create an example environment file for teammates:

```text
.env.example
```

Example:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=transithub_ju
```

Each developer should create their own `.env` based on `.env.example`.

---

# 🚀 5. Start the Backend

From the backend directory:

```bash
npm install
```

Then start the server:

```bash
npm start
```

For development, if the project has a development script:

```bash
npm run dev
```

The backend should run on:

```text
http://localhost:3000
```

The complaint API endpoint is:

```text
POST http://localhost:3000/api/complaints
```

---

# 💻 6. Start the Frontend

Open a **new terminal**.

Move to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The frontend should normally be available at:

```text
http://localhost:5173
```

---

# 🔗 7. Frontend → Backend Connection

The complaint form sends data to:

```text
POST /api/complaints
```

The request contains:

```json
{
  "category": "SERVICE",
  "description": "The bus service was delayed.",
  "relatedRideId": "RIDE-001"
}
```

`relatedRideId` is optional.

If the passenger does not select a ride:

```json
{
  "category": "SERVICE",
  "description": "The bus service was delayed.",
  "relatedRideId": null
}
```

---

# 🔄 8. Complete Submission Flow

```text
User fills complaint form
        │
        ▼
ComplaintForm
        │
        ▼
validateComplaint()
        │
        ├── Invalid
        │      │
        │      ▼
        │   Display validation errors
        │
        ▼
submitComplaint()
        │
        ▼
POST /api/complaints
        │
        ▼
Express Controller
        │
        ▼
Complaint Service
        │
        ▼
Complaint Repository
        │
        ▼
MySQL
        │
        ▼
201 Created
        │
        ▼
React receives response
        │
        ▼
Success / confirmation
```

---

# 🧪 9. Run Tests

Run the existing test suite:

```bash
npm test
```

---

# 🗄️ 10. Real Database Integration Tests

The project includes real database integration testing.

These tests verify:

```text
Application
     ↓
MySQL Connection
     ↓
complaints table
     ↓
INSERT
     ↓
SELECT
     ↓
DELETE test data
```

Before running database integration tests, make sure:

1. MySQL is running.
2. The database exists.
3. The `.env` file is configured correctly.
4. The required tables have been created.

Then run:

```bash
npm test
```

---

# 🧹 11. ESLint

Run ESLint:

```bash
npm run lint
```

If there is no lint script:

```bash
npx eslint .
```

To automatically fix supported ESLint issues:

```bash
npm run lint -- --fix
```

or:

```bash
npx eslint . --fix
```

The code should pass ESLint before pushing.

---

# 📚 12. Generate JSDoc Documentation

The project uses JSDoc for code documentation.

Generate documentation:

```bash
npm run docs
```

If the project does not have the JSDoc package installed:

```bash
npm install --save-dev jsdoc
```

Then:

```bash
npm run docs
```

The generated documentation will normally be placed in the configured documentation directory.

---

# 🔍 13. API Testing

The complaint API can be tested using Postman, Thunder Client, or another API client.

### Endpoint

```text
POST http://localhost:3000/api/complaints
```

### Headers

```text
Content-Type: application/json
```

### Request Body

```json
{
  "category": "DRIVER",
  "description": "The driver was driving dangerously.",
  "relatedRideId": "RIDE-001"
}
```

### Expected Response

The API should return a successful HTTP response, normally:

```text
201 Created
```

with the created complaint information.

---

# 🧪 14. Validation Testing

The frontend validates the complaint before sending it to the backend.

### Missing category

```json
{
  "description": "The bus was late."
}
```

Expected:

```text
Complaint category is required.
```

### Missing description

```json
{
  "category": "SERVICE"
}
```

Expected:

```text
Complaint description is required.
```

### Valid complaint

```json
{
  "category": "SERVICE",
  "description": "The bus service was delayed.",
  "relatedRideId": null
}
```

Expected:

```text
Valid complaint
```

---

# 🛡️ 15. CORS Configuration

Because the frontend and backend run on different ports:

```text
Frontend → localhost:5173
Backend  → localhost:3000
```

the backend must allow the frontend origin.

The backend uses CORS middleware:

```javascript
app.use(cors());
```

and JSON parsing:

```javascript
app.use(express.json());
```

---

# 🧹 16. Test Data Cleanup

Real database integration tests may create temporary complaint records.

Test data should be removed after the test completes.

The integration test follows:

```text
Create test complaint
        ↓
Verify INSERT
        ↓
Verify SELECT
        ↓
DELETE test complaint
        ↓
Database restored
```

This prevents test data from permanently polluting the development database.

---

# 📋 17. Useful Commands — Quick Reference

### Install dependencies

```bash
npm install
```

### Start backend

```bash
npm start
```

### Start development server

```bash
npm run dev
```

### Run tests

```bash
npm test
```

### Run Vitest once

```bash
npx vitest run
```

### Run coverage

```bash
npx vitest run --coverage
```

### Run ESLint

```bash
npm run lint
```

### Fix ESLint issues

```bash
npm run lint -- --fix
```

### Generate JSDoc

```bash
npm run docs
```

---

# 🧑‍💻 18. Recommended Setup on a New Machine

A new developer should follow these steps:

```bash
# 1. Clone
git clone <YOUR_GITHUB_REPOSITORY_URL>

# 2. Enter project
cd TransitHubJU

# 3. Install backend dependencies
cd backend
npm install

# 4. Configure environment
# Create .env using .env.example

# 5. Setup MySQL database
# Create transithub_ju database
# Import project schema

# 6. Start backend
npm start
```

Open another terminal:

```bash
# 7. Go to frontend
cd frontend

# 8. Install dependencies
npm install

# 9. Start frontend
npm run dev
```

Then open:

```text
http://localhost:5173
```

---

# ✅ Feature Verification Checklist

Before considering the feature complete, verify:

* [ ] MySQL is running
* [ ] Database is connected
* [ ] `complaints` table exists
* [ ] Backend starts successfully
* [ ] Frontend starts successfully
* [ ] Complaint page loads
* [ ] Category can be selected
* [ ] Related ride is optional
* [ ] Description can be entered
* [ ] Empty category shows validation error
* [ ] Empty description shows validation error
* [ ] Valid complaint reaches backend
* [ ] Complaint is inserted into MySQL
* [ ] API returns successful response
* [ ] Test data is cleaned up
* [ ] Tests pass
* [ ] ESLint passes
* [ ] JSDoc generates successfully

---

# 🏁 Current Testing Status

The backend has been verified with:

```text
76 existing tests              ✅
Real database integration       ✅
MySQL connection                ✅
Complaint INSERT                ✅
Complaint SELECT                ✅
Temporary test data cleanup     ✅
ESLint                          ✅
JSDoc                           ✅
```

The intended final integration is:

```text
React
  ↓
POST /api/complaints
  ↓
Express
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
MySQL
```

---

# 👥 Development Notes

When contributing to this feature:

1. Follow the existing project coding standard.
2. Run ESLint before committing.
3. Add/update tests when changing functionality.
4. Add JSDoc for new functions and modules.
5. Do not commit `.env` files.
6. Do not commit database passwords or credentials.
7. Keep frontend and backend responsibilities separated.
8. Do not directly access MySQL from React.
9. Use the backend API for database operations.

---


## 👤 Feature

**Feature:** Submit Complaint

**Application:** TransitHub JU

**Frontend:** React + Vite

**Backend:** Node.js + Express

**Database:** MySQL

**Testing:** Vitest

**Linting:** ESLint

**Documentation:** JSDoc
