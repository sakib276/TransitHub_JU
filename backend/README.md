# TransitHub JU – Backend

Node.js + Express + MySQL. This branch contains **FR-11.1: Passenger – View Assigned Driver**.

## 1. Setup (first time only)

1. Create the database: run `transithub_ju.sql` in MySQL Workbench (File → Open SQL Script → Execute).
2. Make your settings file:
   ```bash
   cd backend
   cp .env.example .env
   ```
   Open `.env` and set your MySQL password (`DB_PASSWORD`) and `JWT_SECRET`.
   **`JWT_SECRET` must be the same value as in the login backend's `.env`**
   (`backend/src/features/auth/.env` on the `feature/registration-login` branch).
3. Install packages:
   ```bash
   npm install
   ```

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
├── package.json                 packages + npm scripts
└── src/
    ├── server.js                starts the server (loads .env first)
    ├── app.js                   Express app: middleware + routes
    ├── config/database.js       MySQL connection pool
    ├── shared/middleware/
    │   └── requireLogin.js      login (JWT) + role checks
    └── features/driver-vehicle/
        ├── driverVehicle.routes.js
        ├── driverVehicle.controller.js
        ├── driverVehicle.model.js
        └── tests/driverVehicle.test.js
```

## 5. API

### `GET /api/driver-vehicle/assigned-driver`

Shows the driver and vehicle of the logged-in passenger's accepted ride.

**Which ride?** A `ride_requests` row for this passenger with `status = 'Approved'`
whose trip is still `'Scheduled'` or `'Running'`. If there are several, the one
departing soonest.

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
