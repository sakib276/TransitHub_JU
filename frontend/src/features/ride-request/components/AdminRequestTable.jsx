export default function AdminRequestTable({ requests }) {
  const badgeClass = (status) => {
    switch (status) {
      case "Accepted":
        return "accepted";
      case "Completed":
        return "completed";
      case "Cancelled":
        return "cancelled";
      default:
        return "searching";
    }
  };

  return (
    <div className="card">
      <h2>All Ride Requests</h2>

      {requests.length === 0 ? (
        <div className="empty-status">
          <p>No ride requests match the selected filters.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="request-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Route</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((req) => (
                <tr key={req.id}>
                  <td>#{req.id}</td>
                  <td>{req.user}</td>
                  <td>
                    {req.pickup} → {req.destination}
                  </td>
                  <td>{req.date}</td>
                  <td>
                    <span className={`status-pill ${badgeClass(req.status)}`}>
                      {req.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}