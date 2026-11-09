import express from 'express';
import cors from 'cors';
import authenticationRoutes from './features/auth/authentication.routes.js';
import driverVehicleRoutes from './features/driver-vehicle/driverVehicle.routes.js';
import rideRequestRoutes from './features/ride-request/rideRequest.routes.js';

/**
 * The Express application: middleware + all API routes.
 *
 * It is kept separate from server.js so tests can use the app
 * without actually starting a server on a port.
 */
const app = express();

// Allow the React app (a different port) to call this API.
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173' }));

// Read JSON request bodies into req.body.
app.use(express.json());

// Quick check that the server is running: GET /health
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Feature routes
app.use('/api/auth', authenticationRoutes); // login, register, password reset (feature/registration-login)
app.use('/api/driver-vehicle', driverVehicleRoutes);
app.use('/api/ride-requests', rideRequestRoutes);

// Any other URL → 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

export default app;
