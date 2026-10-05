# TransitHub JU Authentication Feature

This folder contains the authentication frontend: registration views, login, driver OTP, password reset, the API client, styling, and the small Vite app used to run this feature on its own.

## Run the frontend

Open this folder as the working directory in a VS Code terminal:

```powershell
cd 'frontend/src/features/auth'
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`). The API defaults to `http://localhost:5000/api`; set `VITE_API_BASE_URL` only if the backend runs elsewhere.

## Backend location

The API is server code and stays in `backend/src/features/authentication`. Start it from the repository root in a second terminal:

```powershell
cd backend
Copy-Item .env.example .env
# Edit backend/.env with MySQL, SMTP, JWT_SECRET, and ADMIN_REGISTRATION_CODE values.
npm install
npm run dev
```

Create the team `transithub_ju` database first, then apply `backend/src/features/authentication/authentication.sql`. The team SQL script drops and recreates the database; run it only if resetting that database is safe.

## View this documentation

In VS Code, open this `README.md` and press `Ctrl+Shift+V` for the rendered Markdown preview, or `Ctrl+K` then `V` to show it beside the source.
