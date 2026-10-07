import { useCallback, useEffect, useMemo, useState } from "react";
import RideForm from "../components/ride-form";
import RideRequestCard from "../components/ride-request-card";
import RequestStatus from "../components/request-status";
import useRideRequest from "../hooks/use-ride-request";
import { validateRequest } from "../services/ride-request-service";
import "../styles/ride-request.css";

const PASSENGER_ID = Number(import.meta.env.VITE_DEMO_PASSENGER_ID);
const ACTIVE_STATUSES = new Set(["Waiting", "Assigned"]);
const HAS_PASSENGER_CONFIGURATION =
  Number.isInteger(PASSENGER_ID) && PASSENGER_ID > 0;

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
  const [driverResults, setDriverResults] = useState({
    requestId: null,
    drivers: [],
  });
  const [isLoadingRequests, setIsLoadingRequests] = useState(
    HAS_PASSENGER_CONFIGURATION
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const locationById = useMemo(
    () => new Map(locations.map((location) => [String(location.id), location])),
    [locations]
  );
  const isLoadingDrivers =
    submittedRequest?.status === "Waiting" &&
    driverResults.requestId !== submittedRequest.id;
  const drivers =
    driverResults.requestId === submittedRequest?.id
      ? driverResults.drivers
      : [];

  const loadPassengerRequests = useCallback(async () => {
    if (!HAS_PASSENGER_CONFIGURATION) {
      return;
    }

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
    // The initial fetch owns its loading state; mount-time state updates are required here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPassengerRequests();
  }, [loadPassengerRequests]);

  useEffect(() => {
    if (!submittedRequest || submittedRequest.status !== "Waiting") {
      return;
    }

    let isCurrent = true;
    getAvailableDrivers(submittedRequest.seats)
      .then((response) => {
        if (isCurrent) {
          setDriverResults({
            requestId: submittedRequest.id,
            drivers: response.data,
          });
        }
      })
      .catch(() => {
        if (isCurrent) {
          setDriverResults({
            requestId: submittedRequest.id,
            drivers: [],
          });
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

    setIsLoadingRequests(true);
    setIsSubmitting(true);

    try {
      await rejectRideRequest(submittedRequest.id);
      setSubmittedRequest(null);
      setDriverResults({ requestId: null, drivers: [] });
      setRideData({
        pickupLocationId: "",
        destinationLocationId: "",
        seatsNeeded: 2,
        genderPreference: "Any",
      });
      await loadPassengerRequests();
    } catch {
      // The hook stores the API error for display.
    } finally {
      setIsSubmitting(false);
      setIsLoadingRequests(false);
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
