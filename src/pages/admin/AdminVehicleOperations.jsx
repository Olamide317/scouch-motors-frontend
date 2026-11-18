import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarClock,
  ImagePlus,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";

import { apiRequest, uploadMultipart } from "../../services/api";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const initialBlock = {
  reason: "maintenance",
  startAt: "",
  endAt: "",
  notes: "",
};

const inputClass =
  "mt-2 block min-h-11 w-full rounded-xl border border-[#CBD5DF] bg-white px-3 py-2 text-sm text-[#233D4D] outline-none focus:border-[#F87927]";

function formatWAT(value) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return "Unknown date";
  return new Intl.DateTimeFormat("en-NG", {
    timeZone: "Africa/Lagos",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

// Interpret datetime-local inputs as Nigerian civil time (UTC+01:00),
// rather than silently applying the administrator's device timezone.
function parseWAT(value) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
    return null;
  }

  const date = new Date(`${value}:00+01:00`);

  return Number.isNaN(date.getTime()) ? null : date;
}

function AdminVehicleOperations() {
  const { id } = useParams();
  const fileRef = useRef(null);
  const [reloadId, setReloadId] = useState(0);
  const [snapshot, setSnapshot] = useState({
    key: null,
    vehicle: null,
    blocks: [],
    error: "",
  });
  const [file, setFile] = useState(null);
  const [blockForm, setBlockForm] = useState(initialBlock);
  const [busy, setBusy] = useState("");
  const [feedback, setFeedback] = useState({ text: "", error: false });

  const key = `${id}:${reloadId}`;
  const loading = snapshot.key !== key;

  useEffect(() => {
    let active = true;

    async function loadOperations() {
      try {
        const [inventoryResult, blockResult] = await Promise.all([
          apiRequest("/api/admin/vehicles", { authenticated: true }),
          apiRequest(
            `/api/admin/vehicles/${encodeURIComponent(id)}/availability-blocks`,
            { authenticated: true },
          ),
        ]);

        if (!active) return;
        if (
          inventoryResult?.success !== true ||
          !Array.isArray(inventoryResult.vehicles) ||
          blockResult?.success !== true ||
          !Array.isArray(blockResult.blocks)
        ) {
          throw new Error("Unexpected vehicle management response.");
        }

        const vehicle = inventoryResult.vehicles.find(
          (item) => item._id === id,
        );
        if (!vehicle) {
          throw new Error("Vehicle was not found in administrator inventory.");
        }

        setSnapshot({
          key,
          vehicle,
          blocks: blockResult.blocks,
          error: "",
        });
      } catch (error) {
        if (!active) return;
        setSnapshot({
          key,
          vehicle: null,
          blocks: [],
          error: error.message || "Unable to load vehicle management.",
        });
      }
    }

    loadOperations();
    return () => {
      active = false;
    };
  }, [id, reloadId, key]);

  function refresh() {
    if (busy || loading) return;
    setFeedback({ text: "", error: false });
    setReloadId((value) => value + 1);
  }

  async function handleImageUpload(event) {
    event.preventDefault();
    if (!file || busy || loading) return;

    if (!ALLOWED_IMAGE_TYPES.has(file.type) || file.size > MAX_IMAGE_BYTES) {
      setFeedback({
        text: "Choose a JPEG, PNG, or WebP file no larger than 5 MB.",
        error: true,
      });
      return;
    }

    const body = new FormData();
    body.append("image", file);

    setBusy("upload");
    setFeedback({ text: "", error: false });

    try {
      const result = await uploadMultipart(
        `/api/vehicles/${encodeURIComponent(id)}/images`,
        body,
      );

      if (result?.success !== true || !result?.image?.url) {
        throw new Error("The server did not confirm the image upload.");
      }

      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      setFeedback({
        text: "Vehicle image uploaded successfully.",
        error: false,
      });
      setReloadId((value) => value + 1);
    } catch (error) {
      setFeedback({
        text: error.message || "Unable to upload the image.",
        error: true,
      });
    } finally {
      setBusy("");
    }
  }

  async function setCoverImage(url) {
    if (busy || loading || snapshot.vehicle?.images?.[0] === url) {
      return;
    }

    setBusy("cover");
    setFeedback({ text: "", error: false });

    try {
      const result = await apiRequest(
        `/api/vehicles/${encodeURIComponent(id)}/images/cover`,
        {
          method: "PATCH",
          authenticated: true,
          body: { url },
        },
      );

      if (result?.success !== true || result.coverImage !== url) {
        throw new Error("Cover image update was not confirmed.");
      }

      setFeedback({
        text: "Vehicle cover image updated successfully.",
        error: false,
      });

      setReloadId((value) => value + 1);
    } catch (error) {
      setFeedback({
        text: error.message || "Unable to update cover image.",
        error: true,
      });
    } finally {
      setBusy("");
    }
  }

  async function handleBlockCreate(event) {
    event.preventDefault();
    if (busy || loading) return;

    const start = parseWAT(blockForm.startAt);
    const end = parseWAT(blockForm.endAt);

    if (!start || !end || start <= new Date() || end <= start) {
      setFeedback({
        text: "Enter valid future dates, with an end after the start (Nigeria time).",
        error: true,
      });
      return;
    }

    const notes = blockForm.notes.trim();
    if (notes.length > 500) {
      setFeedback({
        text: "Notes must not exceed 500 characters.",
        error: true,
      });
      return;
    }

    setBusy("create");
    setFeedback({ text: "", error: false });

    try {
      const result = await apiRequest(
        `/api/admin/vehicles/${encodeURIComponent(id)}/availability-blocks`,
        {
          method: "POST",
          authenticated: true,
          body: {
            reason: blockForm.reason,
            startAt: start.toISOString(),
            endAt: end.toISOString(),
            notes,
          },
        },
      );

      if (result?.success !== true || !result?.block?.id) {
        throw new Error("The server did not confirm the availability block.");
      }

      setBlockForm(initialBlock);
      setFeedback({
        text: "Scheduled restriction created. The vehicle will be unavailable for these dates.",
        error: false,
      });
      setReloadId((value) => value + 1);
    } catch (error) {
      setFeedback({
        text: error.message || "Unable to schedule this restriction.",
        error: true,
      });
    } finally {
      setBusy("");
    }
  }

  async function deactivateBlock(block) {
    if (busy || loading || !block.isActive) return;
    if (
      !window.confirm(
        "Deactivate this availability restriction? This does not change existing booking records.",
      )
    ) {
      return;
    }

    setBusy(`deactivate:${block._id}`);
    setFeedback({ text: "", error: false });

    try {
      const result = await apiRequest(
        `/api/admin/availability-blocks/${encodeURIComponent(block._id)}/deactivate`,
        { method: "PATCH", authenticated: true },
      );

      if (result?.success !== true) {
        throw new Error("The server did not confirm deactivation.");
      }

      setFeedback({
        text: result.message || "Availability restriction deactivated.",
        error: false,
      });
      setReloadId((value) => value + 1);
    } catch (error) {
      setFeedback({
        text: error.message || "Unable to deactivate the restriction.",
        error: true,
      });
    } finally {
      setBusy("");
    }
  }

  const vehicle = snapshot.vehicle;
  const blocks = snapshot.blocks;

  return (
    <section className="max-w-[1100px]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/admin/vehicles"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#233D4D] hover:text-[#F87927]"
        >
          <ArrowLeft size={17} /> Back to vehicle inventory
        </Link>
        <button
          type="button"
          onClick={refresh}
          disabled={loading || Boolean(busy)}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#EAECF0] bg-white px-4 py-2 text-sm font-semibold text-[#233D4D] disabled:opacity-50"
        >
          <RefreshCw size={17} /> Refresh
        </button>
      </div>

      <div className="mt-7">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#F87927]">
          Fleet Management
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[#233D4D]">
          Images & Availability
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#3D3D3D]/70">
          Upload vehicle photos and schedule periods when a vehicle cannot be
          rented.
        </p>
      </div>

      {loading && (
        <p role="status" className="mt-8 rounded-xl bg-white p-5 text-sm">
          Loading vehicle management...
        </p>
      )}

      {!loading && snapshot.error && (
        <p
          role="alert"
          className="mt-8 rounded-xl bg-red-50 p-5 text-sm text-red-700"
        >
          {snapshot.error}
        </p>
      )}

      {feedback.text && (
        <p
          role={feedback.error ? "alert" : "status"}
          className={`mt-6 rounded-xl p-4 text-sm ${
            feedback.error
              ? "bg-red-50 text-red-700"
              : "bg-green-50 text-green-800"
          }`}
        >
          {feedback.text}
        </p>
      )}

      {!loading && !snapshot.error && vehicle && (
        <>
          <div className="mt-7 rounded-2xl border border-[#EAECF0] bg-white p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-[#233D4D]">
                  {vehicle.brand} {vehicle.model} ({vehicle.year})
                </h2>
                <p className="mt-1 text-sm text-[#3D3D3D]/65">
                  {vehicle.isActive ? "Active listing" : "Inactive listing"}
                  {" · "}
                  {vehicle.operationalStatus?.replaceAll("_", " ") ??
                    "Status unknown"}
                </p>
              </div>
              <Link
                to={`/admin/vehicles/${encodeURIComponent(id)}/edit`}
                className="rounded-xl border border-[#EAECF0] px-4 py-2 text-sm font-semibold text-[#233D4D] hover:bg-[#EAECF0]"
              >
                Edit Details
              </Link>
            </div>

            <div className="mt-7 flex items-center gap-2 text-[#233D4D]">
              <ImagePlus size={22} />
              <h3 className="text-lg font-bold">Vehicle Photos</h3>
            </div>
            <p className="mt-2 text-sm leading-6 text-[#3D3D3D]/70">
              Upload one JPEG, PNG, or WebP image at a time (maximum 5 MB).
              Existing images are preserved. Image deletion and reordering are
              not yet available.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(vehicle.images ?? []).map((url, index) => (
                <div
                  key={`${url}:${index}`}
                  className="overflow-hidden rounded-xl border border-[#EAECF0]"
                >
                  <img
                    src={url}
                    alt={`${vehicle.brand} ${vehicle.model} photo ${index + 1}`}
                    loading="lazy"
                    className="aspect-[4/3] w-full bg-[#EAECF0] object-cover"
                  />

                  <div className="flex items-center justify-between gap-2 px-3 py-3">
                    <span className="text-xs font-semibold text-[#233D4D]">
                      {index === 0 ? "Cover Image" : `Image ${index + 1}`}
                    </span>

                    {index !== 0 && (
                      <button
                        type="button"
                        onClick={() => setCoverImage(url)}
                        disabled={Boolean(busy) || loading}
                        className="rounded-lg bg-[#233D4D] px-3 py-2 text-xs font-semibold text-white hover:bg-[#34596F] disabled:opacity-50"
                      >
                        Set as Cover
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {(!vehicle.images || vehicle.images.length === 0) && (
              <p className="mt-5 rounded-xl bg-[#F7F8FA] p-4 text-sm text-[#3D3D3D]/70">
                No images uploaded yet.
              </p>
            )}

            <form
              onSubmit={handleImageUpload}
              className="mt-7 flex flex-wrap items-end gap-3"
            >
              <label className="min-w-[240px] flex-1 text-sm font-semibold text-[#233D4D]">
                Select vehicle image
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                  className="mt-2 block w-full rounded-xl border border-[#CBD5DF] bg-white p-3 text-sm"
                />
              </label>
              <button
                type="submit"
                disabled={!file || Boolean(busy)}
                className="inline-flex min-h-11 items-center rounded-xl bg-[#F87927] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                {busy === "upload" ? "Uploading..." : "Upload Image"}
              </button>
            </form>
          </div>

          <div className="mt-7 rounded-2xl border border-[#EAECF0] bg-white p-5 sm:p-7">
            <div className="flex items-center gap-2 text-[#233D4D]">
              <CalendarClock size={22} />
              <h3 className="text-lg font-bold">Scheduled Availability</h3>
            </div>
            <p className="mt-2 text-sm leading-6 text-[#3D3D3D]/70">
              Times below are in Nigeria time (WAT, UTC+01:00), regardless of
              your device timezone. Scheduling a block does not cancel existing
              bookings.
            </p>
            <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
              <ShieldAlert className="mt-1 shrink-0" size={18} />
              <span>
                The backend rejects overlapping restrictions, confirmed rentals,
                and active checkout locks.
              </span>
            </div>

            <form onSubmit={handleBlockCreate} className="mt-6 space-y-5">
              <div className="grid gap-4 md:grid-cols-3">
                <label className="text-sm font-semibold text-[#233D4D]">
                  Reason
                  <select
                    value={blockForm.reason}
                    onChange={(event) =>
                      setBlockForm((previous) => ({
                        ...previous,
                        reason: event.target.value,
                      }))
                    }
                    className={inputClass}
                  >
                    <option value="maintenance">Maintenance</option>
                    <option value="inspection">Inspection</option>
                    <option value="other">Other</option>
                  </select>
                </label>
                <label className="text-sm font-semibold text-[#233D4D]">
                  Start (Nigeria time)
                  <input
                    required
                    type="datetime-local"
                    value={blockForm.startAt}
                    onChange={(event) =>
                      setBlockForm((previous) => ({
                        ...previous,
                        startAt: event.target.value,
                      }))
                    }
                    className={inputClass}
                  />
                </label>
                <label className="text-sm font-semibold text-[#233D4D]">
                  End (Nigeria time)
                  <input
                    required
                    type="datetime-local"
                    value={blockForm.endAt}
                    onChange={(event) =>
                      setBlockForm((previous) => ({
                        ...previous,
                        endAt: event.target.value,
                      }))
                    }
                    className={inputClass}
                  />
                </label>
              </div>
              <label className="block text-sm font-semibold text-[#233D4D]">
                Internal notes (optional)
                <textarea
                  rows={3}
                  maxLength={500}
                  value={blockForm.notes}
                  onChange={(event) =>
                    setBlockForm((previous) => ({
                      ...previous,
                      notes: event.target.value,
                    }))
                  }
                  placeholder="Describe why this vehicle is unavailable."
                  className={inputClass}
                />
              </label>
              <button
                type="submit"
                disabled={Boolean(busy)}
                className="min-h-11 rounded-xl bg-[#233D4D] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                {busy === "create" ? "Scheduling..." : "Schedule Restriction"}
              </button>
            </form>

            <h4 className="mt-8 text-base font-bold text-[#233D4D]">
              Recorded Restrictions ({blocks.length})
            </h4>
            {blocks.length === 0 ? (
              <p className="mt-4 text-sm text-[#3D3D3D]/70">
                No availability restrictions have been recorded.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {blocks.map((block) => (
                  <article
                    key={block._id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#EAECF0] p-4"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold capitalize text-[#233D4D]">
                        {block.reason}
                      </p>
                      <p className="mt-1 text-sm text-[#3D3D3D]/70">
                        {formatWAT(block.startAt)} — {formatWAT(block.endAt)}
                      </p>
                      {block.notes && (
                        <p className="mt-2 whitespace-pre-wrap break-words text-sm text-[#3D3D3D]/70">
                          {block.notes}
                        </p>
                      )}
                      <p className="mt-2 text-xs font-semibold text-[#3D3D3D]/65">
                        {block.isActive ? "Active restriction" : "Deactivated"}
                      </p>
                    </div>
                    {block.isActive && (
                      <button
                        type="button"
                        disabled={Boolean(busy)}
                        onClick={() => deactivateBlock(block)}
                        className="min-h-10 rounded-xl border border-[#EAECF0] px-4 py-2 text-sm font-semibold text-[#233D4D] hover:bg-[#EAECF0] disabled:opacity-50"
                      >
                        {busy === `deactivate:${block._id}`
                          ? "Deactivating..."
                          : "Deactivate"}
                      </button>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}

export default AdminVehicleOperations;
