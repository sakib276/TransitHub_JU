import { useEffect, useState } from "react";

import TripHistoryCard from "../components/TripHistoryCard";
import { getTripHistory } from "../tripHistoryApi";
import "./TripHistory.css";

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

  const [selectedTrip, setSelectedTrip] = useState(null);

  /**
   * Loads trip history from the API.
   *
   * @param {Object} filters - Optional trip history filters.
   */
  async function loadTripHistory(filters = {}) {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getTripHistory(filters);

      setTrips(data || []);

      if (data && data.length > 0) {
        setSelectedTrip(data[0]);
      } else {
        setSelectedTrip(null);
      }
    } catch {
  setErrorMessage(
    "Unable to load trip history. Please try again."
  );
}
 finally {
      setLoading(false);
    }
  }

useEffect(() => {
  const fetchTripHistory = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getTripHistory({});

      setTrips(data || []);

      if (data && data.length > 0) {
        setSelectedTrip(data[0]);
      } else {
        setSelectedTrip(null);
      }
    } catch {
      setErrorMessage(
        "Unable to load trip history. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  fetchTripHistory();
}, []);

  /**
   * Applies the selected date and destination filters.
   */
  async function handleApplyFilters() {
    const filters = {};

    if (date) {
      filters.date = date;
    }

    if (destination) {
      filters.destination = destination;
    }

    await loadTripHistory(filters);
  }

  /**
   * Clears all filters and loads complete trip history.
   */
  async function handleClearFilters() {
    setDate("");
    setDestination("");

    await loadTripHistory({});
  }

  return (
    <main className="trip-history-page">
      <div className="trip-history-layout">
        <section className="trip-history-main">
          <h1 className="trip-history-title">
            Trip History
          </h1>

          <section className="trip-filters">
            <div className="filter-group">
              <label htmlFor="trip-search">
                Search trips
              </label>

              <div className="search-wrapper">
                <input
                  id="trip-search"
                  className="filter-input"
                  type="text"
                  placeholder="Search by location or driver..."
                />
              </div>
            </div>

            <div className="filter-group">
              <label htmlFor="date">
                Date range
              </label>

              <input
                id="date"
                className="filter-input"
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </div>

            <div className="filter-row-bottom">
              <div className="filter-group">
                <label htmlFor="destination">
                  Destination
                </label>

                <select
                  id="destination"
                  className="filter-select"
                  value={destination}
                  onChange={(event) =>
                    setDestination(event.target.value)
                  }
                >
                  <option value="">
                    All Destinations
                  </option>

                  <option value="Central Library">
                    Central Library
                  </option>

                  <option value="Sociology Building">
                    Sociology Building
                  </option>

                  <option value="New Academic Building">
                    New Academic Building
                  </option>

                  <option value="Engineering Building">
                    Engineering Building
                  </option>
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="status">
                  Ride status
                </label>

                <select
                  id="status"
                  className="filter-select"
                  defaultValue="all"
                >
                  <option value="all">
                    All Statuses
                  </option>
                  <option value="completed">
                    Completed
                  </option>
                  <option value="cancelled">
                    Cancelled
                  </option>
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="ride-type">
                  Ride type
                </label>

                <select
                  id="ride-type"
                  className="filter-select"
                  defaultValue="all"
                >
                  <option value="all">
                    All Types
                  </option>
                  <option value="regular">
                    Regular
                  </option>
                  <option value="ride-share">
                    Ride Share
                  </option>
                </select>
              </div>
            </div>

            <div className="filter-buttons">
              <button
                type="button"
                className="filter-button"
                onClick={handleApplyFilters}
              >
                Apply Filters
              </button>

              <button
                type="button"
                className="filter-button"
                onClick={handleClearFilters}
              >
                Clear Filters
              </button>
            </div>
          </section>

          {loading && (
            <div className="loading-message">
              Loading trip history...
            </div>
          )}

          {errorMessage && (
            <div className="error-message">
              {errorMessage}
            </div>
          )}

          {!loading && !errorMessage && trips.length === 0 && (
            <div className="empty-message">
              No trip history available.
            </div>
          )}

          {!loading && trips.length > 0 && (
            <>
              <div className="trip-list">
                {trips.map((trip) => (
                  <TripHistoryCard
                    key={trip.historyId}
                    trip={trip}
                    onSelect={() => setSelectedTrip(trip)}
                  />
                ))}
              </div>

              <div className="pagination">
                <button
                  type="button"
                  className="previous-next"
                >
                  ← Previous
                </button>

                <div className="pagination-pages">
                  <button
                    type="button"
                    className="page-button"
                  >
                    1
                  </button>

                  <button
                    type="button"
                    className="page-button active"
                  >
                    2
                  </button>

                  <button
                    type="button"
                    className="page-button"
                  >
                    3
                  </button>

                  <button
                    type="button"
                    className="page-button"
                  >
                    4
                  </button>

                  <button
                    type="button"
                    className="page-button"
                  >
                    5
                  </button>
                </div>

                <button
                  type="button"
                  className="previous-next"
                >
                  Next →
                </button>
              </div>
            </>
          )}
        </section>

        <aside className="right-column">
          <section className="trip-details-panel">
            <h2 className="panel-title">
              Trip Details
            </h2>

            <div className="map-placeholder" />

            {selectedTrip ? (
              <>
                <div className="detail-list">
                  <div className="detail-row">
                    <strong>Pickup location</strong>
                    <span>
                      {selectedTrip.pickup || "Main Gate"}
                    </span>
                  </div>

                  <div className="detail-row">
                    <strong>Destination</strong>
                    <span>
                      {selectedTrip.destination}
                    </span>
                  </div>

                  <div className="detail-row">
                    <strong>Date</strong>
                    <span>
                      {selectedTrip.completedAt
                        ? new Date(
                            selectedTrip.completedAt
                          ).toLocaleDateString()
                        : "25 Jul 2026"}
                    </span>
                  </div>

                  <div className="detail-row">
                    <strong>Time</strong>
                    <span>
                      {selectedTrip.completedAt
                        ? new Date(
                            selectedTrip.completedAt
                          ).toLocaleTimeString()
                        : "09:30 AM"}
                    </span>
                  </div>

                  <div className="detail-row">
                    <strong>Fare</strong>
                    <span>
                      ৳ {selectedTrip.farePaid || 0}
                    </span>
                  </div>

                  <div className="detail-row">
                    <strong>Seats booked</strong>
                    <span>2</span>
                  </div>
                </div>

                <div className="driver-vehicle">
                  <div className="driver-section">
                    <div className="info-heading">
                      Driver Information
                    </div>

                    <div className="info-content">
                      <div className="avatar-placeholder">
                        ◯
                      </div>

                      <div>
                        <div>
                          {selectedTrip.driverName ||
                            "Driver Name"}
                        </div>
                        <div>☆ 4.8</div>
                      </div>
                    </div>
                  </div>

                  <div className="vehicle-section">
                    <div className="info-heading">
                      Vehicle Information
                    </div>

                    <div className="info-content">
                      <div className="vehicle-placeholder">
                        🚗
                      </div>

                      <div>
                        <div>
                          Vehicle (A 1234)
                        </div>
                        <div>
                          White - Toyota Axio
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="payment-status">
                  <span>Payment Status</span>

                  <span className="paid-badge">
                    Paid
                  </span>
                </div>
              </>
            ) : (
              <p>No trip selected.</p>
            )}
          </section>

          <section className="trip-statistics">
            <h2 className="panel-title">
              Trip Statistics
            </h2>

            <div className="statistics-grid">
              <div className="stat-card">
                <div className="stat-icon">⌁</div>
                <div className="stat-label">
                  Total Trips
                </div>
                <div className="stat-value">
                  {trips.length}
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⌖</div>
                <div className="stat-label">
                  Total Distance
                </div>
                <div className="stat-value">
                  248 km
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">▱</div>
                <div className="stat-label">
                  Total Fare Spent
                </div>
                <div className="stat-value">
                  ৳ 1,920
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">☆</div>
                <div className="stat-label">
                  Most Visited Destination
                </div>
                <div className="stat-value">
                  Central Library
                </div>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}

export default TripHistory;