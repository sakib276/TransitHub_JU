const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

async function requestJson(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => null);
    throw new Error(errorPayload?.message || "Request failed");
  }

  return response.json();
}

export const api = {
  async getLocations() {
    return requestJson("/locations");
  },

  async getRideRequests(filters = {}) {
    const query = new URLSearchParams();

    if (filters.passengerId) {
      query.set("passengerId", filters.passengerId);
    }

    if (filters.status) {
      query.set("status", filters.status);
    }

    if (filters.driverId) {
      query.set("driverId", filters.driverId);
    }

    const queryString = query.toString();
    return requestJson(`/ride-requests${queryString ? `?${queryString}` : ""}`);
  },

  async getAvailableDrivers(seatsNeeded) {
    const query = new URLSearchParams({ seatsNeeded: String(seatsNeeded) });
    return requestJson(`/drivers?${query}`);
  },

  async getDriverVehicle(driverId, vehicleId) {
    const query = new URLSearchParams({ vehicleId: String(vehicleId) });
    return requestJson(`/drivers/${driverId}/vehicle?${query}`);
  },

  async updateDriverStatus(driverId, vehicleId, status) {
    return requestJson(`/drivers/${driverId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ vehicleId, status }),
    });
  },

  async createRideRequest(payload) {
    return requestJson("/ride-requests", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async acceptRideRequest(id, payload) {
    return requestJson(`/ride-requests/${id}/accept`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async rejectRideRequest(id, driverId) {
    return requestJson(`/ride-requests/${id}/reject`, {
      method: "POST",
      ...(driverId ? { body: JSON.stringify({ driverId }) } : {}),
    });
  },
};

export default api;
