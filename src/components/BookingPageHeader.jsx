import { Link } from "react-router-dom";

function BookingPageHeader({ vehicle }) {
  return (
    <div className="mb-10">
      {/* BREADCRUMB */}
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-2 text-sm"
      >
        <Link
          to="/#vehicles"
          className="text-[#3D3D3D]/60 transition-colors hover:text-[#F87927]"
        >
          Vehicles
        </Link>

        <span className="text-[#3D3D3D]/40">/</span>

        <Link
          to={`/vehicles/${vehicle.id}`}
          className="text-[#3D3D3D]/60 transition-colors hover:text-[#F87927]"
        >
          {vehicle.name}
        </Link>

        <span className="text-[#3D3D3D]/40">/</span>

        <span className="font-semibold text-[#233D4D]">
          Booking
        </span>
      </nav>

      {/* PAGE HEADING */}
      <div className="mt-7">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#F87927]">
          Vehicle Rental
        </p>

        <h1 className="text-3xl font-bold leading-tight text-[#233D4D] sm:text-4xl">
          Book Your Vehicle
        </h1>

        <p className="mt-3 max-w-[680px] text-base leading-7 text-[#3D3D3D]/70">
          Choose your rental dates, pickup and return preferences,
          and review your estimated rental cost.
        </p>
      </div>
    </div>
  );
}

export default BookingPageHeader;