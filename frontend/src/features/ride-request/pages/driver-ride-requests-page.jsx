import { useCallback, useEffect, useState } from "react";
import DriverRequestCard from "../components/driver-request-card";
import useRideRequest from "../hooks/use-ride-request";
import "../styles/driver-ride-requests.css";

const DRIVER_ID = Number(import.meta.env.VITE_DEMO_DRIVER_ID);
const VEHICLE_ID = Number(import.meta.env.VITE_DEMO_VEHICLE_ID);
const HAS_DRIVER_CONFIGURATION =
  Number.isInteger(DRIVER_ID) &&
  DRIVER_ID > 0 &&
  Number.isInteger(VEHICLE_ID) &&
  VEHICLE_ID > 0;

/**
 * Displays real passenger queue requests and driver vehicle availability.
 *
 * @returns {JSX.Element} The driver request dashboard.
 */
export default function DriverRideRequestsPage() {
  const {
    error,
    setError,
    getRideRequests,
    getDriverVehicle,
    acceptRideRequest,
    rejectRideRequest,
    updateDriverStatus,
  } = useRideRequest({ shouldLoadLocations: false });
  const [requests, setRequests] = useState([]);
  const [vehicle, setVehicle] = useState(null);
  const [isLoading, setIsLoading] = useState(HAS_DRIVER_CONFIGURATION);
  const [isProcessing, setIsProcessing] = useState(false);

  const loadDashboard = useCallback(async () => {
    if (!HAS_DRIVER_CONFIGURATION) {
      setError("Set VITE_DEMO_DRIVER_ID and VITE_DEMO_VEHICLE_ID to active database IDs until login is connected.");
      return;
    }

    try {
      const [requestResponse, vehicleResponse] = await Promise.all([
        getRideRequests({ status: "Waiting", driverId: DRIVER_ID }),
        getDriverVehicle(DRIVER_ID, VEHICLE_ID),
      ]);
      setRequests(requestResponse.data);
      setVehicle(vehicleResponse.data);
    } catch {
      // The hook stores the API error for display.
    } finally {
      setIsLoading(false);
    }
  }, [getDriverVehicle, getRideRequests, setError]);

  useEffect(() => {
    // The initial fetch owns its loading state; mount-time state updates are required here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDashboard();
  }, [loadDashboard]);

  const handleAccept = async (request) => {
    setIsProcessing(true);
    setIsLoading(true);

    try {
      await acceptRideRequest(request.id, {
        driverId: DRIVER_ID,
        vehicleId: VEHICLE_ID,
        seatsAssigned: request.seats,
      });
      await loadDashboard();
    } catch {
      // The hook stores the API error for display.
    } finally {
      setIsProcessing(false);
      setIsLoading(false);
    }
  };

  const handleReject = async (requestId) => {
    setIsProcessing(true);
    setIsLoading(true);

    try {
      await rejectRideRequest(requestId, DRIVER_ID);
      await loadDashboard();
    } catch {
      // The hook stores the API error for display.
    } finally {
      setIsProcessing(false);
      setIsLoading(false);
    }
  };

  const handleAvailabilityChange = async () => {
    if (!vehicle || !["Available", "Offline"].includes(vehicle.driverStatus)) {
      return;
    }

    setIsProcessing(true);
    setIsLoading(true);
    const status = vehicle.driverStatus === "Available" ? "Offline" : "Available";

    try {
      await updateDriverStatus(DRIVER_ID, VEHICLE_ID, status);
      await loadDashboard();
    } catch {
      // The hook stores the API error for display.
    } finally {
      setIsProcessing(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="ride-layout">
      <header className="header-placeholder">Header</header>
      <div className="ride-body">
        <aside className="sidebar-placeholder">Sidebar</aside>
        <main className="ride-content">
          <div className="page-title">
            <h1>Driver Ride Requests</h1>
            <p>View and respond to passenger queue requests.</p>
          </div>

          {error && <div className="driver-message" role="alert">{error}</div>}
          <div className="driver-topbar">
            <div className="seat-badge">
              Available Seats: {vehicle?.availableSeats ?? "—"}
            </div>
            <button
              className={vehicle?.driverStatus === "Available" ? "online-btn" : "offline-btn"}
              onClick={handleAvailabilityChange}
              disabled={
                !vehicle ||
                isProcessing ||
                !["Available", "Offline"].includes(vehicle.driverStatus)
              }
            >
              {!vehicle
                ? "Offline"
                : vehicle.driverStatus === "Available"
                  ? "Go Offline"
                  : vehicle.driverStatus === "Offline"
                    ? "Go Online"
                    : vehicle.driverStatus}
            </button>
          </div>

          <div className="driver-list">
            {isLoading ? (
              <div className="empty-card">Loading ride requests...</div>
            ) : vehicle?.driverStatus !== "Available" ? (
              <div className="empty-card">
                Driver status: {vehicle?.driverStatus || "Offline"}. No new requests available.
              </div>
            ) : requests.length === 0 ? (
              <div className="empty-card">No pending ride requests.</div>
            ) : (
              requests.map((request) => (
                <DriverRequestCard
                  key={request.id}
                  request={request}
                  onAccept={() => handleAccept(request)}
                  onReject={() => handleReject(request.id)}
                  disabled={isProcessing}
                />
              ))
            )}
          </div>
        </main>
      </div>
      <footer className="footer-placeholder">Footer</footer>
    </div>
  );
}
