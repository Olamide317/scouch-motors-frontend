import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { apiRequest, clearAccessToken } from "../services/api";

function MyBookings() {
  const navigate = useNavigate();

  const [startingPaymentId, setStartingPaymentId] = useState(null);
  const [paymentError, setPaymentError] = useState({});
  const [bookings, setBookings] = useState([]);
  const [testPayments, setTestPayments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Retrieve real bookings and their Paystack test payments.
  useEffect(() => {
    let active = true;

    async function loadBookings() {
      try {
        const [bookingResult, paymentResult] = await Promise.all([
          apiRequest("/api/bookings/my", {
            authenticated: true,
          }),

          apiRequest("/api/payments/test/my", {
            authenticated: true,
          }),
        ]);

        // Map payment records to their corresponding bookings.
        const paymentMap = {};

        for (const payment of paymentResult.payments ?? []) {
          const bookingId = payment.bookingId;

          if (!bookingId) continue;

          // The backend returns newest payments first.
          // Always prioritize a successful test payment.
          if (
            !paymentMap[bookingId] ||
            (paymentMap[bookingId].status !== "success" &&
              payment.status === "success")
          ) {
            paymentMap[bookingId] = payment;
          }
        }

        if (active) {
          setBookings(bookingResult.bookings ?? []);
          setTestPayments(paymentMap);
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Unable to load bookings.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadBookings();

    return () => {
      active = false;
    };
  }, []);

  // Sign out the current customer.
  function logout() {
    clearAccessToken();
    navigate("/login", { replace: true });
  }

  // Initialize Paystack Test Mode checkout.
  async function handlePaystackCheckout(bookingId) {
    if (startingPaymentId) return;

    // Prevent another payment when the test transaction
    // has already succeeded.
    if (testPayments[bookingId]?.status === "success") {
      return;
    }

    setStartingPaymentId(bookingId);

    setPaymentError((previous) => ({
      ...previous,
      [bookingId]: "",
    }));

    try {
      const result = await apiRequest(
        `/api/payments/test/bookings/${bookingId}/initialize`,
        {
          method: "POST",
          authenticated: true,
        }
      );

      const checkoutUrl = new URL(
        result.payment?.authorizationUrl
      );

      // Only allow redirection to Paystack's
      // official hosted checkout.
      if (
        checkoutUrl.protocol !== "https:" ||
        checkoutUrl.hostname !== "checkout.paystack.com"
      ) {
        throw new Error("Invalid Paystack checkout URL.");
      }

      window.location.assign(checkoutUrl.href);
    } catch (error) {
      setPaymentError((previous) => ({
        ...previous,
        [bookingId]:
          error.message || "Unable to start checkout.",
      }));
    } finally {
      setStartingPaymentId(null);
    }
  }

  return (
    <main className="min-h-[60vh] bg-white px-5 py-12 sm:px-8 lg:px-[4.05%]">
      <div className="mx-auto max-w-[1100px]">
        {/* PAGE HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#233D4D]">
              My Bookings
            </h1>

            <p className="mt-2 text-[#3D3D3D]/65">
              View and manage your rental requests.
            </p>
          </div>

          <button
            type="button"
            onClick={logout}
            className="rounded-xl border border-[#233D4D] px-5 py-3 font-semibold text-[#233D4D]"
          >
            Sign Out
          </button>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <p role="status" className="mt-10">
            Loading bookings...
          </p>
        )}

        {/* ERROR STATE */}
        {error && (
          <div
            role="alert"
            className="mt-8 rounded-xl bg-red-50 p-5 text-red-700"
          >
            {error}{" "}
            <Link to="/login" className="underline">
              Sign in again
            </Link>
          </div>
        )}

        {/* EMPTY BOOKINGS STATE */}
        {!loading && !error && bookings.length === 0 && (
          <div className="mt-10 rounded-2xl bg-[#EAECF0] p-8">
            <p>No bookings found.</p>

            <Link
              to="/vehicles"
              className="mt-4 inline-block font-semibold text-[#F87927]"
            >
              Browse Vehicles
            </Link>
          </div>
        )}

        {/* BOOKING LIST */}
        {!loading && !error && bookings.length > 0 && (
          <div className="mt-10 space-y-5">
            {bookings.map((booking) => {
              const bookingId = booking._id;

              // Find the test payment associated with this booking.
              const testPayment = testPayments[bookingId];

              const hasSuccessfulTestPayment =
                testPayment?.status === "success";

              const canStartTestPayment =
                [
                  "requested",
                  "provisionally_approved",
                  "awaiting_payment",
                ].includes(booking.status) &&
                ["unpaid", "failed"].includes(
                  booking.paymentStatus
                ) &&
                !hasSuccessfulTestPayment;

              return (
                <article
                  key={bookingId}
                  className="rounded-2xl border border-[#EAECF0] p-6"
                >
                  {/* VEHICLE INFORMATION */}
                  <h2 className="text-xl font-bold text-[#233D4D]">
                    {booking.vehicle?.brand ?? "Vehicle"}{" "}
                    {booking.vehicle?.model ?? ""}
                  </h2>

                  <p className="mt-2 break-all text-sm text-[#3D3D3D]/65">
                    Booking ID: {bookingId}
                  </p>

                  {/* BOOKING STATUS */}
                  <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
                    <p>
                      <strong>Booking:</strong>{" "}
                      {booking.status}
                    </p>

                    <p>
                      <strong>Verification:</strong>{" "}
                      {booking.verificationStatus}
                    </p>

                    <p>
                      <strong>Real Payment:</strong>{" "}
                      {booking.paymentStatus}
                    </p>
                  </div>

                  {/* RENTAL PRICE */}
                  <p className="mt-5 text-lg font-bold text-[#233D4D]">
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: "NGN",
                    }).format(
                      booking.pricing?.totalAmount ?? 0
                    )}
                  </p>

                  {/* PAYSTACK TEST PAYMENT STATUS */}
                  <div className="mt-5 rounded-xl bg-[#F7F8FA] p-4">
                    <p className="text-sm font-semibold text-[#233D4D]">
                      Paystack Test Payment
                    </p>

                    {hasSuccessfulTestPayment ? (
                      <div className="mt-2 flex items-center gap-2">
                        <span
                          aria-hidden="true"
                          className="text-lg font-bold text-green-600"
                        >
                          ✓
                        </span>

                        <span className="text-sm font-semibold text-green-700">
                          Successful (Test Mode)
                        </span>
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-[#3D3D3D]/70">
                        {testPayment?.status ?? "Not started"}
                      </p>
                    )}

                    {hasSuccessfulTestPayment &&
                      testPayment.verifiedAt && (
                        <p className="mt-2 text-xs text-[#3D3D3D]/60">
                          Verified:{" "}
                          {new Date(
                            testPayment.verifiedAt
                          ).toLocaleString("en-NG")}
                        </p>
                      )}

                    <p className="mt-2 text-xs text-[#3D3D3D]/60">
                      Test transactions do not confirm
                      real payments or vehicle reservations.
                    </p>
                  </div>

                  {/* PAYSTACK TEST CHECKOUT */}
                  {canStartTestPayment && (
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={() =>
                          handlePaystackCheckout(bookingId)
                        }
                        disabled={Boolean(startingPaymentId)}
                        className="rounded-xl bg-[#233D4D] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#34596F] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {startingPaymentId === bookingId
                          ? "Opening Paystack..."
                          : "Pay with Paystack (Test Mode)"}
                      </button>

                      <p className="mt-2 text-xs text-[#3D3D3D]/60">
                        Demonstration only. No real payment
                        or vehicle reservation will be confirmed.
                      </p>

                      {paymentError[bookingId] && (
                        <p
                          role="alert"
                          className="mt-3 text-sm text-red-600"
                        >
                          {paymentError[bookingId]}
                        </p>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default MyBookings;