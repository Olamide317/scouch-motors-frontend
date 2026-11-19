import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CarFront, Save } from "lucide-react";

import { apiRequest } from "../../services/api";

const categories = [
  "sedan",
  "suv",
  "coupe",
  "hatchback",
  "pickup",
  "van",
  "luxury",
];
const transmissions = ["automatic", "manual"];
const fuelTypes = ["petrol", "diesel", "hybrid", "electric"];
const climateOptions = ["A/C", "Automatic Climate Control", "None"];

const initialForm = {
  brand: "",
  model: "",
  year: "",
  category: "suv",
  registrationNumber: "",
  transmission: "automatic",
  fuelType: "petrol",
  seats: "5",
  climateControl: "",
  mileageKm: "",
  description: "",
  daily: "",
  weekly: "",
  monthly: "",
};

function formFromVehicle(vehicle) {
  return {
    brand: vehicle.brand ?? "",
    model: vehicle.model ?? "",
    year: String(vehicle.year ?? ""),
    category: vehicle.category ?? "suv",
    // Registration numbers are intentionally excluded from admin GET responses.
    registrationNumber: "",
    transmission: vehicle.transmission ?? "automatic",
    fuelType: vehicle.fuelType ?? "petrol",
    seats: String(vehicle.seats ?? ""),
    climateControl: vehicle.climateControl ?? "",
    mileageKm: vehicle.mileageKm == null ? "" : String(vehicle.mileageKm),
    description: vehicle.description ?? "",
    daily: String(vehicle.pricing?.daily ?? ""),
    weekly: String(vehicle.pricing?.weekly ?? ""),
    monthly: String(vehicle.pricing?.monthly ?? ""),
  };
}

const inputClass =
  "mt-2 min-h-11 w-full rounded-xl border border-[#CBD5DF] bg-white px-3 py-2 text-sm text-[#233D4D] outline-none focus:border-[#F87927] focus:ring-2 focus:ring-[#F87927]/10";

function Field({ label, name, form, onChange, type = "text", ...props }) {
  return (
    <label className="block text-sm font-semibold text-[#233D4D]">
      {label}
      <input
        name={name}
        type={type}
        value={form[name]}
        onChange={onChange}
        className={inputClass}
        {...props}
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  options,
  form,
  onChange,
  optional = false,
}) {
  return (
    <label className="block text-sm font-semibold text-[#233D4D]">
      {label}
      <select
        name={name}
        value={form[name]}
        onChange={onChange}
        required={!optional}
        className={inputClass}
      >
        {optional && <option value="">Not specified</option>}
        {options.map((option) => (
          <option value={option} key={option}>
            {option.replaceAll("_", " ")}
          </option>
        ))}
      </select>
    </label>
  );
}

function isNonnegativeWholeAmount(value) {
  return (
    value !== "" && Number.isSafeInteger(Number(value)) && Number(value) >= 0
  );
}

function AdminVehicleForm() {
  const { id } = useParams();
  const editing = Boolean(id);

  const [form, setForm] = useState(initialForm);
  const [loaded, setLoaded] = useState({ id: null, vehicle: null, error: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(null);

  useEffect(() => {
    if (!id) return;

    let active = true;

    async function loadVehicle() {
      try {
        // The public GET /api/vehicles/:id excludes inactive vehicles.
        // Use the administrator inventory instead so inactive listings remain editable.
        const result = await apiRequest("/api/admin/vehicles", {
          authenticated: true,
        });

        if (!active) return;

        if (result?.success !== true || !Array.isArray(result.vehicles)) {
          throw new Error("Unable to read administrator inventory.");
        }

        const vehicle = result.vehicles.find((item) => item._id === id);
        if (!vehicle) {
          throw new Error("Vehicle not found in administrator inventory.");
        }

        setForm(formFromVehicle(vehicle));
        setLoaded({ id, vehicle, error: "" });
      } catch (loadError) {
        if (!active) return;
        setLoaded({
          id,
          vehicle: null,
          error: loadError.message || "Unable to load vehicle.",
        });
      }
    }

    loadVehicle();
    return () => {
      active = false;
    };
  }, [id]);

  const loading = editing && loaded.id !== id;
  const loadError = editing && loaded.id === id ? loaded.error : "";

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (saving || loading || loadError || saved) return;

    const year = Number(form.year);
    const seats = Number(form.seats);
    const mileageKm = form.mileageKm === "" ? null : Number(form.mileageKm);

    if (
      !form.brand.trim() ||
      !form.model.trim() ||
      (!editing && !form.registrationNumber.trim())
    ) {
      setError(
        "Brand, model and (for new vehicles) registration number are required.",
      );
      return;
    }

    if (
      !Number.isSafeInteger(year) ||
      year < 1900 ||
      !Number.isSafeInteger(seats) ||
      seats < 1 ||
      (mileageKm !== null &&
        (!Number.isSafeInteger(mileageKm) || mileageKm < 0)) ||
      ![form.daily, form.weekly, form.monthly].every(isNonnegativeWholeAmount)
    ) {
      setError(
        "Enter valid whole-number values for year, seats, mileage and NGN prices.",
      );
      return;
    }

    const body = {
      brand: form.brand.trim(),
      model: form.model.trim(),
      year,
      category: form.category,
      transmission: form.transmission,
      fuelType: form.fuelType,
      seats,
      description: form.description.trim(),
      climateControl: form.climateControl || null,
      mileageKm,
      pricing: {
        daily: Number(form.daily),
        weekly: Number(form.weekly),
        monthly: Number(form.monthly),
      },
    };

    if (!editing) {
      body.registrationNumber = form.registrationNumber.trim().toUpperCase();
    }

    setSaving(true);
    setError("");

    try {
      const path = editing
        ? `/api/vehicles/${encodeURIComponent(id)}`
        : "/api/vehicles";
      const result = await apiRequest(path, {
        method: editing ? "PATCH" : "POST",
        authenticated: true,
        body,
      });

      if (result?.success !== true || !result.vehicle) {
        throw new Error("The server did not confirm the vehicle save.");
      }

      setSaved({
        id: result.vehicle._id ?? result.vehicle.id,
        message: editing
          ? "Vehicle details and rental pricing updated."
          : "Demo vehicle created as an inactive listing. Add images before activation.",
      });
    } catch (saveError) {
      setError(saveError.message || "Unable to save vehicle.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="max-w-[1050px]">
      <Link
        to="/admin/vehicles"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#233D4D] hover:text-[#F87927]"
      >
        <ArrowLeft size={17} /> Back to vehicle inventory
      </Link>

      <div className="mt-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F87927]/10 text-[#F87927]">
          <CarFront size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#233D4D]">
            {editing ? "Edit Vehicle" : "Add New Vehicle"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#3D3D3D]/70">
            {editing
              ? "Update an existing listing. Registration numbers remain unchanged."
              : "Create an inactive demonstration listing. Images will be added separately."}
          </p>
        </div>
      </div>

      {loading && (
        <p className="mt-8 rounded-xl bg-white p-5" role="status">
          Loading vehicle information...
        </p>
      )}

      {loadError && (
        <p
          className="mt-8 rounded-xl bg-red-50 p-5 text-sm text-red-800"
          role="alert"
        >
          {loadError}
        </p>
      )}

      {saved && (
        <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-7">
          <p role="status" className="font-semibold text-green-800">
            {saved.message}
          </p>
          <Link
            to="/admin/vehicles"
            className="mt-5 inline-flex rounded-xl bg-[#233D4D] px-5 py-3 font-semibold text-white hover:bg-[#34596F]"
          >
            Return to Inventory
          </Link>
        </div>
      )}

      {saved?.id && (
        <Link
          to={`/admin/vehicles/${saved.id}/manage`}
          className="ml-3 mt-5 inline-flex rounded-xl bg-[#F87927] px-5 py-3 font-semibold text-white hover:bg-[#E96D1B]"
        >
          Manage Images & Availability
        </Link>
      )}

      {!loading && !loadError && !saved && (
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-2xl border border-[#EAECF0] bg-white p-5 sm:p-7">
            <h2 className="text-xl font-bold text-[#233D4D]">
              Vehicle Details
            </h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field
                label="Brand"
                name="brand"
                form={form}
                onChange={handleChange}
                maxLength={100}
                required
              />
              <Field
                label="Model"
                name="model"
                form={form}
                onChange={handleChange}
                maxLength={100}
                required
              />
              <Field
                label="Year"
                name="year"
                form={form}
                onChange={handleChange}
                type="number"
                min={1900}
                step={1}
                required
              />
              <SelectField
                label="Category"
                name="category"
                options={categories}
                form={form}
                onChange={handleChange}
              />
              {!editing && (
                <Field
                  label="Registration Number (internal only)"
                  name="registrationNumber"
                  form={form}
                  onChange={handleChange}
                  maxLength={40}
                  autoComplete="off"
                  required
                />
              )}
              <SelectField
                label="Transmission"
                name="transmission"
                options={transmissions}
                form={form}
                onChange={handleChange}
              />
              <SelectField
                label="Fuel Type"
                name="fuelType"
                options={fuelTypes}
                form={form}
                onChange={handleChange}
              />
              <Field
                label="Seats"
                name="seats"
                form={form}
                onChange={handleChange}
                type="number"
                min={1}
                step={1}
                required
              />
              <SelectField
                label="Climate Control (optional)"
                name="climateControl"
                options={climateOptions}
                form={form}
                onChange={handleChange}
                optional
              />
              <Field
                label="Mileage in km (optional)"
                name="mileageKm"
                form={form}
                onChange={handleChange}
                type="number"
                min={0}
                step={1}
              />
            </div>
            <label className="mt-5 block text-sm font-semibold text-[#233D4D]">
              Description
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                maxLength={2000}
                className={`${inputClass} resize-y`}
                placeholder="Describe the vehicle's features and condition."
              />
            </label>
          </div>

          <div className="rounded-2xl border border-[#EAECF0] bg-white p-5 sm:p-7">
            <h2 className="text-xl font-bold text-[#233D4D]">Rental Pricing</h2>
            <p className="mt-2 text-sm text-[#3D3D3D]/65">
              Prices are in whole Nigerian naira (₦). Your backend calculates
              rental quotes from these rates.
            </p>
            <div className="mt-5 grid gap-5 sm:grid-cols-3">
              <Field
                label="Daily Rate (₦)"
                name="daily"
                form={form}
                onChange={handleChange}
                type="number"
                min={0}
                step={1}
                required
              />
              <Field
                label="Weekly Rate (₦)"
                name="weekly"
                form={form}
                onChange={handleChange}
                type="number"
                min={0}
                step={1}
                required
              />
              <Field
                label="Monthly Rate (₦)"
                name="monthly"
                form={form}
                onChange={handleChange}
                type="number"
                min={0}
                step={1}
                required
              />
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 p-4 text-sm text-red-800"
            >
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#233D4D] px-6 py-3 font-semibold text-white hover:bg-[#34596F] disabled:opacity-50"
            >
              <Save size={19} />
              {saving
                ? "Saving Vehicle..."
                : editing
                  ? "Save Changes"
                  : "Create Demo Vehicle"}
            </button>
            <Link
              to="/admin/vehicles"
              className="text-sm font-semibold text-[#233D4D] hover:underline"
            >
              Cancel
            </Link>
          </div>
        </form>
      )}
    </section>
  );
}

export default AdminVehicleForm;