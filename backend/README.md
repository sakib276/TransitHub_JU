# TransitHub JU – Backend

Node.js + Express + MySQL. This branch contains:
- **Login / registration / password reset** (from `feature/registration-login`) at `/api/auth/...`
- **Ride request** (save a request + assign a trip) at `/api/ride-requests`
- **FR-11.1: Passenger – View Assigned Driver** at `/api/driver-vehicle/assigned-driver`

## 1. Setup (first time only)

1. Create the database: run `transithub_ju.sql` in MySQL Workbench (File → Open SQL Script → Execute).
2. Make your settings file:
   ```bash
   cd backend
   cp .env.example .env
   ```
   Open `.env` and set your MySQL password (`DB_PASSWORD`), a long random `JWT_SECRET`
   and an `ADMIN_REGISTRATION_CODE`. SMTP settings are only needed for Driver OTP login
   and password-reset emails.
3. Install packages:
   ```bash
   npm install
   ```
4. Create the login tables and give the demo users a real password
   (the passwords in `transithub_ju.sql` are fake placeholders):
   ```bash
   npm run setup-demo-login
   ```
   It asks you to choose a password. Then log in as e.g. `nusrat@juniv.edu` with it.

## 2. Run

```bash
npm run dev      # restarts automatically when you save a file
npm test         # runs the tests (no MySQL needed – the database is faked)
```

Check it works: open http://localhost:5000/health → `{"status":"ok"}`

## 3. How a request flows

```
Browser (React)                      Backend
──────────────                       ───────
GET /api/driver-vehicle/assigned-driver
Authorization: Bearer <login token>
        │
        ▼
  app.js                     → sends /api/driver-vehicle/* to the feature routes
  driverVehicle.routes.js    → picks the functions to run for this URL
  requireLogin               → checks the token, sets req.user = { userId, role }
  requireRole('Passenger')   → stops Drivers/Admins (403)
  driverVehicle.controller.js→ calls the model, builds the JSON response
  driverVehicle.model.js     → runs the SQL query on MySQL
```

## 4. Folder structure

```
backend/
├── .env.example                 settings template (copy to .env)
├── scripts/setup-demo-login.js  local only: login tables + demo passwords
├── package.json                 packages + npm scripts
└── src/
    ├── server.js                starts the server (loads .env first)
    ├── app.js                   Express app: middleware + routes
    ├── config/database.js       MySQL connection pool
    ├── shared/middleware/
    │   └── requireLogin.js      login (JWT) + role checks
    ├── features/auth/           login/register/reset (feature/registration-login)
    ├── features/ride-request/   rideRequest.routes / .controller / .model + tests
    └── features/driver-vehicle/
        ├── driverVehicle.routes.js
        ├── driverVehicle.controller.js
        ├── driverVehicle.model.js
        └── tests/driverVehicle.test.js
```

## 5. API

### Login – `POST /api/auth/login/passenger`

Body `{ "email": "...", "password": "..." }` → `{ success: true, data: { token, user } }`.
The frontend saves `token` and sends it as `Authorization: Bearer <token>` on later requests.
Other auth routes: see `src/features/auth/authentication.routes.js`.

### `GET /api/ride-requests/route-options` (login needed)

Every pickup → drop pair from the database (both stops on the same route, pickup first),
with `fare` (from `fare`) and `travelTime` (from `routes.estimated_time`), cheapest first.

### `POST /api/ride-requests` (Passenger only)

Body `{ "pickupStop": "Main Gate", "dropStop": "Muktomancho" }`. In one transaction it:
1. finds a `Scheduled`/`Running` trip on a route with both stops and a free seat
   (cheapest route first, then earliest departure),
2. inserts a `ride_requests` row with `status = 'Approved'`,
3. does `trips.available_seats - 1`.

| Status | When |
|---|---|
| 201 `{ data: { requestId, tripId } }` | Saved and assigned |
| 400 | Pickup/drop missing or the same |
| 409 | No trip with a free seat for that route |

Only pickup, drop and trip are saved: the form's date, time, seats, gender, ride type
and notes have no column in `ride_requests`.

### `GET /api/driver-vehicle/assigned-driver`

Shows the driver and vehicle of the logged-in passenger's accepted ride.

**Which ride?** A `ride_requests` row for this passenger with `status = 'Approved'`
whose trip is still `'Scheduled'` or `'Running'`. If there are several, the
**newest request** (so the card matches the ride just requested).

| Status | When | Body |
|---|---|---|
| 200 | Ride found | `{ data: { ... } }` (see below) |
| 401 | No token / bad or expired token | `{ message }` |
| 403 | Logged in, but not a Passenger | `{ message }` |
| 404 | No accepted active ride | `{ message: "You have no accepted ride yet." }` |
| 500 | Database error | `{ message }` |

Example `data` (Nusrat, user_id 2, with the demo data):

```json
{
  "requestId": 1,
  "tripId": 1,
  "tripStatus": "Scheduled",
  "departureTime": "2026-10-05 08:00:00",
  "routeName": "Main Gate - Central Library",
  "pickupStop": "Main Gate",
  "dropStop": "Central Library",
  "driverName": "Karim Mia",
  "driverPhone": "01700000004",
  "driverPhoto": "photos/karim.jpg",
  "vehicleNumber": "JU-BUS-01",
  "vehicleType": "Bus",
  "totalSeats": 40
}
```

Where each field comes from: `driver*` → `users` (via `drivers.user_id`),
`vehicle*`/`totalSeats` → `vehicles`, `trip*`/`departureTime` → `trips`,
`routeName` → `routes`, `pickupStop`/`dropStop` → `stops`.

With the demo data: **Nusrat (2)** gets the result above; **Tanvir (3)** gets 404
(his request is still `Pending`).
