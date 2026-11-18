import { useEffect, useState } from "react";
import { CalendarDays, RefreshCw } from "lucide-react";

import { apiRequest } from "../../services/api";

const PER_PAGE = 10;

const bookingStatuses = [
  "requested",
  "provisionally_approved",
  "awaiting_payment",
  "confirmed",
  "in_progress",
  "completed",
  "rejected",
  "cancelled",
  "expired",
];

function statusLabel(value) {
  if (!value) return "Unknown";
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value) {
  if (!value) return "Unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unavailable";
  return date.toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatNaira(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "Unavailable";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

const badgeClasses = {
  requested: "bg-amber-50 text-amber-800",
  provisionally_approved: "bg-blue-50 text-blue-800",
  rejected: "bg-red-50 text-red-700",
  completed: "bg-emerald-50 text-emerald-800",
  cancelled: "bg-[#EAECF0] text-[#233D4D]",
};

function AdminBookings() {
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(0);
  const [busyId, setBusyId] = useState(null);
  const [reasons, setReasons] = useState({});
  const [feedback, setFeedback] = useState({ message: "", error: false });
  const [snapshot, setSnapshot] = useState({
    key: null,
    bookings: [],
    total: 0,
    totalPages: 0,
    error: "",
  });

  const requestKey = `${status}|${page}|${refresh}`;
  const loading = snapshot.key !== requestKey;

  useEffect(() => {
    let active = true;

    async function loadBookings() {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(PER_PAGE),
      });
      if (status !== "all") params.set("status", status);

      try {
        const result = await apiRequest(
          `/api/admin/bookings?${params.toString()}`,
          { authenticated: true }
        );

        if (!active) return;
        if (!Array.isArray(result?.bookings) || !result?.pagination) {
          throw new Error("Unexpected booking response from the server.");
        }

        const totalPages = Number(result.pagination.totalPages) || 0;
        if (page > 1 && page > totalPages) {
          setPage(Math.max(1, totalPages));
          return;
        }

        setSnapshot({
          key: requestKey,
          bookings: result.bookings,
          total: Number(result.pagination.total) || 0,
          totalPages,
          error: "",
        });
      } catch (error) {
        if (!active) return;
        setSnapshot({
          key: requestKey,
          bookings: [],
          total: 0,
          totalPages: 0,
          error: error.message || "Unable to retrieve bookings.",
        });
      }
    }

    loadBookings();
    return () => {
      active = false;
    };
  }, [page, status, refresh, requestKey]);

  async function reviewBooking(booking, decision) {
    if (busyId || booking.status !== "requested") return;

    const id = booking._id;
    const reason = (reasons[id] ?? "").trim();

    if (decision === "reject" && (reason.length < 1 || reason.length > 500)) {
      setFeedback({
        message: "Enter a rejection reason between 1 and 500 characters.",
        error: true,
      });
      return;
    }

    if (
      decision === "approve" &&
      !window.confirm(
        "Provisionally approve this request? This does not confirm a reservation or any payment."
      )
    ) {
      return;
    }

    setBusyId(id);
    setFeedback({ message: "", error: false });

    try {
      const result = await apiRequest(
        `/api/admin/bookings/${encodeURIComponent(id)}/${decision}`,
        {
          method: "PATCH",
          authenticated: true,
          ...(decision === "reject" ? { body: { reason } } : {}),
        }
      );

      const expected = decision === "approve" ? "provisionally_approved" : "rejected";
      if (result?.success !== true || result?.booking?.status !== expected) {
        throw new Error("Unexpected booking review response.");
      }

      setFeedback({
        message:
          decision === "approve"
            ? "Request provisionally approved. The rental is not confirmed."
            : "Booking request rejected. The reason has been recorded.",
        error: false,
      });
      setReasons((current) => ({ ...current, [id]: "" }));
      setRefresh((current) => current + 1);
    } catch (error) {
      setFeedback({
        message: error.message || "Unable to review booking.",
        error: true,
      });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#233D4D]">Booking Management</h1>
          <p className="mt-2 text-sm text-[#3D3D3D]/70">
            Review rental requests, customer details and booking statuses.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setRefresh((value) => value + 1)}
          disabled={loading || Boolean(busyId)}
          className="inline-flex items-center gap-2 rounded-xl border border-[#EAECF0] bg-white px-4 py-3 text-sm font-semibold text-[#233D4D] hover:bg-[#EAECF0] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw size={17} /> Refresh
        </button>
      </div>

      <div className="rounded-2xl border border-[#C2E8FF] bg-[#C2E8FF]/30 p-4 text-sm leading-6 text-[#233D4D]">
        <strong>Demo workflow:</strong> Admin approval is provisional. It does not
        confirm a real vehicle reservation, identity verification or payment.
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-[#EAECF0] bg-white p-5">
        <div>
          <label htmlFor="admin-booking-status" className="block text-sm font-semibold text-[#233D4D]">
            Booking status
          </label>
          <select
            id="admin-booking-status"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
              setFeedback({ message: "", error: false });
            }}
            className="mt-2 min-h-11 rounded-lg border border-[#CBD5DF] bg-white px-3 text-sm text-[#233D4D]"
          >
            <option value="all">All statuses</option>
            {bookingStatuses.map((value) => (
              <option value={value} key={value}>{statusLabel(value)}</option>
            ))}
          </select>
        </div>
        <p className="text-sm text-[#3D3D3D]/70" aria-live="polite">
          {loading ? "Loading..." : `${snapshot.total} ${snapshot.total === 1 ? "booking" : "bookings"}`}
        </p>
      </div>

      {feedback.message && (
        <p
          role={feedback.error ? "alert" : "status"}
          className={`rounded-xl p-4 text-sm ${feedback.error ? "bg-red-50 text-red-700" : "border border-[#EAECF0] bg-white text-[#233D4D]"}`}
        >
          {feedback.message}
        </p>
      )}

      {loading ? (
        <div role="status" className="rounded-xl bg-white p-6 text-[#233D4D]">Loading bookings...</div>
      ) : snapshot.error ? (
        <div role="alert" className="rounded-xl bg-red-50 p-6 text-sm text-red-700">{snapshot.error}</div>
      ) : snapshot.bookings.length === 0 ? (
        <div className="rounded-xl border border-[#EAECF0] bg-white p-8 text-center text-sm text-[#3D3D3D]/70">
          No bookings match this status.
        </div>
      ) : (
        <div className="space-y-4">
          {snapshot.bookings.map((booking) => {
            const id = booking._id;
            const customerName = [booking.customer?.firstName, booking.customer?.lastName]
              .filter(Boolean).join(" ") || "Customer unavailable";
            const vehicleName = [booking.vehicle?.year, booking.vehicle?.brand, booking.vehicle?.model]
              .filter(Boolean).join(" ") || "Vehicle unavailable";
            const pending = busyId === id;
            const canReview = booking.status === "requested";

            return (
              <article key={id} className="rounded-2xl border border-[#EAECF0] bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-[#233D4D]">{vehicleName}</h2>
                    <p className="mt-1 text-xs text-[#3D3D3D]/60 break-all">Booking ID: {id}</p>
                    <p className="mt-1 text-xs text-[#3D3D3D]/60">Submitted {formatDate(booking.createdAt)}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClasses[booking.status] || "bg-[#EAECF0] text-[#233D4D]"}`}>
                    {statusLabel(booking.status)}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2 xl:grid-cols-3">
                  <div>
                    <p className="font-semibold text-[#233D4D]">Customer</p>
                    <p className="mt-1 text-[#3D3D3D]">{customerName}</p>
                    {booking.customer?.email && <p className="break-all text-[#3D3D3D]/70">{booking.customer.email}</p>}
                    {booking.customer?.phone && <p className="text-[#3D3D3D]/70">{booking.customer.phone}</p>}
                  </div>
                  <div>
                    <p className="flex items-center gap-2 font-semibold text-[#233D4D]"><CalendarDays size={16} /> Rental period</p>
                    <p className="mt-1 text-[#3D3D3D]">Pickup: {formatDate(booking.rentalPeriod?.pickupAt)}</p>
                    <p className="text-[#3D3D3D]">Return: {formatDate(booking.rentalPeriod?.returnAt)}</p>
                    <p className="mt-1 text-[#3D3D3D]/70">{booking.pricing?.rentalDays ?? "—"} rental day(s)</p>
                  </div>
                  <div>
                    <p className="font-semibold text-[#233D4D]">Quoted rental total</p>
                    <p className="mt-1 text-lg font-bold text-[#233D4D]">{formatNaira(booking.pricing?.totalAmount)}</p>
                    <p className="mt-1 text-[#3D3D3D]/70">Verification: {statusLabel(booking.verificationStatus)}</p>
                    <p className="text-[#3D3D3D]/70">Payment record: {statusLabel(booking.paymentStatus)}</p>
                  </div>
                </div>

                {booking.status === "rejected" && booking.rejectionReason && (
                  <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                    <strong>Rejection reason:</strong> {booking.rejectionReason}
                  </p>
                )}

                {canReview && (
                  <div className="mt-5 border-t border-[#EAECF0] pt-5">
                    <h3 className="text-sm font-semibold text-[#233D4D]">Review this request</h3>
                    <p className="mt-1 text-xs leading-5 text-[#3D3D3D]/65">
                      Approve provisionally or provide a reason to reject. A decision cannot be reversed from this screen.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        disabled={Boolean(busyId)}
                        onClick={() => reviewBooking(booking, "approve")}
                        className="min-h-11 rounded-xl bg-[#233D4D] px-5 py-2 text-sm font-semibold text-white hover:bg-[#34596F] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {pending ? "Processing..." : "Approve Provisionally"}
                      </button>
                    </div>
                    <label htmlFor={`reject-reason-${id}`} className="mt-4 block text-sm font-semibold text-[#233D4D]">
                      Rejection reason (required to reject)
                    </label>
                    <textarea
                      id={`reject-reason-${id}`}
                      rows={2}
                      maxLength={500}
                      value={reasons[id] ?? ""}
                      disabled={Boolean(busyId)}
                      onChange={(event) => setReasons((current) => ({ ...current, [id]: event.target.value }))}
                      placeholder="Explain why this request cannot be approved..."
                      className="mt-2 block w-full rounded-xl border border-[#CBD5DF] px-4 py-3 text-sm text-[#233D4D] outline-none focus:border-[#F87927]"
                    />
                    <button
                      type="button"
                      disabled={Boolean(busyId) || !(reasons[id] ?? "").trim()}
                      onClick={() => reviewBooking(booking, "reject")}
                      className="mt-3 min-h-11 rounded-xl border border-red-200 bg-white px-5 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {pending ? "Processing..." : "Reject Request"}
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {!loading && !snapshot.error && snapshot.totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#EAECF0] bg-white p-4">
          <p className="text-sm text-[#233D4D]">
            Page {page} of {snapshot.totalPages}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1 || Boolean(busyId)}
              onClick={() => setPage((value) => value - 1)}
              className="rounded-lg border border-[#EAECF0] px-4 py-2 text-sm font-semibold text-[#233D4D] disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= snapshot.totalPages || Boolean(busyId)}
              onClick={() => setPage((value) => value + 1)}
              className="rounded-lg border border-[#EAECF0] px-4 py-2 text-sm font-semibold text-[#233D4D] disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminBookings;
