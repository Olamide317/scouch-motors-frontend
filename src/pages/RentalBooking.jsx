import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import mockVehicles from "../data/mockVehicles";
import BookingPageHeader from "../components/BookingPageHeader";
import RentalSummary from "../components/RentalSummary";

function getToday() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Find the cheapest combination of daily, weekly,
// and 30-day rates for the required number of days.
function calculateRentalPrice(days, pricing) {
  const rates = [
    { name: "Daily", days: 1, price: pricing.daily },
    { name: "Weekly", days: 7, price: pricing.weekly },
    { name: "Monthly", days: 30, price: pricing.monthly },
  ].filter((rate) => Number.isFinite(rate.price) && rate.price >= 0);

  if (!rates.length || days < 1) return null;

  const results = Array(days + 1).fill(null);

  results[0] = {
    total: 0,
    breakdown: [],
  };

  for (let day = 1; day <= days; day++) {
    for (const rate of rates) {
      if (rate.days > day) continue;

      const previous = results[day - rate.days];

      if (!previous) continue;

      const total = previous.total + rate.price;

      if (!results[day] || total < results[day].total) {
        results[day] = {
          total,
          breakdown: [...previous.breakdown, rate],
        };
      }
    }
  }

  return results[days];
}

function RentalBooking() {
  const { id } = useParams();

  const vehicle = mockVehicles.find((item) => item.id === id);

  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("10:00");

  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("10:00");

  const [pickupMethod, setPickupMethod] = useState("office");
  const [returnMethod, setReturnMethod] = useState("office");

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [collectionAddress, setCollectionAddress] = useState("");

  const [notes, setNotes] = useState("");

  const today = getToday();

  const rental = useMemo(() => {
    if (!vehicle || !pickupDate || !returnDate) {
      return null;
    }

    const start = new Date(`${pickupDate}T${pickupTime}`);

    const end = new Date(`${returnDate}T${returnTime}`);

    const durationMs = end.getTime() - start.getTime();

    if (!Number.isFinite(durationMs) || durationMs <= 0) {
      return {
        error: "Return must be after pickup.",
      };
    }

    const hours = durationMs / (1000 * 60 * 60);
    const days = Math.ceil(hours / 24);

    const pricing = vehicle.pricing ?? {
      daily: vehicle.pricePerDay,
      weekly: null,
      monthly: null,
    };

    const estimate = calculateRentalPrice(days, pricing);

    if (!estimate) {
      return {
        error: "Rental pricing is unavailable.",
      };
    }

    return {
      days,
      hours,
      ...estimate,
    };
  }, [vehicle, pickupDate, pickupTime, returnDate, returnTime]);

  if (!vehicle) {
    return (
      <main className="mx-auto max-w-[1200px] px-6 py-24 text-center">
        <h1 className="text-3xl font-bold text-[#233D4D]">Vehicle not found</h1>

        <Link to="/#vehicles" className="mt-6 inline-block text-[#F87927]">
          Back to Vehicles
        </Link>
      </main>
    );
  }

  const unavailable =
    vehicle.status === "maintenance" ||
    vehicle.status === "inactive" ||
    vehicle.available === false;

  const requiresDeliveryQuote = pickupMethod === "delivery";
  const requiresCollectionQuote = returnMethod === "collection";

  const canPrepareRequest =
    !unavailable &&
    rental &&
    !rental.error &&
    (!requiresDeliveryQuote || deliveryAddress.trim()) &&
    (!requiresCollectionQuote || collectionAddress.trim());

  return (
    <main className="bg-white px-5 py-12 sm:px-8 lg:px-[4.05%] lg:py-20">
      <div className="mx-auto max-w-[1350px]">
        {/* BOOKING PAGE HEADER */}
        <BookingPageHeader vehicle={vehicle} />

        <div className="mt-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]">
          {/* LEFT: RENTAL FORM */}
          <div className="space-y-8">
            {/* RENTAL DATES */}
            <section className="rounded-[22px] border border-[#EAECF0] p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[#233D4D]">
                1. Rental Period
              </h2>

              <p className="mt-2 text-sm text-[#3D3D3D]/65">
                Select the date and time you want to receive and return your
                vehicle.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="pickup-date"
                    className="mb-2 block font-medium text-[#233D4D]"
                  >
                    Pickup Date
                  </label>

                  <input
                    id="pickup-date"
                    type="date"
                    min={today}
                    value={pickupDate}
                    onChange={(e) => {
                      setPickupDate(e.target.value);

                      if (returnDate && returnDate < e.target.value) {
                        setReturnDate("");
                      }
                    }}
                    className="w-full rounded-xl border border-[#EAECF0] p-3 outline-none focus:border-[#F87927]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="pickup-time"
                    className="mb-2 block font-medium text-[#233D4D]"
                  >
                    Pickup Time
                  </label>

                  <input
                    id="pickup-time"
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full rounded-xl border border-[#EAECF0] p-3 outline-none focus:border-[#F87927]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="return-date"
                    className="mb-2 block font-medium text-[#233D4D]"
                  >
                    Return Date
                  </label>

                  <input
                    id="return-date"
                    type="date"
                    min={pickupDate || today}
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full rounded-xl border border-[#EAECF0] p-3 outline-none focus:border-[#F87927]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="return-time"
                    className="mb-2 block font-medium text-[#233D4D]"
                  >
                    Return Time
                  </label>

                  <input
                    id="return-time"
                    type="time"
                    value={returnTime}
                    onChange={(e) => setReturnTime(e.target.value)}
                    className="w-full rounded-xl border border-[#EAECF0] p-3 outline-none focus:border-[#F87927]"
                  />
                </div>
              </div>

              {rental?.error && (
                <p role="alert" className="mt-4 text-sm text-red-600">
                  {rental.error}
                </p>
              )}
            </section>

            {/* PICKUP AND RETURN */}
            <section className="rounded-[22px] border border-[#EAECF0] p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[#233D4D]">
                2. Pickup & Return
              </h2>

              <div className="mt-6">
                <label
                  htmlFor="pickup-method"
                  className="mb-2 block font-medium text-[#233D4D]"
                >
                  Pickup Arrangement
                </label>

                <select
                  id="pickup-method"
                  value={pickupMethod}
                  onChange={(e) => setPickupMethod(e.target.value)}
                  className="w-full rounded-xl border border-[#EAECF0] bg-white p-3 outline-none focus:border-[#F87927]"
                >
                  <option value="office">
                    Collect from Scouch Motors Office
                  </option>
                  <option value="delivery">Request Vehicle Delivery</option>
                </select>

                {pickupMethod === "delivery" && (
                  <div className="mt-4">
                    <label
                      htmlFor="delivery-address"
                      className="mb-2 block text-sm font-medium text-[#233D4D]"
                    >
                      Delivery Address
                    </label>

                    <textarea
                      id="delivery-address"
                      rows={3}
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Enter the requested delivery address"
                      className="w-full resize-y rounded-xl border border-[#EAECF0] p-3 outline-none focus:border-[#F87927]"
                    />

                    <p className="mt-2 text-sm text-[#F87927]">
                      Delivery fee requires an administrator's quote.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <label
                  htmlFor="return-method"
                  className="mb-2 block font-medium text-[#233D4D]"
                >
                  Return Arrangement
                </label>

                <select
                  id="return-method"
                  value={returnMethod}
                  onChange={(e) => setReturnMethod(e.target.value)}
                  className="w-full rounded-xl border border-[#EAECF0] bg-white p-3 outline-none focus:border-[#F87927]"
                >
                  <option value="office">Return to Scouch Motors Office</option>
                  <option value="collection">Request Vehicle Collection</option>
                </select>

                {returnMethod === "collection" && (
                  <div className="mt-4">
                    <label
                      htmlFor="collection-address"
                      className="mb-2 block text-sm font-medium text-[#233D4D]"
                    >
                      Collection Address
                    </label>

                    <textarea
                      id="collection-address"
                      rows={3}
                      value={collectionAddress}
                      onChange={(e) => setCollectionAddress(e.target.value)}
                      placeholder="Enter the requested collection address"
                      className="w-full resize-y rounded-xl border border-[#EAECF0] p-3 outline-none focus:border-[#F87927]"
                    />

                    <p className="mt-2 text-sm text-[#F87927]">
                      Collection fee requires an administrator's quote.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <label
                  htmlFor="rental-notes"
                  className="mb-2 block font-medium text-[#233D4D]"
                >
                  Additional Notes (Optional)
                </label>

                <textarea
                  id="rental-notes"
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special requests or helpful information"
                  className="w-full resize-y rounded-xl border border-[#EAECF0] p-3 outline-none focus:border-[#F87927]"
                />
              </div>
            </section>
          </div>

          {/* RIGHT: RENTAL SUMMARY */}
          <RentalSummary
            vehicle={vehicle}
            rental={rental}
            unavailable={unavailable}
            requiresDeliveryQuote={requiresDeliveryQuote}
            requiresCollectionQuote={requiresCollectionQuote}
            canPrepareRequest={canPrepareRequest}
          />
        </div>
      </div>
    </main>
  );
}

export default RentalBooking;
