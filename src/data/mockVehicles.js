
import bentayga from "../assets/vehicles/bentley-bentayga.png";
import flyingSpur from "../assets/vehicles/bentley-flying-spur.png";

import lexusIS350 from "../assets/vehicles/lexus-is-350.png";
import lexusLS from "../assets/vehicles/lexus-ls.png";
import lexusES350 from "../assets/vehicles/lexus-es-350.png";
import lexusIS250 from "../assets/vehicles/lexus-is-250.png";

// Temporary demonstration pricing.
// Owners will configure actual rates in the admin dashboard.
const createPricing = (dailyRate) => ({
  currency: "NGN",
  daily: dailyRate,
  weekly: dailyRate * 6,
  monthly: dailyRate * 24,
});

const mockVehicles = [
  // ==========================
  // SEDAN CATEGORY
  // ==========================

  {
    id: "vehicle-001",
    name: "Lexus IS 350",
    brand: "Lexus",
    model: "IS 350",
    category: "Sedan",
    image: lexusIS350,
    images: [lexusIS350],

    year: 2021,
    climateControl: "A/C",
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 5,

    pricePerDay: 150000,
    pricing: createPricing(150000),

    rating: 4.8,
    available: true,
    status: "available",
    isDemo: true,

    description:
      "A premium sports sedan combining responsive performance, comfortable seating, and refined interior features. Suitable for city journeys and longer road trips.",
  },

  {
    id: "vehicle-002",
    name: "Lexus LS",
    brand: "Lexus",
    model: "LS",
    category: "Sedan",
    image: lexusLS,
    images: [lexusLS],

    year: 2022,
    climateControl: "A/C",
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 5,

    pricePerDay: 90000,
    pricing: createPricing(90000),

    rating: 4.9,
    available: true,
    status: "available",
    isDemo: true,

    description:
      "A spacious luxury sedan designed for smooth travel, refined comfort, and a premium driving experience.",
  },

  {
    id: "vehicle-003",
    name: "Lexus ES 350",
    brand: "Lexus",
    model: "ES 350",
    category: "Sedan",
    image: lexusES350,
    images: [lexusES350],

    year: 2019,
    climateControl: "A/C",
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 5,

    pricePerDay: 60000,
    pricing: createPricing(60000),

    rating: 4.8,
    available: true,
    status: "available",
    isDemo: true,

    description:
      "An elegant and comfortable sedan offering a smooth driving experience for everyday travel, business trips, and leisure journeys.",
  },

  {
    id: "vehicle-004",
    name: "Lexus IS 250",
    brand: "Lexus",
    model: "IS 250",
    category: "Sedan",
    image: lexusIS250,
    images: [lexusIS250],

    year: 2021,
    climateControl: "A/C",
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 5,

    pricePerDay: 150000,
    pricing: createPricing(150000),

    rating: 4.8,
    available: true,
    status: "available",
    isDemo: true,

    description:
      "A stylish compact luxury sedan combining everyday practicality with a comfortable cabin and responsive driving characteristics.",
  },

  // ==========================
  // LUXURY CARS CATEGORY
  // ==========================

  {
    id: "vehicle-005",
    name: "Bentley Bentayga",
    brand: "Bentley",
    model: "Bentayga",
    category: "Luxury Cars",
    image: bentayga,
    images: [bentayga],

    year: 2026,
    climateControl: "A/C",
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 5,

    pricePerDay: 400000,
    pricing: createPricing(400000),

    rating: 4.8,
    available: true,
    status: "available",
    isDemo: true,

    description:
      "A premium luxury SUV featuring a spacious interior, refined comfort, and impressive road presence for special occasions and extended journeys.",
  },

  {
    id: "vehicle-006",
    name: "Bentley Flying Spur",
    brand: "Bentley",
    model: "Flying Spur",
    category: "Luxury Cars",
    image: flyingSpur,
    images: [flyingSpur],

    year: 2024,
    climateControl: "A/C",
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 5,

    pricePerDay: 350000,
    pricing: createPricing(350000),

    rating: 4.8,
    available: true,
    status: "available",
    isDemo: true,

    description:
      "A sophisticated luxury sedan offering premium cabin comfort, elegant styling, and a refined driving experience.",
  },
];

export default mockVehicles;
