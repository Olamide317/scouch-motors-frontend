import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import searchIcon from "../assets/icons/search.svg";
import VehicleCard from "./VehicleCard";
import mockVehicles from "../data/mockVehicles";
import lexusLogo from "../assets/vehicles/brands/lexus.png";
import mercedesLogo from "../assets/vehicles/brands/mercedes.png";
import toyotaLogo from "../assets/vehicles/brands/toyota.png";
import hondaLogo from "../assets/vehicles/brands/honda.png";
import audiLogo from "../assets/vehicles/brands/audi.png";
import bmwLogo from "../assets/vehicles/brands/bmw.png";

// VEHICLE CATEGORIES FROM FIGMA
const categories = [
  "Sedan",
  "SUV",
  "Buses",
  "Trucks",
  "Super Cars",
  "Luxury Cars",
];

// MANUFACTURERS FROM FIGMA
const manufacturers = [
  { name: "Lexus", logo: lexusLogo },
  { name: "Mercedes", logo: mercedesLogo },
  { name: "Toyota", logo: toyotaLogo },
  { name: "Honda", logo: hondaLogo },
  { name: "Audi", logo: audiLogo },
  { name: "BMW", logo: bmwLogo },
];

function getCategory(vehicle) {
  if (
    vehicle.category === "Luxury SUV" ||
    vehicle.category === "Luxury Sedan"
  ) {
    return "Luxury Cars";
  }

  return vehicle.category;
}

function getBrand(vehicle) {
  return vehicle.brand || vehicle.name.split(" ")[0];
}

function Vehicles() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Sedan");
  const [activeBrand, setActiveBrand] = useState("Lexus");
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  function handleBook(vehicle) {
    navigate(`/vehicles/${vehicle.id}/book`);
  }

  // FILTER VEHICLES
  const filteredVehicles = useMemo(() => {
    const query = search.trim().toLowerCase();

    return mockVehicles.filter((vehicle) => {
      const category = getCategory(vehicle);
      const brand = getBrand(vehicle);

      // Global search takes priority.
      if (query) {
        const searchableText = [
          vehicle.name,
          brand,
          category,
          vehicle.category,
          vehicle.transmission,
          vehicle.fuelType,
          vehicle.year,
        ]
          .filter((value) => value != null)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(query);
      }

      // View all displays the entire mock inventory.
      if (showAll) {
        return true;
      }

      const matchesCategory = category === activeCategory;

      const matchesBrand =
        !activeBrand || brand.toLowerCase() === activeBrand.toLowerCase();

      return matchesCategory && matchesBrand;
    });
  }, [search, activeCategory, activeBrand, showAll]);

  // GLOBAL SEARCH
  function handleSearch(value) {
    setSearch(value);
  }

  // CATEGORY FILTER
  function handleCategory(category) {
    setActiveCategory(category);
    setSearch("");
    setShowAll(false);

    // Select a manufacturer with vehicles in this category.
    // If none of the six manufacturers has demo vehicles,
    // leave the manufacturer unrestricted.
    const firstMatchingBrand = manufacturers.find((manufacturer) =>
      mockVehicles.some(
        (vehicle) =>
          getCategory(vehicle) === category &&
          getBrand(vehicle).toLowerCase() === manufacturer.name.toLowerCase(),
      ),
    );

    setActiveBrand(firstMatchingBrand?.name ?? null);
  }

  // MANUFACTURER FILTER
  function handleBrand(brand) {
    setActiveBrand(brand);
    setSearch("");
    setShowAll(false);
  }

  // RESTORE FIGMA DEFAULT
  function resetFilters() {
    setSearch("");
    setActiveCategory("Sedan");
    setActiveBrand("Lexus");
    setShowAll(false);
  }

  // VIEW ALL VEHICLES
  function handleViewAll() {
    setSearch("");
    setShowAll(true);
  }

  const isGlobalView = showAll || search.trim() !== "";

  return (
    <section
      id="vehicles"
      className="w-full bg-white px-5 pt-16 pb-20 sm:px-8 lg:px-[4.05%] lg:pt-24"
    >
      <div className="mx-auto flex w-full max-w-[1728px] flex-col items-center">
        {/* SECTION HEADING */}
        <h2 className="text-center text-[28px] font-bold text-[#3D3D3D] sm:text-[32px] lg:text-[30px]">
          Vehicle Models
        </h2>

        {/* SUBTITLE */}
        <p className="mt-3 text-center text-base font-medium text-[#3D3D3D]/90 sm:text-xl lg:text-[20px]">
          Our available rentable cars
        </p>

        {/* SEARCH BAR */}
        <div
          className="
    mt-7
    flex
    h-[48px]
    w-full
    max-w-[650px]
    items-center
    gap-3
    rounded-full
    bg-white
    px-5
    shadow-[0_1px_14px_rgba(169,169,169,0.25)]
    sm:h-[55px]
  "
        >
          {/* SEARCH ICON */}
          <img
            src={searchIcon}
            alt=""
            aria-hidden="true"
            className="
      h-[22px]
      w-[22px]
      shrink-0
      object-contain
      brightness-0
      opacity-60
      sm:h-[25px]
      sm:w-[25px]
    "
          />

          {/* SEARCH INPUT */}
          <input
            type="search"
            placeholder="Search for a car"
            aria-label="Search available vehicles"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="
      w-full
      min-w-0
      bg-transparent
      text-[14px]
      text-[#3D3D3D]
      outline-none
      placeholder:text-[14px]
      placeholder:text-[#3D3D3D]/60
      sm:text-[16px]
      sm:placeholder:text-[16px]
    "
          />

          {/* CLEAR SEARCH BUTTON */}
          {search && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setSearch("")}
              className="
        shrink-0
        px-2
        text-xl
        text-[#3D3D3D]/60
        hover:text-[#233D4D]
      "
            >
              &times;
            </button>
          )}
        </div>

        {/* VEHICLE CATEGORY TABS */}
        <div
          className="
    mt-12
    grid
    w-full
    max-w-[1524px]
    grid-cols-2
    justify-items-center
    gap-x-4
    gap-y-4
    sm:grid-cols-3
    lg:grid-cols-6
  "
          role="group"
          aria-label="Vehicle categories"
        >
          {categories.map((category) => {
            const isActive = !isGlobalView && activeCategory === category;

            const isWide =
              category === "Super Cars" || category === "Luxury Cars";

            return (
              <button
                key={category}
                type="button"
                aria-pressed={isActive}
                onClick={() => handleCategory(category)}
                className={`
          flex
          h-[50px]
          items-center
          justify-center
          whitespace-nowrap
          rounded-[13px]
          px-4
          text-sm
          transition-colors
          sm:text-base
          2xl:text-[20px]
          ${isWide ? "w-[130px] 2xl:w-[210px]" : "w-[105px] 2xl:w-[151px]"}
          ${
            isActive
              ? "bg-[rgba(248,121,39,0.17)] font-bold text-[#F87927]"
              : "bg-[#F5F5F5] font-medium text-[#626262] hover:bg-gray-200"
          }
        `}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* MANUFACTURER SELECTOR */}
        <div
          className="mt-[clamp(30px,2.72vw,47px)] w-full max-w-[1366px] overflow-x-auto rounded-[22px] bg-black px-2 py-[5px] lg:w-[79.05vw]"
          role="group"
          aria-label="Vehicle manufacturers"
        >
          <div className="grid min-w-[720px] grid-cols-6 items-center">
            {manufacturers.map((brand, index) => {
              const isActive = !isGlobalView && activeBrand === brand.name;

              return (
                <div
                  key={brand.name}
                  className="relative flex min-w-0 items-center justify-center"
                >
                  {/* FAINT VERTICAL SEPARATOR */}
                  {index > 0 && (
                    <span
                      aria-hidden="true"
                      className=" pointer-events-none absolute -left-px top-[10px] h-[50px] w-px bg-white/15"
                    />
                  )}

                  {/* MANUFACTURER BUTTON */}
                  <button
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => handleBrand(brand.name)}
                    className={`relative z-10 flex h-[70px] w-[calc(100%-12px)] flex-col items-center justify-center gap-[3px] rounded-[15px] transition-colors
              ${isActive ? "bg-white/20" : "hover:bg-white/10"}`}
                  >
                    <img
                      src={brand.logo}
                      alt=""
                      aria-hidden="true"
                      className=" h-[30px] w-auto max-w-[72px] object-contain"
                    />

                    <span className=" text-sm font-medium leading-tight  text-white 2xl:text-[20px]">
                      {brand.name}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* VEHICLE RESULTS */}
        {filteredVehicles.length > 0 ? (
          <div className="mt-10 grid w-full grid-cols-1 justify-items-center gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3 2xl:gap-x-[60px]">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onBook={handleBook}
              />
            ))}
          </div>
        ) : (
          <div className="mt-12 flex flex-col items-center gap-4 py-12 text-center">
            <h3 className="text-xl font-semibold text-[#233D4D]">
              No vehicles found
            </h3>

            <p className="max-w-md text-sm text-[#3D3D3D]/70">
              No demonstration vehicles match your current selection.
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="rounded-lg bg-[#233D4D] px-6 py-3 font-semibold text-white hover:opacity-90"
            >
              Back to Sedan
            </button>
          </div>
        )}

        {/* VIEW ALL */}
        <div className="mt-8 flex w-full justify-end">
          <button
            type="button"
            onClick={handleViewAll}
            className="flex h-[58px] items-center gap-[18px] text-[#3D3D3D] transition-colors hover:text-[#F87927]"
          >
            <span className="text-lg font-medium 2xl:text-2xl">View all</span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="11"
              height="22"
              viewBox="0 0 11 22"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M1 1L10 11L1 21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* MOCK INVENTORY NOTICE */}
        <p className="mt-4 text-center text-xs text-[#3D3D3D]/60">
          Demonstration vehicles and prices. Actual inventory and rates are
          subject to confirmation.
        </p>
      </div>
    </section>
  );
}

export default Vehicles;
