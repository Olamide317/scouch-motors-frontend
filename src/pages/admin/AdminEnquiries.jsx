import { useEffect, useState } from "react";
import { Mail, RefreshCw, Wrench } from "lucide-react";

import { apiRequest } from "../../services/api";

const PER_PAGE = 10;

const enquiryTypes = {
  contact: {
    title: "Contact enquiries",
    path: "/api/contact",
    statuses: ["new", "reviewed", "closed"],
  },
  repair: {
    title: "Repair & maintenance",
    path: "/api/repair-enquiries",
    statuses: ["new", "in_review", "closed"],
  },
};

const statusLabels = {
  new: "New",
  reviewed: "Reviewed",
  in_review: "In Review",
  closed: "Closed",
};

function formatDate(value) {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return date.toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function AdminEnquiries() {
  const [type, setType] = useState("contact");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [notification, setNotification] = useState("");
  const [snapshot, setSnapshot] = useState({ key: null, items: [], total: 0, totalPages: 0, error: "" });

  const config = enquiryTypes[type];
  const requestKey = `${type}|${status}|${page}|${refresh}`;
  const loading = snapshot.key !== requestKey;

  useEffect(() => {
    let active = true;

    async function loadEnquiries() {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(PER_PAGE),
      });
      if (status !== "all") params.set("status", status);

      try {
        const result = await apiRequest(
          `${enquiryTypes[type].path}?${params.toString()}`,
          { authenticated: true }
        );

        if (!active) return;
        if (!Array.isArray(result?.enquiries) || !result?.pagination) {
          throw new Error("Unexpected enquiry response from server.");
        }

        const totalPages = Number(result.pagination.totalPages) || 0;
        if (page > 1 && page > totalPages) {
          setPage(Math.max(1, totalPages));
          return;
        }

        setSnapshot({
          key: requestKey,
          items: result.enquiries,
          total: Number(result.pagination.total) || 0,
          totalPages,
          error: "",
        });
      } catch (error) {
        if (!active) return;
        setSnapshot({
          key: requestKey,
          items: [],
          total: 0,
          totalPages: 0,
          error: error.message || "Unable to load enquiries.",
        });
      }
    }

    loadEnquiries();
    return () => {
      active = false;
    };
  }, [type, status, page, refresh, requestKey]);

  function switchType(nextType) {
    if (nextType === type) return;
    setType(nextType);
    setStatus("all");
    setPage(1);
    setExpandedId(null);
    setNotification("");
  }

  async function updateStatus(enquiry, nextStatus) {
    if (savingId || nextStatus === enquiry.status) return;
    setSavingId(enquiry._id);
    setNotification("");

    try {
      const result = await apiRequest(
        `${config.path}/${enquiry._id}/status`,
        {
          method: "PATCH",
          authenticated: true,
          body: { status: nextStatus },
        }
      );
      if (result?.success !== true || result?.enquiry?.status !== nextStatus) {
        throw new Error("Unexpected status update response.");
      }
      setNotification("Enquiry status updated successfully.");
      setRefresh((value) => value + 1);
    } catch (error) {
      setNotification(error.message || "Unable to update enquiry status.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#233D4D]">Enquiry Management</h1>
          <p className="mt-2 text-sm text-[#3D3D3D]/70">
            Review customer messages and service requests.
          </p>
        </div>
        <button
          type="button"
          disabled={loading}
          onClick={() => {
            setNotification("");
            setRefresh((value) => value + 1);
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-[#EAECF0] bg-white px-4 py-3 text-sm font-semibold text-[#233D4D] hover:bg-[#EAECF0] disabled:opacity-50"
        >
          <RefreshCw size={17} /> Refresh
        </button>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Enquiry type">
        <button
          type="button"
          aria-pressed={type === "contact"}
          onClick={() => switchType("contact")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${type === "contact" ? "bg-[#233D4D] text-white" : "border border-[#EAECF0] bg-white text-[#233D4D]"}`}
        >
          <Mail size={18} /> Contact enquiries
        </button>
        <button
          type="button"
          aria-pressed={type === "repair"}
          onClick={() => switchType("repair")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${type === "repair" ? "bg-[#233D4D] text-white" : "border border-[#EAECF0] bg-white text-[#233D4D]"}`}
        >
          <Wrench size={18} /> Repair & maintenance
        </button>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-[#EAECF0] bg-white p-4 sm:p-5">
        <div>
          <label htmlFor="enquiry-status-filter" className="block text-sm font-semibold text-[#233D4D]">
            Filter by status
          </label>
          <select
            id="enquiry-status-filter"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
              setExpandedId(null);
            }}
            className="mt-2 min-h-11 rounded-lg border border-[#CBD5DF] bg-white px-3 text-sm text-[#233D4D]"
          >
            <option value="all">All statuses</option>
            {config.statuses.map((value) => (
              <option value={value} key={value}>{statusLabels[value]}</option>
            ))}
          </select>
        </div>
        <p className="text-sm text-[#3D3D3D]/70">
          {loading ? "Loading..." : `${snapshot.total} ${snapshot.total === 1 ? "enquiry" : "enquiries"}`}
        </p>
      </div>

      {notification && (
        <p role="status" className="rounded-xl border border-[#EAECF0] bg-white p-4 text-sm text-[#233D4D]">
          {notification}
        </p>
      )}

      {loading ? (
        <p role="status" className="rounded-xl bg-white p-6 text-[#233D4D]">Loading {config.title.toLowerCase()}...</p>
      ) : snapshot.error ? (
        <p role="alert" className="rounded-xl bg-red-50 p-6 text-sm text-red-700">{snapshot.error}</p>
      ) : snapshot.items.length === 0 ? (
        <div className="rounded-xl border border-[#EAECF0] bg-white p-8 text-center text-sm text-[#3D3D3D]/70">
          No enquiries match this filter.
        </div>
      ) : (
        <div className="space-y-4">
          {snapshot.items.map((enquiry) => {
            const name = type === "contact" ? enquiry.name : enquiry.fullName;
            const number = type === "contact" ? enquiry.number : enquiry.phone;
            const details = type === "contact" ? enquiry.message : enquiry.description;
            const expanded = expandedId === enquiry._id;

            return (
              <article key={enquiry._id} className="min-w-0 rounded-2xl border border-[#EAECF0] bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h2 className="break-words text-lg font-bold text-[#233D4D]">{name}</h2>
                    <p className="mt-1 break-all text-sm text-[#3D3D3D]/80">{enquiry.email}</p>
                    <p className="mt-1 text-sm text-[#3D3D3D]/80">{number}</p>
                    <p className="mt-2 text-xs text-[#3D3D3D]/60">Submitted {formatDate(enquiry.createdAt)}</p>
                  </div>
                  <div>
                    <label htmlFor={`enquiry-status-${enquiry._id}`} className="block text-xs font-semibold text-[#233D4D]">Status</label>
                    <select
                      id={`enquiry-status-${enquiry._id}`}
                      value={enquiry.status}
                      disabled={Boolean(savingId)}
                      onChange={(event) => updateStatus(enquiry, event.target.value)}
                      className="mt-1 min-h-10 rounded-lg border border-[#CBD5DF] bg-white px-3 text-sm text-[#233D4D] disabled:opacity-50"
                    >
                      {config.statuses.map((value) => (
                        <option key={value} value={value}>{statusLabels[value]}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {type === "repair" && (
                  <div className="mt-4 rounded-xl bg-[#F7F8FA] p-4 text-sm text-[#233D4D]">
                    <p><strong>Vehicle:</strong> {enquiry.vehicle}</p>
                    <p className="mt-1"><strong>Service:</strong> {enquiry.serviceType}</p>
                  </div>
                )}

                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={`enquiry-details-${enquiry._id}`}
                  onClick={() => setExpandedId(expanded ? null : enquiry._id)}
                  className="mt-4 text-sm font-semibold text-[#F87927] hover:underline"
                >
                  {expanded ? "Hide details" : "View details"}
                </button>

                {expanded && (
                  <div id={`enquiry-details-${enquiry._id}`} className="mt-3 rounded-xl border border-[#EAECF0] bg-[#FAFAFA] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#3D3D3D]/70">{type === "contact" ? "Customer message" : "Service description"}</p>
                    <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-7 text-[#233D4D]">{details}</p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {!loading && !snapshot.error && snapshot.totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[#3D3D3D]/70">Page {page} of {snapshot.totalPages}</p>
          <div className="flex gap-2">
            <button type="button" disabled={page <= 1} onClick={() => { setPage((value) => value - 1); setExpandedId(null); }} className="rounded-lg border border-[#CBD5DF] bg-white px-4 py-2 text-sm font-semibold text-[#233D4D] disabled:opacity-40">Previous</button>
            <button type="button" disabled={page >= snapshot.totalPages} onClick={() => { setPage((value) => value + 1); setExpandedId(null); }} className="rounded-lg border border-[#CBD5DF] bg-white px-4 py-2 text-sm font-semibold text-[#233D4D] disabled:opacity-40">Next</button>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminEnquiries;
