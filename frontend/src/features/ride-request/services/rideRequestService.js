const serviceAreas = ["JU Gate", "Transport", "Hall", "Medical"];

export function validateRequest(data, hasActiveRequest = false) {
  if (hasActiveRequest) {
    return "Active request already exists";
  }

  if (!data.pickup || !data.destination) {
    return "Pickup and destination are required";
  }

  if (data.seats < 1) {
    return "Seat count must be at least 1";
  }

  if (
    !serviceAreas.includes(data.pickup) ||
    !serviceAreas.includes(data.destination)
  ) {
    return "Outside service area";
  }

  return "Valid";
}