# Ride Request Feature

This module implements the **Passenger Ride Request** feature of TransitHub JU. It allows passengers to request a ride by selecting a pickup point, destination, and seat count.

## Folder Structure

```text
ride-request/
├── components/
│   ├── RideForm.jsx
│   ├── RideRequestCard.jsx
│   └── RequestStatus.jsx
├── pages/
│   └── RideRequestPage.jsx
├── services/
│   └── rideRequestService.js
├── hooks/
├── utils/
├── tests/
│   ├── RideForm.test.jsx
│   └── rideRequestService.test.js
└── index.js
```

## User Stories Covered

- Request a ride with pickup, destination, and seats
- Reject invalid or incomplete input
- Prevent duplicate active requests
- Display ride request interface

## Components

| Component | Purpose |
|-----------|---------|
| `RideForm` | Collects ride request information |
| `RideRequestCard` | Displays request details |
| `RequestStatus` | Shows pending/accepted/cancelled status |
| `RideRequestPage` | Main page for the feature |

## Service

`rideRequestService.js` contains the basic validation and request logic used by the feature.

## Testing

Tests are written using **Vitest** and **React Testing Library**.

Run tests:

```bash
npm run test
```

Run once:

```bash
npm run test:run
```