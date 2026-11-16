import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { apiRequest } from "../services/api";

function PaymentResult() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function verifyPayment() {
      if (
        !reference ||
        !/^[A-Za-z0-9.=-]{1,100}$/.test(reference)
      ) {
        setError("Missing or invalid payment reference.");
        setLoading(false);
        return;
      }

      try {
        const result = await apiRequest(
          `/api/payments/test/${encodeURIComponent(reference)}/verify`,
          { authenticated: true }
        );

        if (active) {
          setPayment(result.payment);
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Verification failed.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    verifyPayment();

    return () => {
      active = false;
    };
  }, [reference]);

  const success = payment?.status === "success";

  return (
    <main className="min-h-[65vh] bg-white px-5 py-16">
      <section className="mx-auto max-w-[600px] rounded-2xl border border-[#EAECF0] p-8 text-center shadow-sm">
        <h1 className="text-3xl font-bold text-[#233D4D]">
          Paystack Test Payment
        </h1>

        {loading && (
          <p role="status" className="mt-6">
            Verifying transaction with Paystack...
          </p>
        )}

        {error && (
          <p role="alert" className="mt-6 text-red-600">
            {error}
          </p>
        )}

        {payment && (
          <div className="mt-6 space-y-4">
            <p className="text-xl font-semibold text-[#233D4D]">
              {success
                ? "Test transaction verified successfully"
                : `Transaction status: ${payment.status}`}
            </p>

            <p className="break-all text-sm text-[#3D3D3D]/70">
              Reference: {payment.reference}
            </p>

            <p className="text-lg font-bold text-[#233D4D]">
              {new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
              }).format(payment.amountKobo / 100)}
            </p>

            <p className="rounded-xl bg-[#EAECF0] p-4 text-sm text-[#233D4D]">
              This transaction was processed in Paystack
              Test Mode. It does not confirm a real
              booking or authorize a vehicle rental.
            </p>
          </div>
        )}

        <Link
          to="/my-bookings"
          className="mt-8 inline-flex rounded-xl bg-[#233D4D] px-6 py-3 font-semibold text-white"
        >
          Back to My Bookings
        </Link>
      </section>
    </main>
  );
}

export default PaymentResult;