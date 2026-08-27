import { useMemo, useState } from "react";
import AdminRequestTable from "../components/AdminRequestTable";
import "../styles/adminRideRequests.css";

const requests = [
  {
    id: 101,
    user: "Anika",
    pickup: "JU Gate",
    destination: "Medical",
    date: "2026-08-26",
    status: "Searching",
  },
  {
    id: 102,
    user: "Nafis",
    pickup: "Transport",
    destination: "Bot Tala",
    date: "2026-08-26",
    status: "Accepted",
  },
  {
    id: 103,
    user: "Raiyan",
    pickup: "Bangabandhu Hall",
    destination: "JU Gate",
    date: "2026-08-27",
    status: "Completed",
  },
  {
    id: 104,
    user: "Sadia",
    pickup: "Medical",
    destination: "Transport",
    date: "2026-08-27",
    status: "Cancelled",
  },
];

export default function AdminRideRequestsPage() {
  const [status, setStatus] = useState("All");
  const [user, setUser] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      const statusMatch = status === "All" || r.status === status;
      const userMatch = r.user.toLowerCase().includes(user.toLowerCase());
      const dateMatch = !date || r.date === date;
      return statusMatch && userMatch && dateMatch;
    });
  }, [status, user, date]);

  const unauthorizedAction = () => {
    setError("Unauthorized action blocked and logged.");
  };

  const simulateFailure = () => {
    setError("Unable to load ride data. Please try again.");
  };

  return (
    <div className="ride-layout">
      <header className="header-placeholder">Header</header>

      <div className="ride-body">
        <aside className="sidebar-placeholder">Sidebar</aside>

        <main className="ride-content">
          <div className="page-title">
            <h1>Ride Request Administration</h1>
            <p>Monitor all ride requests and their current status.</p>
          </div>

          <div className="card">
            <h2>Filters</h2>

            <div className="filter-grid">
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option>All</option>
                  <option>Searching</option>
                  <option>Accepted</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="user">User</label>
                <input
                  id="user"
                  placeholder="Search passenger..."
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {error && <div className="admin-message">{error}</div>}

          <div className="button-row">
            <button className="secondary-btn" onClick={unauthorizedAction}>
              Unauthorized Action
            </button>

            <button className="outline-btn" onClick={simulateFailure}>
              Simulate Data Failure
            </button>
          </div>

          <AdminRequestTable requests={filtered} />
        </main>
      </div>

      <footer className="footer-placeholder">Footer</footer>
    </div>
  );
}
