
import bentayga from "../assets/vehicles/bentley-bentayga.png";
import flyingSpur from "../assets/vehicles/bentley-flying-spur.png";

import lexusIS350 from "../assets/vehicles/lexus-is-350.png";
import lexusLS from "../assets/vehicles/lexus-ls.png";
import lexusES350 from "../assets/vehicles/lexus-es-350.png";
import lexusIS250 from "../assets/vehicles/lexus-is-250.png";

const mockVehicles = [
  // ==========================
  // SEDAN CATEGORY
  // ==========================

  {
    id: "vehicle-001",
    name: "Lexus IS 350",
    brand: "Lexus",
    category: "Sedan",
    image: lexusIS350,
    year: 2021,
    mileage: "220/km",
    climateControl: "30°",
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 5,
    pricePerDay: 150000,
    rating: 4.8,
    available: true,
  },

  {
    id: "vehicle-002",
    name: "Lexus LS",
    brand: "Lexus",
    category: "Sedan",
    image: lexusLS,
    year: 2022,
    mileage: "190/km",
    climateControl: "30°",
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 5,
    pricePerDay: 90000,
    rating: 4.9,
    available: true,
  },

  {
    id: "vehicle-003",
    name: "Lexus ES 350",
    brand: "Lexus",
    category: "Sedan",
    image: lexusES350,
    year: 2019,
    mileage: "200/km",
    climateControl: "30°",
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 5,
    pricePerDay: 60000,
    rating: 4.8,
    available: true,
  },

  {
    id: "vehicle-004",
    name: "Lexus IS 250",
    brand: "Lexus",
    category: "Sedan",
    image: lexusIS250,
    year: 2021,
    mileage: "190/km",
    climateControl: "30°",
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 5,
    pricePerDay: 150000,
    rating: 4.8,
    available: true,
  },

  // ==========================
  // LUXURY CARS CATEGORY
  // ==========================

  {
    id: "vehicle-005",
    name: "Bentley Bentayga",
    brand: "Bentley",
    category: "Luxury Cars",
    image: bentayga,
    year: 2026,
    mileage: "320/km",
    climateControl: "30°",
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 5,
    pricePerDay: 400000,
    rating: 4.8,
    available: true,
  },

  {
    id: "vehicle-006",
    name: "Bentley Flying Spur",
    brand: "Bentley",
    category: "Luxury Cars",
    image: flyingSpur,
    year: 2024,
    mileage: "300/km",
    climateControl: "30°",
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 5,
    pricePerDay: 350000,
    rating: 4.8,
    available: true,
  },
];

export default mockVehicles;
