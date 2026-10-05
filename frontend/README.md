# Ride Request Feature

This module implements passenger queue requests using the MySQL-backed ride-request API and TransitHub JU database schema.

## Folder Structure

```text
ride-request/
├── components/
│   ├── ride-form.jsx
│   ├── ride-request-card.jsx
│   ├── request-status.jsx
│   ├── driver-request-card.jsx
│   └── admin-request-table.jsx
├── pages/
│   ├── ride-request-page.jsx
│   ├── driver-ride-requests-page.jsx
│   └── admin-ride-requests-page.jsx
├── services/
│   └── ride-request-service.js
├── hooks/
│   └── use-ride-request.js
├── styles/
│   ├── ride-request.css
│   ├── driver-ride-requests.css
│   └── admin-ride-requests.css
├── tests/
│   ├── ride-form.test.js
│   ├── driver-request-card.test.js
│   ├── admin-ride-requests-page.test.js
│   └── ride-request-service.test.js
└── index.js
```

The backend feature follows the same controller/model/route/service/test separation:

```text
backend/src/features/ride-request/
├── controllers/
├── models/
├── routes/
├── services/
└── tests/
```

## Database and Local Setup

1. Apply `database/schema.sql` to a new MySQL server. For an existing installation, apply `database/migrations/001-create-queue-rejections.sql`. Ensure the database contains active passenger and driver users and an active vehicle linked to the driver.
2. Copy `backend/.env.example` to `backend/.env` and configure the database connection.
3. Copy `frontend/.env.example` to `frontend/.env.local`. Until authentication is integrated, set the three demo IDs to existing database rows: `VITE_DEMO_PASSENGER_ID`, `VITE_DEMO_DRIVER_ID`, and `VITE_DEMO_VEHICLE_ID`. These IDs are local development wiring only, not authentication.
4. Start the API from `backend/` with `npm install` and `npm start`.
5. Start the web app from `frontend/` with `npm install` and `npm run dev`.

The demo ID values are sent by the browser and are not safe identity claims. Replace them with IDs from the authenticated session before deployment.

## API

- `GET /api/locations` — active locations from `locations`
- `GET /api/ride-requests` — queue entries; optional `passengerId`, `driverId`, and `status` filters
- `POST /api/ride-requests` — creates a passenger queue entry
- `GET /api/drivers?seatsNeeded=2` — available drivers with enough seats
- `GET /api/drivers/:driverId/vehicle?vehicleId=1` — driver's active vehicle and available seats
- `PATCH /api/drivers/:driverId/status` — updates vehicle operational status
- `POST /api/ride-requests/:id/accept` — transactionally assigns a request and decrements seats
- `POST /api/ride-requests/:id/reject` — driver-specific decline; the passenger remains in the queue for other drivers. Send `driverId` in the JSON body.

## User Stories Covered

- Request a ride with pickup, destination, and seats
- Reject invalid or incomplete input
- Prevent duplicate active requests
- Load locations, passenger requests, drivers, and admin lists from the database
- Assign queue entries and update vehicle availability transactionally

## Components

| Component | Purpose |
|-----------|---------|
| `RideForm` | Collects ride request information |
| `RideRequestCard` | Displays request details |
| `RequestStatus` | Shows queue status and available drivers |
| `RideRequestPage` | Main page for the feature |

## Service

`ride-request-service.js` validates values against the active locations returned by the API. The backend validates again and persists queue entries and assignments against the supplied schema.

## Testing

Frontend tests use **Vitest** and **React Testing Library**. Backend tests use **Vitest** and **Supertest**.

Run tests:

```bash
npm run test
```

Run once:

```bash
npm run test:run
```

Run backend tests from `backend/`:

```bash
npm test
```