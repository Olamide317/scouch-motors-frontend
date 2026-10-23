import { Link } from "react-router-dom";

import yearIcon from "../assets/vehicles/specs/year.svg";
import mileageIcon from "../assets/vehicles/specs/mileage.svg";
import fuelIcon from "../assets/vehicles/specs/fuel.svg";
import climateIcon from "../assets/vehicles/specs/climate.svg";
import seatsIcon from "../assets/vehicles/specs/seats.svg";
import ratingIcon from "../assets/vehicles/specs/rating.svg";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(price);

function VehicleCard({ vehicle, onBook }) {
  const specs = [
    {
      label: "Year",
      value: vehicle.year ?? "—",
      icon: yearIcon,
    },
    {
      label: "Transmission",
      value: vehicle.transmission ?? "—",
      icon: mileageIcon,
    },
    {
      label: "Fuel type",
      value: vehicle.fuelType ?? "—",
      icon: fuelIcon,
    },
    {
      label: "Climate",
      value: vehicle.climateControl ?? "—",
      icon: climateIcon,
    },
    {
      label: "Seats",
      value:
        vehicle.seats != null
          ? `${vehicle.seats} Seats`
          : "—",
      icon: seatsIcon,
    },
    {
      label: "Rating",
      value: vehicle.rating ?? "—",
      icon: ratingIcon,
    },
  ];

  const canBook =
    vehicle.available &&
    vehicle.status !== "maintenance" &&
    vehicle.status !== "inactive" &&
    Boolean(onBook);

  return (
    <article
      className="
        group
        @container
        relative
        aspect-[5/3]
        w-full
        max-w-[500px]
        overflow-hidden
        rounded-[20px]
        bg-[#FAFAFA]
        transition-[transform,box-shadow]
        duration-300
        ease-out
        hover:-translate-y-1
        hover:shadow-[0_12px_28px_rgba(35,61,77,0.12)]
        focus-within:shadow-[0_12px_28px_rgba(35,61,77,0.12)]
        motion-reduce:transform-none
        motion-reduce:transition-none
      "
    >
      {/* CARD CLICKABLE AREA */}
      <Link
        to={`/vehicles/${vehicle.id}`}
        aria-label={`View details for ${vehicle.name}`}
        className="
          absolute
          inset-0
          z-20
          cursor-pointer
          rounded-[20px]
          focus-visible:outline
          focus-visible:outline-2
          focus-visible:outline-offset-[-3px]
          focus-visible:outline-[#F87927]
        "
      />

      {/* VEHICLE NAME */}
      <h3
        className="
          pointer-events-none
          absolute
          top-[6%]
          left-[4.4%]
          z-10
          max-w-[40%]
          text-[4cqw]
          leading-tight
          font-bold
          text-[#233D4D]
        "
      >
        {vehicle.name}
      </h3>

      {/* VEHICLE IMAGE */}
      <div
        className="
          pointer-events-none
          absolute
          top-[29%]
          left-0
          z-10
          flex
          h-[39%]
          w-[45%]
          items-center
          justify-center
        "
      >
        <img
          src={vehicle.image}
          alt={vehicle.name}
          loading="lazy"
          decoding="async"
          className="
            block
            max-h-full
            max-w-full
            object-contain
            transition-transform
            duration-300
            ease-out
            group-hover:scale-[1.04]
            motion-reduce:transition-none
          "
        />
      </div>

      {/* VEHICLE SPECIFICATIONS PANEL */}
      <div
        className="
          pointer-events-none
          absolute
          top-[6%]
          left-[45.2%]
          z-10
          grid
          h-[64.67%]
          w-[51.6%]
          grid-cols-2
          grid-rows-3
          gap-x-[3%]
          rounded-[4cqw]
          bg-[rgba(248,121,39,0.10)]
          px-[3.8%]
          py-[4.5%]
        "
      >
        {specs.map((spec) => (
          <div
            key={spec.label}
            title={spec.label}
            className="
              flex
              min-w-0
              items-center
              gap-[1cqw]
              text-[#233D4D]
            "
          >
            <img
              src={spec.icon}
              alt=""
              aria-hidden="true"
              className="
                block
                h-[4cqw]
                w-[4cqw]
                shrink-0
                object-contain
              "
            />

            <span
              className="
                min-w-0
                whitespace-nowrap
                text-[3.3cqw]
                leading-tight
                font-medium
              "
            >
              {spec.value}
            </span>
          </div>
        ))}
      </div>

      {/* VEHICLE PRICE */}
      <p
        className="
          pointer-events-none
          absolute
          bottom-[8.3%]
          left-[2.6%]
          z-10
          whitespace-nowrap
          text-[#3D3D3D]
        "
      >
        <span className="text-[5.2cqw] font-bold">
          {formatPrice(vehicle.pricePerDay)}
        </span>

        <span
          className="
            ml-[0.5cqw]
            text-[4cqw]
            font-medium
            text-[#3D3D3D]/80
          "
        >
          / Day
        </span>
      </p>

      {/* BOOK BUTTON */}
      <button
        type="button"
        disabled={!canBook}
        onClick={() => onBook?.(vehicle)}
        aria-label={`Book ${vehicle.name}`}
        className="
          absolute
          right-[3.2%]
          bottom-[6%]
          z-30
          flex
          h-[16.67%]
          w-[51.6%]
          items-center
          justify-center
          rounded-[10px]
          bg-[#233D4D]
          text-[4.8cqw]
          font-normal
          text-white
          transition-[background-color,transform]
          duration-200
          ease-out
          hover:bg-[#34596F]
          active:scale-[0.98]
          focus-visible:outline-2
          focus-visible:outline-offset-2
          focus-visible:outline-[#F87927]
          disabled:cursor-not-allowed
          disabled:opacity-60
          motion-reduce:transition-none
        "
      >
        BOOK
      </button>
    </article>
  );
}

export default VehicleCard;