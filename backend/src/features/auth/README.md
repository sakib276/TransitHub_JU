# Authentication Backend

This folder contains the authentication API, MySQL pool, migration, and local runner.

> **Now part of the main backend:** `backend/src/app.js` mounts these routes at `/api/auth`, so `npm run dev` in `backend/` (port 5000) serves login too. The standalone runner below (port 5001) still works for testing this feature alone.

From a VS Code terminal at the repository root:

```powershell
cd backend/src/features/auth
Copy-Item .env.example .env
# Edit .env with your MySQL, SMTP, JWT_SECRET, and ADMIN_REGISTRATION_CODE settings.
npm install
npm run dev
```

Create the `transithub_ju` database from the team's supplied SQL, then apply `authentication.sql` in MySQL Workbench. The supplied SQL drops and recreates that database, so run it only when resetting the database is safe.

The API is at `http://localhost:5001/api/auth`. Password login is available for Passengers and Admins; Drivers sign in with a one-time email code. The frontend is in `frontend/src/features/auth` and defaults to this API URL.
