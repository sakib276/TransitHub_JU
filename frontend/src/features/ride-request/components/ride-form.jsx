/**
 * Renders the fields stored for a passenger queue entry.
 *
 * @param {object} props - Form props.
 * @param {object} props.rideData - Current ride request values.
 * @param {Function} props.setRideData - Updates ride data in parent state.
 * @param {Function} props.onSubmit - Creates a queue entry.
 * @param {Function} props.onCancel - Resets the form.
 * @param {Array<object>} [props.locations=[]] - Active locations from the API.
 * @param {boolean} [props.isSubmitting=false] - Whether creation is in progress.
 * @param {boolean} [props.isLoadingLocations=false] - Whether locations are loading.
 * @param {boolean} [props.isRequestActive=false] - Whether a request is already active.
 * @param {boolean} [props.isCancelDisabled=false] - Whether the active request cannot be cancelled.
 * @returns {JSX.Element} The ride request form.
 */
export default function RideForm({
  rideData,
  setRideData,
  onSubmit,
  onCancel,
  locations = [],
  isSubmitting = false,
  isLoadingLocations = false,
  isRequestActive = false,
  isCancelDisabled = false,
}) {
  const updateField = (field, value) => {
    setRideData((previousData) => ({
      ...previousData,
      [field]: value,
    }));
  };

  const isSubmitDisabled =
    isSubmitting || isLoadingLocations || locations.length === 0 || isRequestActive;

  return (
    <div className="card">
      <h2>Trip Details</h2>

      <div className="form-group">
        <label htmlFor="pickup">Pickup Point</label>
        <select
          id="pickup"
          value={rideData.pickupLocationId}
          onChange={(event) =>
            updateField("pickupLocationId", event.target.value)
          }
          disabled={isLoadingLocations || locations.length === 0}
        >
          <option value="">
            {isLoadingLocations ? "Loading locations..." : "Select pickup"}
          </option>
          {locations.map((location) => (
            <option
              key={location.id}
              value={location.id}
              disabled={String(location.id) === String(rideData.destinationLocationId)}
            >
              {location.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="destination">Destination</label>
        <select
          id="destination"
          value={rideData.destinationLocationId}
          onChange={(event) =>
            updateField("destinationLocationId", event.target.value)
          }
          disabled={isLoadingLocations || locations.length === 0}
        >
          <option value="">
            {isLoadingLocations ? "Loading locations..." : "Select destination"}
          </option>
          {locations.map((location) => (
            <option
              key={location.id}
              value={location.id}
              disabled={String(location.id) === String(rideData.pickupLocationId)}
            >
              {location.name}
            </option>
          ))}
        </select>
      </div>

      <div className="row">
        <div className="form-group">
          <label htmlFor="seats">Seats</label>
          <input
            id="seats"
            type="number"
            min="1"
            max="4"
            value={rideData.seatsNeeded}
            onChange={(event) =>
              updateField("seatsNeeded", Number(event.target.value))
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender Preference</label>
          <select
            id="gender"
            value={rideData.genderPreference}
            onChange={(event) =>
              updateField("genderPreference", event.target.value)
            }
          >
            <option value="Any">Any</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </div>

      <div className="button-row">
        <button
          type="button"
          className="primary-btn"
          onClick={onSubmit}
          disabled={isSubmitDisabled}
        >
          {isSubmitting ? "Joining Queue..." : "Request Ride"}
        </button>
        <button
          type="button"
          className="secondary-btn"
          onClick={onCancel}
          disabled={isSubmitting || isCancelDisabled}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
