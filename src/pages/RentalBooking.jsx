import { useEffect, useMemo, useRef, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import BookingPageHeader from "../components/BookingPageHeader";
import RentalSummary from "../components/RentalSummary";

import { getPublicVehicleById } from "../services/vehicleService";
import { getAccessToken } from "../services/api";

import {
  getRentalAvailability,
  getRentalQuote,
  submitBookingRequest,
} from "../services/bookingService";

function getToday() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getRentalPeriod(
  pickupDate,
  pickupTime,
  returnDate,
  returnTime
) {
  if (!pickupDate || !pickupTime || !returnDate || !returnTime) {
    return { ready: false, error: "" };
  }

  const start = new Date(`${pickupDate}T${pickupTime}`);
  const end = new Date(`${returnDate}T${returnTime}`);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime())
  ) {
    return {
      ready: false,
      error: "Enter valid rental dates and times.",
    };
  }

  if (start <= new Date()) {
    return {
      ready: false,
      error: "Pickup must be in the future.",
    };
  }

  if (end <= start) {
    return {
      ready: false,
      error: "Return must be after pickup.",
    };
  }

  // The backend requires timestamps with explicit timezones.
  return {
    ready: true,
    error: "",
    pickupAt: start.toISOString(),
    returnAt: end.toISOString(),
  };
}

function RentalBooking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const submitLock = useRef(false);

  // Restore the form after the customer signs in.
  const savedDraft =
    location.state?.bookingDraft?.vehicleId === id
      ? location.state.bookingDraft
      : null;

  // VEHICLE STATE
  const [vehicleResult, setVehicleResult] = useState({
    id: null,
    vehicle: null,
    error: "",
  });

  // RENTAL DATE STATES
  const [pickupDate, setPickupDate] = useState(
    savedDraft?.pickupDate ?? ""
  );
  const [pickupTime, setPickupTime] = useState(
    savedDraft?.pickupTime ?? "10:00"
  );
  const [returnDate, setReturnDate] = useState(
    savedDraft?.returnDate ?? ""
  );
  const [returnTime, setReturnTime] = useState(
    savedDraft?.returnTime ?? "10:00"
  );

  // ARRANGEMENT STATES
  const [pickupMethod, setPickupMethod] = useState(
    savedDraft?.pickupMethod ?? "office"
  );
  const [returnMethod, setReturnMethod] = useState(
    savedDraft?.returnMethod ?? "office"
  );

  const [deliveryAddress, setDeliveryAddress] = useState(
    savedDraft?.deliveryAddress ?? ""
  );
  const [collectionAddress, setCollectionAddress] = useState(
    savedDraft?.collectionAddress ?? ""
  );
  const [notes, setNotes] = useState(savedDraft?.notes ?? "");

  // QUOTATION AND SUBMISSION STATES
  const [checking, setChecking] = useState({
    key: null,
    status: "idle",
    rental: null,
    error: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // FETCH REAL VEHICLE FROM MONGODB
  useEffect(() => {
    let active = true;

    getPublicVehicleById(id)
      .then((vehicle) => {
        if (active) {
          setVehicleResult({
            id,
            vehicle,
            error: "",
          });
        }
      })
      .catch((error) => {
        if (active) {
          setVehicleResult({
            id,
            vehicle: null,
            error:
              error.message || "Unable to load vehicle.",
          });
        }
      });

    return () => {
      active = false;
    };
  }, [id]);

  const vehicle =
    vehicleResult.id === id
      ? vehicleResult.vehicle
      : null;

  const vehicleError =
    vehicleResult.id === id
      ? vehicleResult.error
      : "";

  const vehicleLoading = vehicleResult.id !== id;

  const today = getToday();

  // VALIDATE AND CONVERT DATES TO TIMEZONE-AWARE VALUES
  const period = useMemo(
    () =>
      getRentalPeriod(
        pickupDate,
        pickupTime,
        returnDate,
        returnTime
      ),
    [pickupDate, pickupTime, returnDate, returnTime]
  );

  // Used to prevent outdated API results from appearing
  // when the customer changes the selected dates.
  const requestKey =
    vehicle && period.ready
      ? `${vehicle.id}|${period.pickupAt}|${period.returnAt}`
      : null;

  // CHECK AVAILABILITY AND FETCH SERVER-CALCULATED PRICE
  useEffect(() => {
    if (!requestKey) return;

    let active = true;

    const timeoutId = setTimeout(async () => {
      try {
        const input = {
          vehicleId: id,
          pickupAt: period.pickupAt,
          returnAt: period.returnAt,
        };

        const [quote, availability] = await Promise.all([
          getRentalQuote(input),
          getRentalAvailability(input),
        ]);

        if (!active) return;

        if (availability.availability?.available !== true) {
          setChecking({
            key: requestKey,
            status: "unavailable",
            rental: null,
            error: "",
          });
          return;
        }

        const breakdown = quote.pricing?.rateBreakdown;

        if (
          !Number.isSafeInteger(
            quote.rentalPeriod?.rentalDays
          ) ||
          !Number.isSafeInteger(
            quote.pricing?.rentalAmount
          ) ||
          !Array.isArray(breakdown)
        ) {
          throw new Error(
            "Invalid rental quotation response."
          );
        }

        // Transform backend pricing into the structure
        // used by the existing RentalSummary component.
        const rental = {
          days: quote.rentalPeriod.rentalDays,
          total: quote.pricing.rentalAmount,

          breakdown: breakdown.map((item) => ({
            name: item.plan
              ? item.plan[0].toUpperCase() +
                item.plan.slice(1)
              : "Rate",
            days: item.daysCovered,
            price: item.subtotal,
          })),
        };

        setChecking({
          key: requestKey,
          status: "ready",
          rental,
          error: "",
        });
      } catch (error) {
        if (active) {
          setChecking({
            key: requestKey,
            status: "error",
            rental: null,
            error:
              error.message ||
              "Unable to check dates and calculate price.",
          });
        }
      }
    }, 350);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [
    id,
    requestKey,
    period.pickupAt,
    period.returnAt,
  ]);

  // VEHICLE LOADING
  if (vehicleLoading) {
    return (
      <main
        role="status"
        className="mx-auto max-w-[1200px] px-6 py-24 text-center"
      >
        Loading vehicle...
      </main>
    );
  }

  // VEHICLE ERROR
  if (!vehicle) {
    return (
      <main className="mx-auto max-w-[1200px] px-6 py-24 text-center">
        <h1 className="text-3xl font-bold text-[#233D4D]">
          Vehicle unavailable
        </h1>

        <p role="alert" className="mt-4">
          {vehicleError || "Vehicle not found."}
        </p>

        <Link
          to="/vehicles"
          className="mt-6 inline-block text-[#F87927]"
        >
          Back to Vehicles
        </Link>
      </main>
    );
  }

  // CURRENT QUOTATION STATE
  const isChecked = Boolean(
    requestKey && checking.key === requestKey
  );

  const isChecking = Boolean(requestKey && !isChecked);

  const datesUnavailable =
    isChecked && checking.status === "unavailable";

  const checkError =
    isChecked && checking.status === "error"
      ? checking.error
      : "";

  const rental =
    isChecked && checking.status === "ready"
      ? checking.rental
      : null;

  // ONLY OFFICE ARRANGEMENTS ARE SUPPORTED BY THE API
  const unsupportedMethod =
    pickupMethod !== "office" ||
    returnMethod !== "office";

  const unavailable =
    !vehicle.available || datesUnavailable;

  const canPrepareRequest = Boolean(
    rental &&
      !unavailable &&
      !unsupportedMethod &&
      !submitting
  );

  const signedIn = Boolean(getAccessToken());

  // SAVE FORM STATE FOR THE LOGIN REDIRECT
  function createDraft() {
    return {
      vehicleId: vehicle.id,
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
      pickupMethod,
      returnMethod,
      deliveryAddress,
      collectionAddress,
      notes,
    };
  }

  // SUBMIT BOOKING OR REDIRECT TO LOGIN
  async function handleContinue() {
    if (!canPrepareRequest || submitLock.current) {
      return;
    }

    const bookingDraft = createDraft();

    if (!getAccessToken()) {
      navigate("/login", {
        state: { bookingDraft },
      });
      return;
    }

    submitLock.current = true;
    setSubmitting(true);
    setSubmitError("");

    try {
      const response = await submitBookingRequest({
        vehicleId: vehicle.id,
        pickupAt: period.pickupAt,
        returnAt: period.returnAt,
      });

      if (!response.booking?.id) {
        throw new Error(
          "Booking response is missing its ID."
        );
      }

      // Booking has 'requested' status,
      // not a confirmed reservation.
      navigate("/my-bookings", {
        replace: true,
      });
    } catch (error) {
      // If the token expired, preserve the booking draft.
      if (!getAccessToken()) {
        navigate("/login", {
          state: { bookingDraft },
        });
      } else {
        setSubmitError(
          error.message ||
            "Could not submit the booking request."
        );
      }
    } finally {
      submitLock.current = false;
      setSubmitting(false);
    }
  }

  return (
    <main className="bg-white px-5 py-12 sm:px-8 lg:px-[4.05%] lg:py-20">
      <div className="mx-auto max-w-[1350px]">
        {/* PAGE HEADER */}
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
                Select the date and time you want to receive
                and return your vehicle.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* PICKUP DATE */}
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

                      if (
                        returnDate &&
                        returnDate < e.target.value
                      ) {
                        setReturnDate("");
                      }
                    }}
                    className="w-full rounded-xl border border-[#EAECF0] p-3 outline-none focus:border-[#F87927]"
                  />
                </div>

                {/* PICKUP TIME */}
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
                    onChange={(e) =>
                      setPickupTime(e.target.value)
                    }
                    className="w-full rounded-xl border border-[#EAECF0] p-3 outline-none focus:border-[#F87927]"
                  />
                </div>

                {/* RETURN DATE */}
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
                    onChange={(e) =>
                      setReturnDate(e.target.value)
                    }
                    className="w-full rounded-xl border border-[#EAECF0] p-3 outline-none focus:border-[#F87927]"
                  />
                </div>

                {/* RETURN TIME */}
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
                    onChange={(e) =>
                      setReturnTime(e.target.value)
                    }
                    className="w-full rounded-xl border border-[#EAECF0] p-3 outline-none focus:border-[#F87927]"
                  />
                </div>
              </div>

              {/* DATE AND API FEEDBACK */}
              {period.error && (
                <p
                  role="alert"
                  className="mt-4 text-sm text-red-600"
                >
                  {period.error}
                </p>
              )}

              {isChecking && (
                <p
                  role="status"
                  className="mt-4 text-sm text-[#233D4D]"
                >
                  Checking availability and pricing...
                </p>
              )}

              {datesUnavailable && (
                <p
                  role="alert"
                  className="mt-4 text-sm text-red-600"
                >
                  Vehicle unavailable for these dates.
                  Choose another period.
                </p>
              )}

              {checkError && (
                <p
                  role="alert"
                  className="mt-4 text-sm text-red-600"
                >
                  {checkError}
                </p>
              )}
            </section>

            {/* PICKUP AND RETURN */}
            <section className="rounded-[22px] border border-[#EAECF0] p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[#233D4D]">
                2. Pickup & Return
              </h2>

              <p className="mt-2 text-sm text-[#3D3D3D]/65">
                Only office pickup and return are currently
                supported for submitted bookings.
              </p>

              {/* PICKUP ARRANGEMENT */}
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
                  onChange={(e) =>
                    setPickupMethod(e.target.value)
                  }
                  className="w-full rounded-xl border border-[#EAECF0] bg-white p-3 outline-none focus:border-[#F87927]"
                >
                  <option value="office">
                    Collect from Scouch Motors Office
                  </option>
                  <option value="delivery">
                    Request Vehicle Delivery (not yet supported)
                  </option>
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
                      onChange={(e) =>
                        setDeliveryAddress(e.target.value)
                      }
                      placeholder="Enter the requested delivery address"
                      className="w-full resize-y rounded-xl border border-[#EAECF0] p-3 outline-none focus:border-[#F87927]"
                    />

                    <p className="mt-2 text-sm text-[#F87927]">
                      Delivery booking is not enabled yet.
                    </p>
                  </div>
                )}
              </div>

              {/* RETURN ARRANGEMENT */}
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
                  onChange={(e) =>
                    setReturnMethod(e.target.value)
                  }
                  className="w-full rounded-xl border border-[#EAECF0] bg-white p-3 outline-none focus:border-[#F87927]"
                >
                  <option value="office">
                    Return to Scouch Motors Office
                  </option>
                  <option value="collection">
                    Request Vehicle Collection (not yet supported)
                  </option>
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
                      onChange={(e) =>
                        setCollectionAddress(e.target.value)
                      }
                      placeholder="Enter the requested collection address"
                      className="w-full resize-y rounded-xl border border-[#EAECF0] p-3 outline-none focus:border-[#F87927]"
                    />

                    <p className="mt-2 text-sm text-[#F87927]">
                      Collection booking is not enabled yet.
                    </p>
                  </div>
                )}
              </div>

              {/* UNSUPPORTED ARRANGEMENTS */}
              {unsupportedMethod && (
                <p
                  role="alert"
                  className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800"
                >
                  Select office pickup and office return
                  to submit a request. Delivery and
                  collection are not available yet.
                </p>
              )}

              {/* ADDITIONAL NOTES */}
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
                  onChange={(e) =>
                    setNotes(e.target.value)
                  }
                  placeholder="Any special requests or helpful information"
                  className="w-full resize-y rounded-xl border border-[#EAECF0] p-3 outline-none focus:border-[#F87927]"
                />

                <p className="mt-2 text-xs text-[#3D3D3D]/60">
                  Notes are kept on this form only and
                  are not submitted to the backend yet.
                </p>
              </div>
            </section>
          </div>

          {/* RIGHT: BOOKING SUMMARY */}
          <div>
            <RentalSummary
              vehicle={vehicle}
              rental={rental}
              unavailable={unavailable}
              requiresDeliveryQuote={
                pickupMethod === "delivery"
              }
              requiresCollectionQuote={
                returnMethod === "collection"
              }
              canPrepareRequest={canPrepareRequest}
              onContinue={handleContinue}
              actionLabel={
                submitting
                  ? "Submitting Request..."
                  : signedIn
                    ? "Submit Booking Request"
                    : "Sign In to Continue"
              }
              actionHelp={
                signedIn
                  ? "Submitting creates a rental request, not a confirmed reservation."
                  : "Sign in to review and submit this rental request."
              }
            />

            {submitError && (
              <p
                role="alert"
                className="mt-4 text-sm text-red-600"
              >
                {submitError}
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default RentalBooking;