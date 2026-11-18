import { apiRequest } from "./api";

const categoryLabels = {
  sedan: "Sedan",
  suv: "SUV",
  coupe: "Coupe",
  hatchback: "Hatchback",
  pickup: "Pickup",
  van: "Van",
  luxury: "Luxury Cars",
};

const sortOptions = {
  default: "newest",
  "price-asc": "price_asc",
  "price-desc": "price_desc",
  "year-desc": "year_desc",
};

// Convert MongoDB vehicle data into the structure
// expected by our existing React components.
export function normalizeVehicle(vehicle) {
  if (!vehicle?._id) {
    throw new Error("Invalid vehicle data received.");
  }

  const images = Array.isArray(vehicle.images)
    ? vehicle.images.filter(
        (image) => typeof image === "string" && /^https:\/\//i.test(image),
      )
    : [];

  return {
    id: String(vehicle._id),

    name: `${vehicle.brand} ${vehicle.model}`,

    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,

    category: categoryLabels[vehicle.category] ?? vehicle.category,

    transmission: vehicle.transmission,
    fuelType: vehicle.fuelType,
    seats: vehicle.seats,

    climateControl: vehicle.climateControl ?? null,
    mileageKm: vehicle.mileageKm ?? null,

    description: vehicle.description ?? "",

    image: images[0] ?? null,
    images,

    pricing: vehicle.pricing,
    pricePerDay: vehicle.pricing?.daily ?? null,

    available:
      vehicle.isActive === true && vehicle.operationalStatus === "available",

    status: vehicle.operationalStatus,

    isDemo: vehicle.isDemo === true,
  };
}

// Retrieve a page of publicly available vehicles.
export async function getPublicVehicles({
  page = 1,
  limit = 12,
  sort = "default",
} = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sort: sortOptions[sort] ?? "newest",
  });

  const result = await apiRequest(`/api/vehicles?${params.toString()}`);

  if (!Array.isArray(result.vehicles)) {
    throw new Error("Invalid vehicle inventory response.");
  }

  return {
    vehicles: result.vehicles.map(normalizeVehicle),
    pagination: result.pagination,
  };
}

// Retrieve one publicly available vehicle by MongoDB ID.
export async function getPublicVehicleById(id) {
  if (typeof id !== "string" || !/^[a-fA-F0-9]{24}$/.test(id)) {
    throw new Error("Invalid vehicle ID.");
  }

  const result = await apiRequest(`/api/vehicles/${encodeURIComponent(id)}`);

  if (!result.vehicle) {
    throw new Error("Vehicle not found.");
  }

  return normalizeVehicle(result.vehicle);
}
