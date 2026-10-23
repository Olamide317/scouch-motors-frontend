const formatPrice = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

function RentalSummary({
  vehicle,
  rental,
  unavailable,
  requiresDeliveryQuote,
  requiresCollectionQuote,
  canPrepareRequest,
}) {
  const dailyRate =
    vehicle.pricing?.daily ?? vehicle.pricePerDay;

  const hasEstimate =
    rental && !rental.error && !unavailable;

  return (
    <aside
      className="
        rounded-[22px]
        border border-[#EAECF0]
        bg-white
        p-5
        shadow-[0_8px_32px_rgba(35,61,77,0.05)]
        sm:p-7
        lg:sticky lg:top-8
      "
    >
      <h2 className="text-xl font-bold text-[#233D4D]">
        Booking Summary
      </h2>

      <p className="mt-1 text-sm text-[#3D3D3D]/60">
        Review your selected vehicle and rental estimate.
      </p>

      {/* VEHICLE PREVIEW */}
      <div className="mt-6 rounded-2xl bg-[#FAFAFA] p-4">
        <div className="flex h-[160px] items-center justify-center">
          <img
            src={vehicle.image}
            alt={vehicle.name}
            className="h-full w-full object-contain"
          />
        </div>

        <h3 className="mt-3 text-lg font-bold text-[#233D4D]">
          {vehicle.name}
        </h3>

        <p className="mt-1 text-sm text-[#3D3D3D]/65">
          {[
            vehicle.category,
            vehicle.transmission,
            vehicle.seats != null
              ? `${vehicle.seats} Seats`
              : null,
          ]
            .filter(Boolean)
            .join(" • ")}
        </p>
      </div>

      {/* BASE RATE */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <span className="text-sm text-[#3D3D3D]/70">
          Daily Rental Rate
        </span>

        <span className="text-base font-bold text-[#233D4D]">
          {dailyRate != null
            ? formatPrice(dailyRate)
            : "On request"}
        </span>
      </div>

      <div className="my-6 h-px bg-[#EAECF0]" />

      {/* RENTAL ESTIMATE */}
      {unavailable ? (
        <p
          role="status"
          className="rounded-xl bg-red-50 p-4 text-sm text-red-700"
        >
          This vehicle is currently unavailable for new
          rental requests.
        </p>
      ) : !hasEstimate ? (
        <div className="rounded-xl bg-[#F5F7F8] p-5">
          <p className="font-medium text-[#233D4D]">
            Your estimate will appear here
          </p>

          <p className="mt-2 text-sm leading-6 text-[#3D3D3D]/65">
            Select your pickup and return dates to see the
            estimated rental cost.
          </p>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-[#3D3D3D]/70">
              Rental Duration
            </span>

            <span className="font-semibold text-[#233D4D]">
              {rental.days}{" "}
              {rental.days === 1 ? "Day" : "Days"}
            </span>
          </div>

          <h3 className="mt-6 text-sm font-bold uppercase tracking-wide text-[#233D4D]">
            Rate Breakdown
          </h3>

          <div className="mt-4 space-y-3">
            {rental.breakdown.map((rate, index) => (
              <div
                key={`${rate.name}-${index}`}
                className="flex items-start justify-between gap-3 text-sm"
              >
                <span className="text-[#3D3D3D]/70">
                  {rate.name} ({rate.days}{" "}
                  {rate.days === 1 ? "day" : "days"})
                </span>

                <span className="shrink-0 font-semibold text-[#233D4D]">
                  {formatPrice(rate.price)}
                </span>
              </div>
            ))}
          </div>

          <div className="my-6 h-px bg-[#EAECF0]" />

          {/* ESTIMATED TOTAL */}
          <div className="rounded-2xl bg-[#C2E8FF]/30 p-5">
            <p className="text-sm font-medium text-[#233D4D]/75">
              Estimated Rental Subtotal
            </p>

            <p className="mt-2 text-3xl font-bold text-[#233D4D]">
              {formatPrice(rental.total)}
            </p>

            <p className="mt-2 text-xs leading-5 text-[#233D4D]/70">
              Excludes any additional charges requiring
              confirmation.
            </p>
          </div>

          {(requiresDeliveryQuote ||
            requiresCollectionQuote) && (
            <p className="mt-4 text-sm leading-6 text-[#F87927]">
              Delivery or collection charges require a
              separate quotation and are not included above.
            </p>
          )}
        </div>
      )}

      {/* NEXT STEP */}
      <div className="mt-7">
        <button
          type="button"
          disabled
          className="
            flex min-h-[54px] w-full items-center
            justify-center gap-2 rounded-xl
            bg-[#233D4D] px-5
            font-semibold text-white opacity-60
            disabled:cursor-not-allowed
          "
        >
          Continue to Account Setup
          <span aria-hidden="true">→</span>
        </button>

        <p className="mt-3 text-center text-xs leading-5 text-[#3D3D3D]/60">
          {canPrepareRequest
            ? "Your details are ready for review. Account setup is the next frontend step."
            : "Complete your rental details before proceeding. Account setup is not yet connected."}
        </p>
      </div>

      {/* DISCLAIMER */}
      <div className="mt-6 border-t border-[#EAECF0] pt-5">
        <p className="text-xs leading-6 text-[#3D3D3D]/60">
          Demonstration estimate only. Final prices,
          availability, and rental arrangements require
          confirmation. No vehicle has been reserved.
        </p>
      </div>
    </aside>
  );
}

export default RentalSummary;