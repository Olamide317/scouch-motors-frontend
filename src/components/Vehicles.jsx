import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

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

function Vehicles({ browseMode = false, featured = false }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [homepageSearch, setHomepageSearch] = useState("");

  const search = browseMode ? (searchParams.get("q") ?? "") : homepageSearch;

  const [activeCategory, setActiveCategory] = useState("Sedan");
  const [activeBrand, setActiveBrand] = useState("Lexus");
  const [showAll, setShowAll] = useState(browseMode);

  // Sorting for the dedicated Browse Vehicles page.
  const [sortBy, setSortBy] = useState("default");

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

  // SORT FILTERED VEHICLES
  const sortedVehicles = useMemo(() => {
    const vehicles = [...filteredVehicles];

    switch (sortBy) {
      case "price-asc":
        return vehicles.sort((a, b) => a.pricePerDay - b.pricePerDay);

      case "price-desc":
        return vehicles.sort((a, b) => b.pricePerDay - a.pricePerDay);

      case "year-desc":
        return vehicles.sort((a, b) => b.year - a.year);

      default:
        return vehicles;
    }
  }, [filteredVehicles, sortBy]);

  // Limit the homepage to six featured vehicles.
  // The Browse Vehicles page continues showing all results.
  const displayedVehicles =
    featured && !browseMode ? sortedVehicles.slice(0, 6) : sortedVehicles;

  // GLOBAL SEARCH
  function handleSearch(value) {
    if (browseMode) {
      const updatedParams = new URLSearchParams(searchParams);

      if (value.trim()) {
        updatedParams.set("q", value);
      } else {
        updatedParams.delete("q");
      }

      setSearchParams(updatedParams, {
        replace: true,
        preventScrollReset: true,
      });
    } else {
      setHomepageSearch(value);
    }
  }

  // CATEGORY FILTER
  function handleCategory(category) {
    setActiveCategory(category);
    handleSearch("");
    setShowAll(false);

    // Select a manufacturer with vehicles in this category.
    // If none has demo vehicles, leave brand unrestricted.
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
    handleSearch("");
    setShowAll(false);
  }

  // RESET FILTERS
  function resetFilters() {
    handleSearch("");
    setActiveCategory("Sedan");
    setActiveBrand("Lexus");
    setShowAll(browseMode);
    setSortBy("default");
  }

  {
    /* VIEW ALL — HOMEPAGE ONLY */
  }
  {
    !browseMode && (
      <div className="mt-8 flex w-full justify-end">
        <Link
          to="/vehicles"
          className="
        flex
        h-[58px]
        items-center
        gap-[18px]
        text-[#3D3D3D]
        transition-colors
        hover:text-[#F87927]
      "
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
        </Link>
      </div>
    );
  }

  const isGlobalView = showAll || search.trim() !== "";

  return (
    <section
      id="vehicles"
      className="
        w-full
        bg-white
        px-5
        pt-16
        pb-20
        sm:px-8
        lg:px-[4.05%]
        lg:pt-24
      "
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
              onClick={() => handleSearch("")}
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
    mt-10
    w-full
    min-w-0
    overflow-x-auto
    pb-3
    lg:mt-12
  "
          role="group"
          aria-label="Vehicle categories"
        >
          <div
            className="
    mx-auto
    flex
    w-max
    items-center
    gap-3
    px-1
    snap-x
    snap-proximity

    lg:grid
    lg:w-full
    lg:max-w-[1524px]
    lg:grid-cols-6
    lg:justify-items-center
    lg:gap-4
    lg:px-0
  "
          >
            {categories.map((category) => {
              const isActive = !isGlobalView && activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => handleCategory(category)}
                  className={`
            flex
            h-[44px]
            shrink-0
            snap-start
            items-center
            justify-center
            whitespace-nowrap
            rounded-full
            px-5
            text-sm
            transition-colors
            duration-200

            sm:h-[48px]
            sm:text-base

            lg:h-[50px]
            lg:rounded-[13px]
            lg:px-4

            2xl:text-[20px]

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
        </div>

        {/* MOBILE CATEGORY SCROLL HINT */}
        <p className="mt-1 text-center text-xs text-[#3D3D3D]/55 lg:hidden">
          Swipe sideways to explore categories
        </p>

        {/* MANUFACTURER SELECTOR */}
        <div
          className="
            mt-[clamp(30px,2.72vw,47px)]
            w-full
            max-w-[1366px]
            overflow-x-auto
            rounded-[22px]
            bg-black
            px-2
            py-[5px]
            lg:w-[79.05vw]
          "
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
                      className="
                        pointer-events-none
                        absolute
                        -left-px
                        top-[10px]
                        h-[50px]
                        w-px
                        bg-white/15
                      "
                    />
                  )}

                  {/* MANUFACTURER BUTTON */}
                  <button
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => handleBrand(brand.name)}
                    className={`
                      relative
                      z-10
                      flex
                      h-[70px]
                      w-[calc(100%-12px)]
                      flex-col
                      items-center
                      justify-center
                      gap-[3px]
                      rounded-[15px]
                      transition-colors
                      ${isActive ? "bg-white/20" : "hover:bg-white/10"}
                    `}
                  >
                    <img
                      src={brand.logo}
                      alt=""
                      aria-hidden="true"
                      className="
                        h-[30px]
                        w-auto
                        max-w-[72px]
                        object-contain
                      "
                    />

                    <span className="text-sm font-medium leading-tight text-white 2xl:text-[20px]">
                      {brand.name}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* BROWSE PAGE RESULTS AND SORTING */}
        {browseMode && (
          <div
            className="
              mt-10
              flex
              w-full
              flex-col
              gap-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            {/* RESULTS COUNT */}
            <p
              className="text-sm font-medium text-[#3D3D3D]/70"
              aria-live="polite"
            >
              Showing {sortedVehicles.length}{" "}
              {sortedVehicles.length === 1 ? "vehicle" : "vehicles"}
            </p>

            {/* SORTING */}
            <div className="flex items-center gap-3">
              <label
                htmlFor="vehicle-sort"
                className="shrink-0 text-sm font-semibold text-[#233D4D]"
              >
                Sort By:
              </label>

              <select
                id="vehicle-sort"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="
                  min-h-[45px]
                  rounded-xl
                  border
                  border-[#EAECF0]
                  bg-white
                  px-4
                  text-sm
                  text-[#233D4D]
                  outline-none
                  focus:border-[#F87927]
                "
              >
                <option value="default">Default</option>

                <option value="price-asc">Price: Low to High</option>

                <option value="price-desc">Price: High to Low</option>

                <option value="year-desc">Newest Model Year</option>
              </select>
            </div>
          </div>
        )}

        {/* VEHICLE RESULTS */}
        {displayedVehicles.length > 0 ? (
          <div
            className={`
              grid
              w-full
              grid-cols-1
              justify-items-center
              gap-x-6
              gap-y-10
              sm:grid-cols-2
              xl:grid-cols-3
              2xl:gap-x-[60px]
              ${browseMode ? "mt-6" : "mt-10"}
            `}
          >
            {displayedVehicles.map((vehicle) => (
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
              className="
                rounded-lg
                bg-[#233D4D]
                px-6
                py-3
                font-semibold
                text-white
                hover:opacity-90
              "
            >
              {browseMode ? "Clear Filters" : "Back to Sedan"}
            </button>
          </div>
        )}

        {/* VIEW ALL — HOMEPAGE ONLY */}
        {!browseMode && (
          <div className="mt-8 flex w-full justify-end">
            <button
              type="button"
              onClick={() => navigate("/vehicles")}
              className="
                flex
                h-[58px]
                items-center
                gap-[18px]
                text-[#3D3D3D]
                transition-colors
                hover:text-[#F87927]
              "
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
        )}

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
