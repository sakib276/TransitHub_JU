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

  const [date, setDate] = useState("");
  const [destination, setDestination] = useState("");

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

  /**
   * Applies the selected trip history filters.
   */
  async function handleApplyFilters() {
    try {
      setLoading(true);
      setErrorMessage("");

      const filters = {};

      if (date) {
        filters.date = date;
      }

      if (destination) {
        filters.destination = destination;
      }

      const data = await getTripHistory(filters);

      setTrips(data);
    } catch (error) {
      setErrorMessage(
        "Unable to load trip history. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  /**
   * Clears all filters and retrieves the complete trip history.
   */
  async function handleClearFilters() {
    setDate("");
    setDestination("");

    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getTripHistory({});

      setTrips(data);
    } catch (error) {
      setErrorMessage(
        "Unable to load trip history. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <p>Loading trip history...</p>;
  }

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  return (
    <main>
      <h1>Trip History</h1>

      <section>
        <div>
          <label htmlFor="date">Date:</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="destination">Destination:</label>
          <select
            id="destination"
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
          >
            <option value="">All Destinations</option>
            <option value="Central Library">Central Library</option>
            <option value="Sociology Building">
              Sociology Building
            </option>
          </select>
        </div>

        <button type="button" onClick={handleApplyFilters}>
          Apply Filters
        </button>

        <button type="button" onClick={handleClearFilters}>
          Clear Filters
        </button>
      </section>

      {trips.length === 0 ? (
        <p>No trip history available.</p>
      ) : (
        <div>
          {trips.map((trip) => (
            <TripHistoryCard
              key={trip.historyId}
              trip={trip}
            />
          ))}
        </div>
      )}
    </main>
  );
}

export default TripHistory;