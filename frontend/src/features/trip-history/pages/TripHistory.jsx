import { useEffect, useState } from "react";

import TripHistoryCard from "../components/TripHistoryCard";
import { getTripHistory } from "../tripHistoryApi";

/**
 * Displays the authenticated passenger's trip history.
 *
 * @returns {JSX.Element} Trip history page.
 */
function TripHistory() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadTripHistory() {
      try {
        setLoading(true);
        setErrorMessage("");

        const data = await getTripHistory();

        setTrips(data);
      } catch (error) {
        setErrorMessage(
          "Unable to load trip history. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    loadTripHistory();
  }, []);

  if (loading) {
    return <p>Loading trip history...</p>;
  }

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  if (trips.length === 0) {
    return <p>No trip history available.</p>;
  }

  return (
    <main>
      <h1>Trip History</h1>

      <div>
        {trips.map((trip) => (
          <TripHistoryCard
            key={trip.historyId}
            trip={trip}
          />
        ))}
      </div>
    </main>
  );
}

export default TripHistory;