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
  onContinue,
  actionLabel = "Continue",
  actionHelp = "Review the rental request before submission.",
}) {
  const dailyRate =
    vehicle.pricing?.daily ?? vehicle.pricePerDay;

  const hasEstimate = Boolean(
    rental && !rental.error && !unavailable
  );

  return (
    <aside className="rounded-[22px] border border-[#EAECF0] bg-white p-5 shadow-[0_8px_32px_rgba(35,61,77,0.05)] sm:p-7 lg:sticky lg:top-8">
      <h2 className="text-xl font-bold text-[#233D4D]">
        Booking Summary
      </h2>

      <p className="mt-1 text-sm text-[#3D3D3D]/60">
        Review your selected vehicle and rental quotation.
      </p>

      {/* VEHICLE PREVIEW */}
      <div className="mt-6 rounded-2xl bg-[#FAFAFA] p-4">
        <div className="mt-1 flex h-[160px] items-center justify-center">
          {vehicle.image ? (
            <img
              src={vehicle.image}
              alt={vehicle.name}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-xl bg-[#EAECF0] text-sm text-[#233D4D]/70">
              Image coming soon
            </div>
          )}
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

      {/* DAILY RATE */}
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

      {/* RENTAL QUOTATION */}
      {unavailable ? (
        <p
          role="status"
          className="rounded-xl bg-red-50 p-4 text-sm text-red-700"
        >
          This vehicle is unavailable for the selected
          rental period.
        </p>
      ) : !hasEstimate ? (
        <div className="rounded-xl bg-[#F5F7F8] p-5">
          <p className="font-medium text-[#233D4D]">
            Your quotation will appear here
          </p>

          <p className="mt-2 text-sm leading-6 text-[#3D3D3D]/65">
            Select valid pickup and return dates to
            check availability and see the
            server-calculated rental cost.
          </p>
        </div>
      ) : (
        <div>
          {/* RENTAL DURATION */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-[#3D3D3D]/70">
              Rental Duration
            </span>

            <span className="font-semibold text-[#233D4D]">
              {rental.days}{" "}
              {rental.days === 1 ? "Day" : "Days"}
            </span>
          </div>

          {/* RATE BREAKDOWN */}
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
                  {rate.days === 1 ? "day" : "days"} covered)
                </span>

                <span className="shrink-0 font-semibold text-[#233D4D]">
                  {formatPrice(rate.price)}
                </span>
              </div>
            ))}
          </div>

          <div className="my-6 h-px bg-[#EAECF0]" />

          {/* QUOTED SUBTOTAL */}
          <div className="rounded-2xl bg-[#C2E8FF]/30 p-5">
            <p className="text-sm font-medium text-[#233D4D]/75">
              Quoted Rental Subtotal
            </p>

            <p className="mt-2 text-3xl font-bold text-[#233D4D]">
              {formatPrice(rental.total)}
            </p>

            <p className="mt-2 text-xs leading-5 text-[#233D4D]/70">
              Excludes additional charges not supported
              by the current booking API.
            </p>
          </div>
        </div>
      )}

      {/* UNSUPPORTED SERVICES */}
      {(requiresDeliveryQuote || requiresCollectionQuote) && (
        <p className="mt-4 text-sm leading-6 text-[#F87927]">
          Delivery and collection bookings are not
          available yet. Choose office arrangements
          to continue.
        </p>
      )}

      {/* SUBMISSION */}
      <div className="mt-7">
        <button
          type="button"
          disabled={!canPrepareRequest}
          onClick={onContinue}
          className="flex min-h-[54px] w-full items-center justify-center gap-2 rounded-xl bg-[#233D4D] px-5 font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-[#34596F] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {actionLabel}
          <span aria-hidden="true">→</span>
        </button>

        <p className="mt-3 text-center text-xs leading-5 text-[#3D3D3D]/60">
          {canPrepareRequest
            ? actionHelp
            : "Select available dates and office pickup/return to continue."}
        </p>
      </div>

      {/* DISCLAIMER */}
      <div className="mt-6 border-t border-[#EAECF0] pt-5">
        <p className="text-xs leading-6 text-[#3D3D3D]/60">
          The quotation is calculated by the backend.
          Availability is rechecked when you submit.
          A requested booking is not a confirmed
          reservation or payment.
        </p>
      </div>
    </aside>
  );
}

export default RentalSummary;