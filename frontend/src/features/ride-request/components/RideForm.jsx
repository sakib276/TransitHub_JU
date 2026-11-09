/**
 * Unique stop names, in the order they first appear.
 *
 * @param {Array<string>} names - Stop names (may repeat).
 * @returns {Array<string>} Names without duplicates.
 */
function uniqueNames(names) {
  return [...new Set(names)];
}

/**
 * Ride request form.
 *
 * Pickup/destination, fare and travel time come from the database
 * (routeOptions, loaded by RideRequestPage from /api/ride-requests/route-options).
 */
export default function RideForm({
  rideData,
  setRideData,
  onSubmit,
  onCancel,
  routeOptions = [],
}) {
  // Pickup list: every stop you can start from.
  const pickupNames = uniqueNames(routeOptions.map((option) => option.pickupStop));

  // Destination list: only stops reachable from the chosen pickup.
  const destinationNames = uniqueNames(
    routeOptions
      .filter((option) => !rideData.pickup || option.pickupStop === rideData.pickup)
      .map((option) => option.dropStop),
  );

  const updateField = (field, value) => {
    setRideData((previousData) => ({
      ...previousData,
      [field]: value,
    }));
  };

  const handleRouteChange = (field, value) => {
    const updatedRideData = {
      ...rideData,
      [field]: value,
    };

    const pickup = updatedRideData.pickup;

    // A new pickup may not reach the old destination, so clear it.
    if (
      field === "pickup" &&
      !routeOptions.some(
        (option) =>
          option.pickupStop === pickup &&
          option.dropStop === updatedRideData.destination
      )
    ) {
      updatedRideData.destination = "";
    }

    // routeOptions is sorted cheapest first, so this finds the cheapest route.
    const route = routeOptions.find(
      (option) =>
        option.pickupStop === pickup &&
        option.dropStop === updatedRideData.destination
    );

    updatedRideData.fare = route ? route.fare : 0;
    updatedRideData.travelTime = route ? route.travelTime : 0;

    setRideData(updatedRideData);
  };

  return (
    <div className="card">
      <h2>Trip Details</h2>

      <div className="form-group">
        <label htmlFor="pickup">Pickup Point</label>

        <select
          id="pickup"
          value={rideData.pickup}
          onChange={(e) =>
            handleRouteChange("pickup", e.target.value)
          }
        >
          <option value="">Select pickup</option>

          {pickupNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="destination">Destination</label>

        <select
          id="destination"
          value={rideData.destination}
          onChange={(e) =>
            handleRouteChange(
              "destination",
              e.target.value
            )
          }
        >
          <option value="">Select destination</option>

          {destinationNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="row">
        <div className="form-group">
          <label htmlFor="date">Date</label>

          <input
            id="date"
            type="date"
            min={new Date().toISOString().split("T")[0]}
            value={rideData.date}
            onChange={(e) =>
              updateField("date", e.target.value)
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="time">Time</label>

          <input
            id="time"
            type="time"
            value={rideData.time}
            onChange={(e) =>
              updateField("time", e.target.value)
            }
          />
        </div>
      </div>

      <div className="row">
        <div className="form-group">
          <label htmlFor="seats">Seats</label>

          <input
            id="seats"
            type="number"
            min="1"
            max="4"
            value={rideData.seats}
            onChange={(e) =>
              updateField(
                "seats",
                Number(e.target.value)
              )
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender Preference</label>

          <select
            id="gender"
            value={rideData.gender}
            onChange={(e) =>
              updateField("gender", e.target.value)
            }
          >
            <option value="">Any</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Ride Type</label>

        <div className="ride-type">
          <button
            type="button"
            className={
              rideData.rideType === "shared"
                ? "active"
                : ""
            }
            onClick={() =>
              updateField("rideType", "shared")
            }
          >
            Shared
          </button>

          <button
            type="button"
            className={
              rideData.rideType === "private"
                ? "active"
                : ""
            }
            onClick={() =>
              updateField("rideType", "private")
            }
          >
            Private
          </button>
        </div>
      </div>

      <div className="fare-box">
        <div>
          <span>Estimated Fare</span>

          <strong>
            ৳ {rideData.fare}
          </strong>
        </div>

        <div>
          <span>Travel Time</span>

          <strong>
            {rideData.travelTime} min
          </strong>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="notes">
          Additional Notes
        </label>

        <textarea
          id="notes"
          rows="3"
          placeholder="Any special pickup instructions..."
          value={rideData.notes}
          onChange={(e) =>
            updateField("notes", e.target.value)
          }
        />
      </div>

      <div className="button-row">
        <button
          type="button"
          className="primary-btn"
          onClick={onSubmit}
        >
          Request Ride
        </button>

        <button
          type="button"
          className="secondary-btn"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}