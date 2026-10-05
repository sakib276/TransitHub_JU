# TransitHub JU Authentication Feature

This folder contains the authentication frontend: registration views, login, driver OTP, password reset, the API client, styling, and a small Vite app for previewing the feature by itself. The main project frontend also loads this `AuthFeature` component.

## Run the frontend

From a VS Code terminal at the repository root:

```powershell
cd frontend/src/features/auth
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`). The API defaults to `http://localhost:5001/api` because the auth server has its own runner.

## Backend location

The API is server code and lives in `backend/src/features/auth`. Start it in a second terminal from the repository root:

```powershell
cd backend/src/features/auth
Copy-Item .env.example .env
# Edit .env with MySQL, SMTP, JWT_SECRET, and ADMIN_REGISTRATION_CODE values.
npm install
npm run dev
```

Create the team `transithub_ju` database first, then apply `backend/src/features/auth/authentication.sql`. The team SQL script drops and recreates the database; run it only if resetting that database is safe.

## View this documentation

In VS Code, open this `README.md` and press `Ctrl+Shift+V` for the rendered Markdown preview, or `Ctrl+K` then `V` to show it beside the source.
