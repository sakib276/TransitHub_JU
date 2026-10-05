import { useEffect, useMemo, useState } from "react";
import AdminRequestTable from "../components/admin-request-table";
import useRideRequest from "../hooks/use-ride-request";
import "../styles/admin-ride-requests.css";

const REQUEST_STATUSES = ["Waiting", "Assigned", "Completed", "No-show", "Cancelled"];

/**
 * Provides database-backed filtering and oversight for passenger queue entries.
 *
 * @returns {JSX.Element} The admin ride request page.
 */
export default function AdminRideRequestsPage() {
  const { error, getRideRequests } = useRideRequest({
    shouldLoadLocations: false,
  });
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState("All");
  const [user, setUser] = useState("");
  const [date, setDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCurrent = true;
    setIsLoading(true);

    getRideRequests()
      .then((response) => {
        if (isCurrent) {
          setRequests(response.data);
        }
      })
      .catch(() => {
        setRequests([]);
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [getRideRequests]);

  const filteredRequests = useMemo(
    () =>
      requests.filter((request) => {
        const statusMatches = status === "All" || request.status === status;
        const userMatches = request.passenger
          .toLowerCase()
          .includes(user.toLowerCase());
        const requestDate = new Date(request.joinedAt).toISOString().slice(0, 10);
        const dateMatches = !date || requestDate === date;

        return statusMatches && userMatches && dateMatches;
      }),
    [date, requests, status, user]
  );

  return (
    <div className="ride-layout">
      <header className="header-placeholder">Header</header>
      <div className="ride-body">
        <aside className="sidebar-placeholder">Sidebar</aside>
        <main className="ride-content">
          <div className="page-title">
            <h1>Ride Request Administration</h1>
            <p>Monitor passenger queue entries and their current status.</p>
          </div>

          {error && <div className="admin-message" role="alert">{error}</div>}

          <div className="card">
            <h2>Filters</h2>
            <div className="filter-grid">
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                >
                  <option value="All">All</option>
                  {REQUEST_STATUSES.map((requestStatus) => (
                    <option key={requestStatus} value={requestStatus}>
                      {requestStatus}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="user">Passenger</label>
                <input
                  id="user"
                  placeholder="Search passenger..."
                  value={user}
                  onChange={(event) => setUser(event.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="date">Joined Date</label>
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                />
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="card" role="status">Loading ride requests...</div>
          ) : (
            <AdminRequestTable requests={filteredRequests} />
          )}
        </main>
      </div>
      <footer className="footer-placeholder">Footer</footer>
    </div>
  );
}
