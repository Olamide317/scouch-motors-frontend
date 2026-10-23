import { Link, useParams } from "react-router-dom";
import VehicleGallery from "../components/VehicleGallery";
import mockVehicles from "../data/mockVehicles";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(price);

function VehicleDetails() {
  const { id } = useParams();

  const vehicle = mockVehicles.find((item) => item.id === id);

  if (!vehicle) {
    return (
      <main className="mx-auto max-w-[1200px] px-6 py-24 text-center">
        <h1 className="text-3xl font-bold text-[#233D4D]">
          Vehicle not found
        </h1>

        <p className="mt-4 text-[#3D3D3D]/70">
          The requested vehicle does not exist.
        </p>

        <Link
          to="/#vehicles"
          className="mt-8 inline-block rounded-xl bg-[#233D4D] px-6 py-3 text-white transition-colors hover:bg-[#34596F]"
        >
          Back to Vehicles
        </Link>
      </main>
    );
  }

  const pricing = vehicle.pricing ?? {
    daily: vehicle.pricePerDay,
    weekly: null,
    monthly: null,
  };

  const canBook =
    vehicle.available &&
    vehicle.status !== "maintenance" &&
    vehicle.status !== "inactive";

  const specifications = [
    ["Brand", vehicle.brand],
    ["Model", vehicle.model],
    ["Year", vehicle.year],
    ["Category", vehicle.category],
    ["Transmission", vehicle.transmission],
    ["Fuel Type", vehicle.fuelType],
    ["Climate Control", vehicle.climateControl],
    ["Seats", vehicle.seats],
  ];

  const rentalRates = [
    { label: "Daily", price: pricing.daily, period: "day" },
    { label: "Weekly", price: pricing.weekly, period: "week" },
    { label: "Monthly", price: pricing.monthly, period: "month" },
  ];

  return (
    <main className="bg-white px-5 py-10 sm:px-8 lg:px-[4.05%] lg:py-16">
      <div className="mx-auto max-w-[1400px]">

        {/* BREADCRUMB */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <Link
            to="/#vehicles"
            className="text-sm font-medium text-[#233D4D]/70 transition-colors hover:text-[#F87927]"
          >
            Vehicles
          </Link>

          <span className="mx-3 text-[#3D3D3D]/40">/</span>

          <span className="text-sm font-semibold text-[#233D4D]">
            {vehicle.name}
          </span>
        </nav>

        {/* VEHICLE OVERVIEW */}
        <section className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-12">

          {/* LEFT: VEHICLE GALLERY */}
          <div>
            <VehicleGallery key={vehicle.id} vehicle={vehicle} />
          </div>

          {/* RIGHT: VEHICLE INFORMATION */}
          <div className="flex flex-col">

            {/* CATEGORY */}
            <p className="text-sm font-semibold uppercase tracking-wider text-[#F87927]">
              {vehicle.category}
            </p>

            {/* VEHICLE NAME */}
            <h1 className="mt-2 text-3xl font-bold leading-tight text-[#233D4D] sm:text-4xl">
              {vehicle.name}
            </h1>

            {/* STARTING PRICE */}
            <div className="mt-6">
              <p className="text-sm font-medium text-[#3D3D3D]/65">
                Daily rental rate
              </p>

              <div className="mt-1 flex flex-wrap items-baseline gap-2">
                <span className="text-3xl font-bold text-[#233D4D] sm:text-[36px]">
                  {pricing.daily != null
                    ? formatPrice(pricing.daily)
                    : "Contact for pricing"}
                </span>

                {pricing.daily != null && (
                  <span className="text-base text-[#3D3D3D]/65">
                    / day
                  </span>
                )}
              </div>
            </div>

            {/* BOOKING BUTTON */}
            <div className="mt-6">
              {canBook ? (
                <Link
                  to={`/vehicles/${vehicle.id}/book`}
                  className="
                    inline-flex
                    min-h-[52px]
                    w-full
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#233D4D]
                    px-8
                    text-base
                    font-semibold
                    text-white
                    transition-[background-color,transform]
                    duration-200
                    hover:bg-[#34596F]
                    active:scale-[0.99]
                    sm:w-auto
                  "
                >
                  Continue to Booking
                  <span aria-hidden="true" className="ml-2">
                    →
                  </span>
                </Link>
              ) : (
                <p className="inline-flex rounded-xl bg-[#EAECF0] px-5 py-3 font-medium text-[#233D4D]">
                  Currently Unavailable
                </p>
              )}

              <p className="mt-3 text-xs leading-relaxed text-[#3D3D3D]/60">
                {canBook
                  ? "Vehicle availability for your selected dates is subject to confirmation."
                  : "This vehicle is not currently accepting rental requests."}
              </p>
            </div>

            {/* SPECIFICATIONS */}
            <div className="mt-8 border-t border-[#EAECF0] pt-6">
              <h2 className="text-xl font-bold text-[#233D4D]">
                Vehicle Specifications
              </h2>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {specifications.map(([label, value]) => (
                  <div
                    key={label}
                    className="
                      min-w-0
                      rounded-xl
                      bg-[#F8F8F8]
                      px-4
                      py-3
                    "
                  >
                    <p className="text-xs text-[#3D3D3D]/60">
                      {label}
                    </p>

                    <p className="mt-1 break-words text-sm font-semibold text-[#233D4D] sm:text-base">
                      {value ?? "—"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT VEHICLE */}
        <section className="mt-14 border-t border-[#EAECF0] pt-10 lg:mt-16">
          <h2 className="text-2xl font-bold text-[#233D4D]">
            About this Vehicle
          </h2>

          <p className="mt-4 max-w-[900px] text-base leading-8 text-[#3D3D3D]/75">
            {vehicle.description ??
              "Explore this vehicle's specifications and rental options."}
          </p>
        </section>

        {/* RENTAL PRICING */}
        <section className="mt-14 lg:mt-16">
          <h2 className="text-2xl font-bold text-[#233D4D]">
            Rental Pricing
          </h2>

          <p className="mt-2 text-sm text-[#3D3D3D]/65">
            Explore the available rental rate options.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {rentalRates.map((rate) => (
              <div
                key={rate.label}
                className="
                  rounded-2xl
                  border
                  border-[#EAECF0]
                  bg-white
                  p-6
                  transition-[border-color,box-shadow]
                  duration-200
                  hover:border-[#F87927]/40
                  hover:shadow-[0_8px_24px_rgba(35,61,77,0.06)]
                "
              >
                <p className="text-sm font-medium text-[#3D3D3D]/65">
                  {rate.label} Rate
                </p>

                <p className="mt-3 text-2xl font-bold text-[#233D4D]">
                  {rate.price != null
                    ? formatPrice(rate.price)
                    : "Contact for pricing"}
                </p>

                {rate.price != null && (
                  <p className="mt-1 text-sm text-[#3D3D3D]/55">
                    per {rate.period}
                  </p>
                )}
              </div>
            ))}
          </div>

          <p className="mt-5 text-sm leading-relaxed text-[#3D3D3D]/60">
            Demonstration prices only. Final rental rates, additional
            charges, and vehicle availability require confirmation.
          </p>
        </section>

        {/* BOTTOM NAVIGATION */}
        <div className="mt-14 border-t border-[#EAECF0] pt-8">
          <Link
            to="/#vehicles"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#233D4D] transition-colors hover:text-[#F87927]"
          >
            <span aria-hidden="true">←</span>
            Explore More Vehicles
          </Link>
        </div>
      </div>
    </main>
  );
}

export default VehicleDetails;