import { useEffect, useState } from "react";
import { CarFront, RefreshCw, Search } from "lucide-react";
import { Link } from "react-router-dom";

import { apiRequest } from "../../services/api";

const operationalStatuses = [
  { value: "available", label: "Available" },
  { value: "maintenance", label: "Maintenance" },
  { value: "out_of_service", label: "Out of service" },
];

function formatMoney(value) {
  return Number.isFinite(value)
    ? new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
      }).format(value)
    : "Not set";
}

function formatStatus(status) {
  return (
    operationalStatuses.find((item) => item.value === status)?.label ??
    "Unknown"
  );
}

function AdminVehicles() {
  const [reloadId, setReloadId] = useState(0);
  const [snapshot, setSnapshot] = useState({
    reloadId: -1,
    vehicles: [],
    error: "",
  });

  const [search, setSearch] = useState("");
  const [listingFilter, setListingFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pendingId, setPendingId] = useState(null);
  const [notice, setNotice] = useState("");
  const [actionError, setActionError] = useState("");

  const loading = snapshot.reloadId !== reloadId;

  useEffect(() => {
    let active = true;

    async function loadVehicles() {
      try {
        const result = await apiRequest("/api/admin/vehicles", {
          authenticated: true,
        });

        if (!active) return;

        if (result?.success !== true || !Array.isArray(result.vehicles)) {
          throw new Error("Unexpected vehicle inventory response.");
        }

        setSnapshot({
          reloadId,
          vehicles: result.vehicles,
          error: "",
        });
      } catch (error) {
        if (!active) return;

        setSnapshot({
          reloadId,
          vehicles: [],
          error: error.message || "Unable to load fleet inventory.",
        });
      }
    }

    loadVehicles();

    return () => {
      active = false;
    };
  }, [reloadId]);

  const vehicles = snapshot.vehicles;

  const matchingVehicles = vehicles.filter((vehicle) => {
    const searchable = [
      vehicle.brand,
      vehicle.model,
      vehicle.year,
      vehicle.category,
    ]
      .filter((value) => value !== undefined && value !== null)
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchable.includes(search.trim().toLowerCase());
    const matchesListing =
      listingFilter === "all" ||
      (listingFilter === "active" && vehicle.isActive) ||
      (listingFilter === "inactive" && !vehicle.isActive);
    const matchesStatus =
      statusFilter === "all" || vehicle.operationalStatus === statusFilter;

    return matchesSearch && matchesListing && matchesStatus;
  });

  const activeCount = vehicles.filter((vehicle) => vehicle.isActive).length;
  const availableCount = vehicles.filter(
    (vehicle) => vehicle.isActive && vehicle.operationalStatus === "available",
  ).length;
  const demoCount = vehicles.filter((vehicle) => vehicle.isDemo).length;

  function refresh() {
    if (loading || pendingId) return;
    setNotice("");
    setActionError("");
    setReloadId((value) => value + 1);
  }

  async function changeListing(vehicle) {
    if (pendingId || loading) return;

    const nextActive = !vehicle.isActive;
    const action = nextActive ? "activate" : "deactivate";

    if (
      !window.confirm(
        `${nextActive ? "Activate" : "Deactivate"} ${vehicle.brand} ${vehicle.model}? ` +
          "This will change its visibility in the public catalogue.",
      )
    ) {
      return;
    }

    setPendingId(vehicle._id);
    setActionError("");
    setNotice("");

    try {
      const result = await apiRequest(
        `/api/vehicles/${vehicle._id}/${action}`,
        { method: "PATCH", authenticated: true },
      );

      if (result?.success !== true) {
        throw new Error("Vehicle update was not confirmed.");
      }

      setNotice(result.message || "Vehicle listing updated.");
      setReloadId((value) => value + 1);
    } catch (error) {
      setActionError(error.message || "Unable to update the vehicle listing.");
    } finally {
      setPendingId(null);
    }
  }

  async function changeOperationalStatus(vehicle, nextStatus) {
    if (pendingId || loading || vehicle.operationalStatus === nextStatus) {
      return;
    }

    if (!operationalStatuses.some(({ value }) => value === nextStatus)) {
      return;
    }

    if (
      !window.confirm(
        `Change ${vehicle.brand} ${vehicle.model} from ` +
          `${formatStatus(vehicle.operationalStatus)} to ${formatStatus(nextStatus)}? ` +
          "This can affect vehicle availability.",
      )
    ) {
      return;
    }

    setPendingId(vehicle._id);
    setActionError("");
    setNotice("");

    try {
      const result = await apiRequest(`/api/vehicles/${vehicle._id}/status`, {
        method: "PATCH",
        authenticated: true,
        body: { operationalStatus: nextStatus },
      });

      if (result?.success !== true) {
        throw new Error("Operational status update was not confirmed.");
      }

      setNotice(result.message || "Vehicle status updated.");
      setReloadId((value) => value + 1);
    } catch (error) {
      setActionError(error.message || "Unable to update operational status.");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#F87927]">
            Fleet Management
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[#233D4D]">
            Vehicle Inventory
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#3D3D3D]/70">
            Manage vehicle visibility and operational availability.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={refresh}
            disabled={loading || Boolean(pendingId)}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#EAECF0] bg-white px-4 py-3 text-sm font-semibold text-[#233D4D] hover:bg-[#EAECF0] disabled:opacity-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>

          <Link
            to="/admin/vehicles/new"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#F87927] px-5 py-3 text-sm font-semibold text-white hover:bg-[#E96D1B]"
          >
            + Add Vehicle
          </Link>
        </div>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total vehicles", value: vehicles.length },
          { label: "Active listings", value: activeCount },
          { label: "Available listings", value: availableCount },
          { label: "Demo vehicles", value: demoCount },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-[#EAECF0] bg-white p-5"
          >
            <p className="text-sm text-[#3D3D3D]/70">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-[#233D4D]">
              {loading ? "…" : stat.value}
            </p>
          </div>
        ))}
      </div>

      {notice && (
        <p
          role="status"
          className="mt-5 rounded-xl bg-green-50 p-4 text-sm text-green-800"
        >
          {notice}
        </p>
      )}

      {actionError && (
        <p
          role="alert"
          className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700"
        >
          {actionError}
        </p>
      )}

      <div className="mt-7 rounded-2xl border border-[#EAECF0] bg-white p-5 sm:p-6">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_180px_200px]">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#233D4D]">
              Search vehicles
            </span>
            <span className="relative block">
              <Search
                size={19}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#3D3D3D]/50"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Brand, model, year or category"
                className="min-h-11 w-full rounded-xl border border-[#EAECF0] bg-white py-2 pl-11 pr-4 text-sm text-[#233D4D] outline-none focus:border-[#F87927]"
              />
            </span>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#233D4D]">
              Listing
            </span>
            <select
              value={listingFilter}
              onChange={(event) => setListingFilter(event.target.value)}
              className="min-h-11 w-full rounded-xl border border-[#EAECF0] bg-white px-3 text-sm text-[#233D4D]"
            >
              <option value="all">All listings</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#233D4D]">
              Operational status
            </span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="min-h-11 w-full rounded-xl border border-[#EAECF0] bg-white px-3 text-sm text-[#233D4D]"
            >
              <option value="all">All statuses</option>
              {operationalStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {snapshot.error && !loading && (
          <div
            role="alert"
            className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700"
          >
            {snapshot.error}
          </div>
        )}

        {!snapshot.error && !loading && (
          <p className="mt-5 text-sm text-[#3D3D3D]/70">
            Showing {matchingVehicles.length} of {vehicles.length} vehicles
          </p>
        )}

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[850px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#EAECF0] text-xs uppercase tracking-wide text-[#3D3D3D]/60">
                <th scope="col" className="px-3 py-4">
                  Vehicle
                </th>
                <th scope="col" className="px-3 py-4">
                  Daily rate
                </th>
                <th scope="col" className="px-3 py-4">
                  Listing
                </th>
                <th scope="col" className="px-3 py-4">
                  Operational status
                </th>
                <th scope="col" className="px-3 py-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {!loading &&
                !snapshot.error &&
                matchingVehicles.map((vehicle) => (
                  <tr
                    key={vehicle._id}
                    className="border-b border-[#EAECF0] align-middle last:border-0"
                  >
                    <td className="px-3 py-4">
                      <div className="flex min-w-[220px] items-center gap-3">
                        <div className="flex h-16 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#EAECF0]">
                          {vehicle.images?.[0] ? (
                            <img
                              src={vehicle.images[0]}
                              alt={`${vehicle.brand ?? ""} ${vehicle.model ?? ""}`}
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <CarFront className="text-[#233D4D]/40" size={28} />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-[#233D4D]">
                            {vehicle.brand} {vehicle.model}
                          </p>
                          <p className="mt-1 text-xs text-[#3D3D3D]/65">
                            {vehicle.year} ·{" "}
                            {vehicle.category ?? "Uncategorized"}
                          </p>
                          {vehicle.isDemo && (
                            <span className="mt-1 inline-block rounded-full bg-[#C2E8FF]/60 px-2 py-1 text-xs font-semibold text-[#233D4D]">
                              Demo inventory
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm font-semibold text-[#233D4D]">
                      {formatMoney(vehicle.pricing?.daily)}
                    </td>
                    <td className="px-3 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          vehicle.isActive
                            ? "bg-green-50 text-green-800"
                            : "bg-[#EAECF0] text-[#233D4D]"
                        }`}
                      >
                        {vehicle.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <select
                        aria-label={`Operational status for ${vehicle.brand} ${vehicle.model}`}
                        value={vehicle.operationalStatus ?? "available"}
                        onChange={(event) =>
                          changeOperationalStatus(vehicle, event.target.value)
                        }
                        disabled={Boolean(pendingId)}
                        className="min-h-10 rounded-xl border border-[#EAECF0] bg-white px-3 text-sm text-[#233D4D] disabled:opacity-50"
                      >
                        {operationalStatuses.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-4">
                      <Link
                        to={`/admin/vehicles/${vehicle._id}/edit`}
                        className="mr-2 inline-flex min-h-10 items-center rounded-xl border border-[#EAECF0] px-4 text-sm font-semibold text-[#233D4D] hover:bg-[#EAECF0]"
                      >
                        Edit
                      </Link>

                      <Link
                        to={`/admin/vehicles/${vehicle._id}/manage`}
                        className="mr-2 inline-flex min-h-10 items-center rounded-xl border border-[#EAECF0] px-4 text-sm font-semibold text-[#233D4D] hover:bg-[#EAECF0]"
                      >
                        Manage
                      </Link>

                      <button
                        type="button"
                        onClick={() => changeListing(vehicle)}
                        disabled={Boolean(pendingId)}
                        className="min-h-10 rounded-xl border border-[#233D4D]/20 px-4 text-sm font-semibold text-[#233D4D] hover:bg-[#EAECF0] disabled:opacity-50"
                      >
                        {pendingId === vehicle._id
                          ? "Saving…"
                          : vehicle.isActive
                            ? "Deactivate"
                            : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {loading && (
            <p
              role="status"
              className="py-10 text-center text-sm text-[#3D3D3D]/70"
            >
              Loading vehicle inventory...
            </p>
          )}
          {!loading && !snapshot.error && matchingVehicles.length === 0 && (
            <p className="py-10 text-center text-sm text-[#3D3D3D]/70">
              No vehicles match your filters.
            </p>
          )}
        </div>
      </div>

      <p className="mt-5 text-sm leading-6 text-[#3D3D3D]/65">
        Manage your fleet by adding vehicles, updating their specifications and
        rental prices, or changing their listing and operational status. Vehicle
        image management and scheduled availability restrictions will be
        integrated in the next phase.
      </p>
    </section>
  );
}

export default AdminVehicles;
