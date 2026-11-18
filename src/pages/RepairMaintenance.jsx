import { useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";
import carRepair from "../assets/services/car-repair.png";

const serviceTypes = [
  {
    title: "Routine Servicing",
    description:
      "Enquire about scheduled servicing and general vehicle maintenance.",
    icon: "01",
  },
  {
    title: "Mechanical Repairs",
    description: "Describe mechanical concerns and request an assessment.",
    icon: "02",
  },
  {
    title: "Vehicle Diagnostics",
    description:
      "Request an inspection to help identify vehicle performance issues.",
    icon: "03",
  },
  {
    title: "General Inspection",
    description:
      "Make an enquiry about vehicle checks and condition assessments.",
    icon: "04",
  },
];

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  vehicle: "",
  serviceType: "",
  description: "",
};

const fieldClass =
  "mt-2 w-full min-h-[52px] rounded-xl border border-[#EAECF0] bg-white px-4 py-3 text-sm text-[#233D4D] outline-none transition-colors placeholder:text-[#3D3D3D]/40 focus:border-[#F87927] focus:ring-2 focus:ring-[#F87927]/10";

function RepairMaintenance() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
const [notice, setNotice] = useState("");
const [submitError, setSubmitError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setNotice("");
    setSubmitError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (submitting) return;

    setNotice("");
    setSubmitError("");

    const payload = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      vehicle: form.vehicle.trim(),
      serviceType: form.serviceType,
      description: form.description.trim(),
    };

    if (Object.values(payload).some((value) => !value)) {
      setSubmitError("Please complete all required fields.");
      return;
    }

    setSubmitting(true);

    try {
      const result = await apiRequest("/api/repair-enquiries", {
        method: "POST",
        body: payload,
      });

      if (result?.success !== true || !result?.enquiryId) {
        throw new Error("Unexpected service enquiry response.");
      }

      setForm(initialForm);

      setNotice(
        "Your service enquiry was submitted successfully. " +
          "Our team can now review your request.",
      );
    } catch (error) {
      setSubmitError(error.message || "Unable to submit your service enquiry.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="bg-[#233D4D] px-5 py-14 text-white sm:px-8 lg:px-[4.05%] lg:py-20">
        <div className="mx-auto grid max-w-[1400px] items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-2 text-sm text-white/70"
            >
              <Link
                to="/#services"
                className="transition-colors hover:text-[#F87927]"
              >
                Our Services
              </Link>
              <span>/</span>
              <span className="text-white">Repair & Maintenance</span>
            </nav>

            <p className="mt-12 text-sm font-semibold uppercase tracking-[0.18em] text-[#C2E8FF]">
              Automotive Care
            </p>

            <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Repair & Maintenance
            </h1>

            <p className="mt-6 max-w-[580px] text-base leading-8 text-white/75">
              Keep your vehicle in good condition with automotive care and
              maintenance support. Tell us what you need, and our team can
              review your service enquiry.
            </p>

            <a
              href="#service-enquiry"
              className="mt-8 inline-flex min-h-[52px] items-center justify-center rounded-xl bg-[#F87927] px-8 font-semibold text-white transition-colors hover:bg-[#E66B1B]"
            >
              Request a Service
              <span aria-hidden="true" className="ml-2">
                →
              </span>
            </a>
          </div>

          <div className="overflow-hidden rounded-[24px] bg-white/10">
            <img
              src={carRepair}
              alt="Automotive repair and maintenance"
              className="aspect-[5/4] w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="px-5 py-16 sm:px-8 lg:px-[4.05%] lg:py-20">
        <div className="mx-auto max-w-[1400px]">
          <div className="max-w-[730px]">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#F87927]">
              What We Can Help With
            </p>

            <h2 className="mt-3 text-3xl font-bold text-[#233D4D]">
              Explore Our Automotive Services
            </h2>

            <p className="mt-4 leading-7 text-[#3D3D3D]/70">
              Select the type of service you're interested in. The exact
              services available will be confirmed when your enquiry is
              reviewed.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {serviceTypes.map((service) => (
              <article
                key={service.title}
                className="group rounded-[20px] border border-[#EAECF0] bg-[#FAFAFA] p-6 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(35,61,77,0.08)] motion-reduce:transition-none"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C2E8FF]/60 text-lg font-bold text-[#233D4D]">
                  {service.icon}
                </div>

                <h3 className="mt-6 text-lg font-bold text-[#233D4D]">
                  {service.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#3D3D3D]/70">
                  {service.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ENQUIRY FORM */}
      <section
        id="service-enquiry"
        className="scroll-mt-8 bg-[#EAECF0] px-5 py-16 sm:px-8 lg:px-[4.05%] lg:py-20"
      >
        <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          {/* FORM INTRODUCTION */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[#F87927]">
              Get in Touch
            </p>

            <h2 className="mt-3 text-3xl font-bold leading-tight text-[#233D4D]">
              Tell Us About Your Vehicle
            </h2>

            <p className="mt-5 max-w-[480px] leading-8 text-[#3D3D3D]/75">
              Fill out the enquiry form with your vehicle information and a
              description of what you need. Our team can review your request and
              advise on the next steps.
            </p>

            <div className="mt-8 rounded-2xl border border-[#233D4D]/10 bg-white/60 p-5">
              <h3 className="font-semibold text-[#233D4D]">How it will work</h3>

              <p className="mt-3 text-sm leading-7 text-[#3D3D3D]/75">
                Submit your service enquiry for review. Our team can then
                discuss service availability, next steps, and any applicable
                quotation. Submitting an enquiry does not automatically confirm
                an appointment.
              </p>
            </div>
          </div>

          {/* FORM */}
          <div className="rounded-[24px] bg-white p-6 shadow-[0_10px_30px_rgba(35,61,77,0.05)] sm:p-8">
            <h3 className="text-xl font-bold text-[#233D4D]">
              Service Enquiry
            </h3>

            <p className="mt-2 text-sm text-[#3D3D3D]/65">
              Submit your service enquiry for our team to review..
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="service-name"
                    className="text-sm font-semibold text-[#233D4D]"
                  >
                    Full Name
                  </label>

                  <input
                    id="service-name"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    placeholder="Your full name"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="service-phone"
                    className="text-sm font-semibold text-[#233D4D]"
                  >
                    Phone Number
                  </label>

                  <input
                    id="service-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+234 800 000 0000"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className={fieldClass}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="service-email"
                  className="text-sm font-semibold text-[#233D4D]"
                >
                  Email Address
                </label>

                <input
                  id="service-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="example@email.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className={fieldClass}
                />
              </div>

              <div>
                <label
                  htmlFor="service-vehicle"
                  className="text-sm font-semibold text-[#233D4D]"
                >
                  Vehicle Make / Model
                </label>

                <input
                  id="service-vehicle"
                  name="vehicle"
                  type="text"
                  placeholder="e.g. Toyota Corolla"
                  value={form.vehicle}
                  onChange={handleChange}
                  required
                  className={fieldClass}
                />
              </div>

              <div>
                <label
                  htmlFor="service-type"
                  className="text-sm font-semibold text-[#233D4D]"
                >
                  Type of Service
                </label>

                <select
                  id="service-type"
                  name="serviceType"
                  value={form.serviceType}
                  onChange={handleChange}
                  required
                  className={fieldClass}
                >
                  <option value="" disabled>
                    Select a service
                  </option>

                  {serviceTypes.map((service) => (
                    <option key={service.title} value={service.title}>
                      {service.title}
                    </option>
                  ))}

                  <option value="Other">Other / Not Sure</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="service-description"
                  className="text-sm font-semibold text-[#233D4D]"
                >
                  Describe Your Request
                </label>

                <textarea
                  id="service-description"
                  name="description"
                  rows={5}
                  placeholder="Tell us about the issue or service required..."
                  value={form.description}
                  onChange={handleChange}
                  required
                  className={`${fieldClass} resize-y`}
                />
              </div>

              {notice && (
                <p
                  role="status"
                  className="
      rounded-xl bg-green-50 p-4
      text-sm leading-6 text-green-800
    "
                >
                  {notice}
                </p>
              )}

              {submitError && (
                <p
                  role="alert"
                  className="
      rounded-xl bg-red-50 p-4
      text-sm leading-6 text-red-700
    "
                >
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="
    flex min-h-[54px] w-full
    items-center justify-center
    rounded-xl bg-[#233D4D] px-6
    font-semibold text-white
    transition-colors hover:bg-[#34596F]
    disabled:cursor-not-allowed
    disabled:opacity-60
  "
              >
                {submitting
                  ? "Submitting Enquiry..."
                  : "Submit Service Enquiry"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

export default RepairMaintenance;
