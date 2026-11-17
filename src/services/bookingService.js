import { apiRequest } from "./api";

export function getRentalQuote({ vehicleId, pickupAt, returnAt }) {
  return apiRequest("/api/bookings/quote", {
    method: "POST",
    body: { vehicleId, pickupAt, returnAt },
  });
}

export function getRentalAvailability({
  vehicleId,
  pickupAt,
  returnAt,
}) {
  const params = new URLSearchParams({
    pickupAt,
    returnAt,
  });

  return apiRequest(
    `/api/vehicles/${encodeURIComponent(vehicleId)}/availability?${params.toString()}`
  );
}

export function submitBookingRequest({
  vehicleId,
  pickupAt,
  returnAt,
}) {
  return apiRequest("/api/bookings", {
    method: "POST",
    authenticated: true,
    body: {
      vehicleId,
      pickupAt,
      returnAt,
      pickupLocation: { type: "office" },
      returnLocation: { type: "office" },
    },
  });
}