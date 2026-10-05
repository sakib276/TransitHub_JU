# Authentication API

1. Create the MySQL database and `users` table from the team-provided `transithub_ju.sql`.
2. Apply `authentication.sql` once to create the authentication counters/challenges and pending driver application table.
3. Copy `backend/.env.example` to `backend/.env` and configure MySQL, a random `JWT_SECRET` (at least 32 characters), a private `ADMIN_REGISTRATION_CODE`, and SMTP credentials. SMTP delivers Driver OTPs and passenger reset links; OTPs and reset tokens are never returned by the API.
4. From `backend`, run `npm install`, then `npm run dev`.
5. From `frontend`, run `npm install`, then `npm run dev`. Set `VITE_API_BASE_URL` only when the API is not at `http://localhost:5000/api`.

Routes are mounted below `/api/auth`: passenger/driver/admin registration, passenger login, Driver OTP request/verification, and password-reset request/completion. Driver applications remain pending until the existing driver/vehicle workflow assigns a vehicle.
