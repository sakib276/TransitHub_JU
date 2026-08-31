/**
 * Queue Administration Table module.
 * @module AdminQueueTable
 */

/**
 * Displays the ordered passenger queue for administrators.
 *
 * The table shows queue position, passenger information,
 * priority status, and provides a button to assign seats.
 *
 * @memberof module:AdminQueueTable
 * @param {Object} props Component properties.
 * @param {Array<Object>} props.passengers Ordered list of waiting passengers.
 * @param {Function} props.onAssign Callback invoked when assigning a passenger.
 * @returns {JSX.Element} Admin queue table component.
 */
export default function AdminQueueTable({ passengers, onAssign }) {
  return (
    <section className="queue-card table-card">
      <h2>Queue order</h2>

      {passengers.length === 0 ? (
        <p className="queue-empty-state">
          No passengers are waiting at this location.
        </p>
      ) : (
        <div className="queue-table-wrap">
          <table className="queue-table">
            <thead>
              <tr>
                <th>Position</th>
                <th>Token</th>
                <th>Passenger</th>
                <th>Pickup</th>
                <th>Destination</th>
                <th>Seats</th>
                <th>Gender</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {passengers.map((passenger, index) => (
                <tr key={passenger.id}>
                  <td>#{index + 1}</td>
                  <td>{passenger.token}</td>
                  <td>{passenger.name}</td>
                  <td>{passenger.pickup}</td>
                  <td>{passenger.destination}</td>
                  <td>{passenger.seats}</td>
                  <td>{passenger.gender}</td>
                  <td>{passenger.priority ? "Verified" : "Standard"}</td>
                  <td>
                    <button
                      className="queue-table-action"
                      onClick={() => onAssign(passenger.id)}
                    >
                      Assign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}