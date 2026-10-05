import { useCallback, useEffect, useMemo, useState } from "react";
import RideForm from "../components/ride-form";
import RideRequestCard from "../components/ride-request-card";
import RequestStatus from "../components/request-status";
import useRideRequest from "../hooks/use-ride-request";
import { validateRequest } from "../services/ride-request-service";
import "../styles/ride-request.css";

const PASSENGER_ID = Number(import.meta.env.VITE_DEMO_PASSENGER_ID);
const ACTIVE_STATUSES = new Set(["Waiting", "Assigned"]);

/**
 * Main page for joining and tracking a passenger queue request.
 *
 * @returns {JSX.Element} The ride request page.
 */
export default function RideRequestPage() {
  const {
    locations,
    isLoadingLocations,
    error,
    setError,
    getRideRequests,
    getAvailableDrivers,
    createRideRequest,
    rejectRideRequest,
  } = useRideRequest();
  const [rideData, setRideData] = useState({
    pickupLocationId: "",
    destinationLocationId: "",
    seatsNeeded: 2,
    genderPreference: "Any",
  });
  const [submittedRequest, setSubmittedRequest] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [isLoadingDrivers, setIsLoadingDrivers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const locationById = useMemo(
    () => new Map(locations.map((location) => [String(location.id), location])),
    [locations]
  );

  const loadPassengerRequests = useCallback(async () => {
    if (!Number.isInteger(PASSENGER_ID) || PASSENGER_ID < 1) {
      setIsLoadingRequests(false);
      return;
    }

    setIsLoadingRequests(true);

    try {
      const response = await getRideRequests({ passengerId: PASSENGER_ID });
      const activeRequest = response.data.find((request) =>
        ACTIVE_STATUSES.has(request.status)
      );

      if (!activeRequest) {
        setSubmittedRequest(null);
        return;
      }

      setSubmittedRequest(activeRequest);
      setRideData({
        pickupLocationId: String(activeRequest.pickupLocationId),
        destinationLocationId: String(activeRequest.destinationLocationId),
        seatsNeeded: activeRequest.seats,
        genderPreference: activeRequest.genderPreference,
      });
    } catch {
      // The hook exposes the request error to the page.
    } finally {
      setIsLoadingRequests(false);
    }
  }, [getRideRequests]);

  useEffect(() => {
    loadPassengerRequests();
  }, [loadPassengerRequests]);

  useEffect(() => {
    if (!submittedRequest || submittedRequest.status !== "Waiting") {
      setDrivers([]);
      return;
    }

    let isCurrent = true;
    setIsLoadingDrivers(true);
    getAvailableDrivers(submittedRequest.seats)
      .then((response) => {
        if (isCurrent) {
          setDrivers(response.data);
        }
      })
      .catch(() => {
        setDrivers([]);
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoadingDrivers(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [getAvailableDrivers, submittedRequest]);

  const handleSubmit = async () => {
    setError("");

    if (!Number.isInteger(PASSENGER_ID) || PASSENGER_ID < 1) {
      setError("Set VITE_DEMO_PASSENGER_ID to an active passenger ID until login is connected.");
      return;
    }

    const pickup = locationById.get(String(rideData.pickupLocationId));
    const destination = locationById.get(String(rideData.destinationLocationId));
    const validationMessage = validateRequest(
      {
        pickup: pickup?.name,
        destination: destination?.name,
        seats: rideData.seatsNeeded,
      },
      Boolean(submittedRequest),
      locations.map((location) => location.name)
    );

    if (validationMessage !== "Valid") {
      setError(validationMessage);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createRideRequest({
        passengerId: PASSENGER_ID,
        pickupLocationId: Number(rideData.pickupLocationId),
        destinationLocationId: Number(rideData.destinationLocationId),
        seatsNeeded: rideData.seatsNeeded,
        genderPreference: rideData.genderPreference,
      });
      setSubmittedRequest(response.data);
    } catch {
      // The hook stores the API error for display.
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (!submittedRequest) {
      setRideData({
        pickupLocationId: "",
        destinationLocationId: "",
        seatsNeeded: 2,
        genderPreference: "Any",
      });
      setError("");
      return;
    }

    try {
      await rejectRideRequest(submittedRequest.id);
      setSubmittedRequest(null);
      setDrivers([]);
      setRideData({
        pickupLocationId: "",
        destinationLocationId: "",
        seatsNeeded: 2,
        genderPreference: "Any",
      });
      await loadPassengerRequests();
    } catch {
      // The hook stores the API error for display.
    }
  };

  const previewData = submittedRequest
    ? {
        ...submittedRequest,
        pickup: submittedRequest.pickup,
        destination: submittedRequest.destination,
        seatsNeeded: submittedRequest.seats,
      }
    : {
        ...rideData,
        pickup: locationById.get(String(rideData.pickupLocationId))?.name,
        destination: locationById.get(String(rideData.destinationLocationId))?.name,
      };

  return (
    <div className="ride-layout">
      <header className="header-placeholder">Header</header>
      <div className="ride-body">
        <aside className="sidebar-placeholder">Sidebar</aside>
        <main className="ride-content">
          <div className="page-title">
            <h1>Ride Request</h1>
            <p>Join the passenger queue for a ride across the JU campus.</p>
          </div>

          {error && <div className="ride-error" role="alert">{error}</div>}
          {!Number.isInteger(PASSENGER_ID) || PASSENGER_ID < 1 ? (
            <p role="status">
              Configure VITE_DEMO_PASSENGER_ID with an active passenger ID to
              submit or load requests.
            </p>
          ) : null}

          <div className="ride-grid">
            <RideForm
              rideData={rideData}
              setRideData={setRideData}
              locations={locations}
              isLoadingLocations={isLoadingLocations}
              isSubmitting={isSubmitting || isLoadingRequests}
              isRequestActive={Boolean(submittedRequest)}
              isCancelDisabled={submittedRequest?.status === "Assigned"}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
            <div className="right-column">
              <RideRequestCard rideData={previewData} />
              <RequestStatus
                submittedRequest={submittedRequest}
                drivers={drivers}
                isLoadingDrivers={isLoadingDrivers}
              />
            </div>
          </div>
        </main>
      </div>
      <footer className="footer-placeholder">Footer</footer>
    </div>
  );
}
