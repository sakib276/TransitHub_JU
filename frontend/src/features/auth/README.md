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

## View the saved test report

Run `npm test` from `frontend/src/features/auth` to execute the frontend component tests. The backend tests run with `npm test` from `backend/src/features/auth`. The existing `frontend/playwright-report/index.html` is a saved generated report from a previous run, not the output of the current Vitest tests.

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
