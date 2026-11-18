import { useEffect, useState } from "react";

import {
  CalendarDays,
  CarFront,
  Mail,
  RefreshCw,
  Wrench,
} from "lucide-react";

import { apiRequest } from "../../services/api";

const metrics = [
  {
    key: "vehicles",
    label: "Total Vehicles",
    icon: CarFront,
    path: "/api/admin/vehicles",
  },
  {
    key: "bookings",
    label: "Total Bookings",
    icon: CalendarDays,
    path: "/api/admin/bookings?limit=1",
  },
  {
    key: "contacts",
    label: "Contact Enquiries",
    icon: Mail,
    path: "/api/contact?limit=1",
  },
  {
    key: "repairs",
    label: "Repair Enquiries",
    icon: Wrench,
    path: "/api/repair-enquiries?limit=1",
  },
];

function extractCount(key, result) {
  if (key === "vehicles") {
    return result?.results;
  }

  return result?.pagination?.total;
}

function AdminOverview() {
  const [refreshId, setRefreshId] = useState(0);
  const [snapshot, setSnapshot] = useState({
    refreshId: -1,
    values: {},
  });

  useEffect(() => {
    let active = true;

    async function loadOverview() {
      const results = await Promise.allSettled(
        metrics.map((metric) =>
          apiRequest(metric.path, {
            authenticated: true,
          })
        )
      );

      if (!active) return;

      const values = {};

      metrics.forEach((metric, index) => {
        const response = results[index];

        if (response.status === "rejected") {
          values[metric.key] = {
            error:
              response.reason?.message ||
              "Unable to load.",
          };
          return;
        }

        const count = extractCount(
          metric.key,
          response.value
        );

        values[metric.key] =
          Number.isSafeInteger(count) && count >= 0
            ? { count }
            : { error: "Invalid server response." };
      });

      setSnapshot({
        refreshId,
        values,
      });
    }

    loadOverview();

    return () => {
      active = false;
    };
  }, [refreshId]);

  const loading = snapshot.refreshId !== refreshId;

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#233D4D]">
            Dashboard Overview
          </h1>

          <p className="mt-2 text-sm text-[#3D3D3D]/65">
            Monitor Scouch Motors operations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setRefreshId((id) => id + 1)}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-[#EAECF0] bg-white px-4 py-3 text-sm font-semibold text-[#233D4D] hover:bg-[#EAECF0] disabled:opacity-50"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const value = snapshot.values[metric.key];

          return (
            <article
              key={metric.key}
              className="rounded-2xl border border-[#EAECF0] bg-white p-6 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F87927]/10 text-[#F87927]">
                <Icon size={23} />
              </div>

              <h2 className="mt-5 text-sm font-medium text-[#3D3D3D]/70">
                {metric.label}
              </h2>

              <p className="mt-2 text-3xl font-bold text-[#233D4D]">
                {loading
                  ? "..."
                  : value?.error
                    ? "—"
                    : value?.count ?? "—"}
              </p>

              {value?.error && !loading && (
                <p
                  role="alert"
                  className="mt-3 text-xs text-red-600"
                >
                  {value.error}
                </p>
              )}
            </article>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-[#EAECF0] bg-white p-6">
        <h2 className="text-xl font-bold text-[#233D4D]">
          Management Workspace
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#3D3D3D]/70">
          These totals are loaded from the Scouch Motors
          backend. Next, we'll add the enquiry management
          screens so administrators can view contact
          messages and process repair requests directly.
        </p>
      </div>
    </section>
  );
}

export default AdminOverview;