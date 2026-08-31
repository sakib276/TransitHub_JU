export const locations = [
  { id: 1, name: "JU Gate" }, { id: 2, name: "Transport" }, { id: 3, name: "Medical" }, { id: 4, name: "Bot Tala" },
  { id: 5, name: "Bangabandhu Hall" }, { id: 6, name: "Shaheed Salam Hall" }, { id: 7, name: "Central Library" }, { id: 8, name: "Business Studies" },
];
export const supportedPickupPoints = locations.map((location) => location.name);

export function validateQueueJoin({ pickup, destination, seats, gender, queueOpen, alreadyQueued }) {
  if (!pickup || !supportedPickupPoints.includes(pickup)) {
    return "Please choose a supported pickup point.";
  }
  if (!destination || !supportedPickupPoints.includes(destination)) return "Please choose a supported destination point.";
  if (pickup === destination) return "Pickup and destination points must be different.";
  if (!Number.isInteger(seats) || seats < 1 || seats > 4) return "Please choose between 1 and 4 seats.";
  if (!["Male", "Female", "Any"].includes(gender)) return "Please choose a gender preference.";
  if (!queueOpen) return "This queue is temporarily closed. Please try another pickup point.";
  if (alreadyQueued) return "You are already in this queue.";
  return "Valid";
}

export function validatePriorityRequest({ reason, proof, hasActiveRequest }) {
  if (hasActiveRequest) return "You already have an active priority request.";
  if (!reason) return "Please select an emergency reason.";
  if (!proof) return "Please attach supporting proof for your request.";
  return "Valid";
}

export function getQueueToken(position) {
  return `JU-${String(position).padStart(3, "0")}`;
}
