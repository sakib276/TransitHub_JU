const locations = [
  { id: 1, name: "JU Gate" },
  { id: 2, name: "Transport" },
  { id: 3, name: "Medical" },
  { id: 4, name: "Bot Tala" },
  { id: 5, name: "Bangabandhu Hall" },
  { id: 6, name: "Shaheed Salam Hall" },
  { id: 7, name: "Central Library" },
  { id: 8, name: "Business Studies" },
];

const routeInfo = {
  "JU Gate-Transport": { fare: 20, travelTime: 5 },
  "JU Gate-Medical": { fare: 25, travelTime: 7 },
  "JU Gate-Bot Tala": { fare: 30, travelTime: 10 },
  "JU Gate-Bangabandhu Hall": { fare: 25, travelTime: 8 },
  "JU Gate-Shaheed Salam Hall": { fare: 30, travelTime: 10 },
  "JU Gate-Central Library": { fare: 25, travelTime: 8 },
  "JU Gate-Business Studies": { fare: 30, travelTime: 10 },

  "Transport-JU Gate": { fare: 20, travelTime: 5 },
  "Transport-Medical": { fare: 15, travelTime: 4 },
  "Transport-Bot Tala": { fare: 20, travelTime: 6 },
  "Transport-Bangabandhu Hall": { fare: 20, travelTime: 6 },
  "Transport-Shaheed Salam Hall": { fare: 25, travelTime: 8 },
  "Transport-Central Library": { fare: 20, travelTime: 6 },
  "Transport-Business Studies": { fare: 25, travelTime: 8 },

  "Medical-JU Gate": { fare: 25, travelTime: 7 },
  "Medical-Transport": { fare: 15, travelTime: 4 },
  "Medical-Bot Tala": { fare: 20, travelTime: 6 },
  "Medical-Bangabandhu Hall": { fare: 20, travelTime: 6 },
  "Medical-Shaheed Salam Hall": { fare: 25, travelTime: 8 },
  "Medical-Central Library": { fare: 20, travelTime: 6 },
  "Medical-Business Studies": { fare: 25, travelTime: 8 },

  "Bot Tala-JU Gate": { fare: 30, travelTime: 10 },
  "Bot Tala-Transport": { fare: 20, travelTime: 6 },
  "Bot Tala-Medical": { fare: 20, travelTime: 6 },
  "Bot Tala-Bangabandhu Hall": { fare: 15, travelTime: 4 },
  "Bot Tala-Shaheed Salam Hall": { fare: 20, travelTime: 6 },
  "Bot Tala-Central Library": { fare: 15, travelTime: 4 },
  "Bot Tala-Business Studies": { fare: 20, travelTime: 6 },

  "Bangabandhu Hall-JU Gate": { fare: 25, travelTime: 8 },
  "Bangabandhu Hall-Transport": { fare: 20, travelTime: 6 },
  "Bangabandhu Hall-Medical": { fare: 20, travelTime: 6 },
  "Bangabandhu Hall-Bot Tala": { fare: 15, travelTime: 4 },
  "Bangabandhu Hall-Shaheed Salam Hall": { fare: 15, travelTime: 5 },
  "Bangabandhu Hall-Central Library": { fare: 15, travelTime: 4 },
  "Bangabandhu Hall-Business Studies": { fare: 20, travelTime: 6 },

  "Shaheed Salam Hall-JU Gate": { fare: 30, travelTime: 10 },
  "Shaheed Salam Hall-Transport": { fare: 25, travelTime: 8 },
  "Shaheed Salam Hall-Medical": { fare: 25, travelTime: 8 },
  "Shaheed Salam Hall-Bot Tala": { fare: 20, travelTime: 6 },
  "Shaheed Salam Hall-Bangabandhu Hall": { fare: 15, travelTime: 5 },
  "Shaheed Salam Hall-Central Library": { fare: 20, travelTime: 6 },
  "Shaheed Salam Hall-Business Studies": { fare: 20, travelTime: 6 },

  "Central Library-JU Gate": { fare: 25, travelTime: 8 },
  "Central Library-Transport": { fare: 20, travelTime: 6 },
  "Central Library-Medical": { fare: 20, travelTime: 6 },
  "Central Library-Bot Tala": { fare: 15, travelTime: 4 },
  "Central Library-Bangabandhu Hall": { fare: 15, travelTime: 4 },
  "Central Library-Shaheed Salam Hall": { fare: 20, travelTime: 6 },
  "Central Library-Business Studies": { fare: 20, travelTime: 6 },

  "Business Studies-JU Gate": { fare: 30, travelTime: 10 },
  "Business Studies-Transport": { fare: 25, travelTime: 8 },
  "Business Studies-Medical": { fare: 25, travelTime: 8 },
  "Business Studies-Bot Tala": { fare: 20, travelTime: 6 },
  "Business Studies-Bangabandhu Hall": { fare: 20, travelTime: 6 },
  "Business Studies-Shaheed Salam Hall": { fare: 20, travelTime: 6 },
  "Business Studies-Central Library": { fare: 20, travelTime: 6 },
};

export default function RideForm({
  rideData,
  setRideData,
  onSubmit,
  onCancel,
}) {
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
    const destination = updatedRideData.destination;

    if (pickup && destination && pickup !== destination) {
      const routeKey = `${pickup}-${destination}`;
      const route = routeInfo[routeKey];

      if (route) {
        updatedRideData.fare = route.fare;
        updatedRideData.travelTime = route.travelTime;
      }
    } else {
      updatedRideData.fare = 0;
      updatedRideData.travelTime = 0;
    }

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

          {locations.map((location) => (
            <option
              key={location.id}
              value={location.name}
              disabled={
                location.name === rideData.destination
              }
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
          value={rideData.destination}
          onChange={(e) =>
            handleRouteChange(
              "destination",
              e.target.value
            )
          }
        >
          <option value="">Select destination</option>

          {locations.map((location) => (
            <option
              key={location.id}
              value={location.name}
              disabled={
                location.name === rideData.pickup
              }
            >
              {location.name}
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