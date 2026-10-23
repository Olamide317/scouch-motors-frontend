import { useState } from "react";
import { Link } from "react-router-dom";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

function Register() {
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [previewMessage, setPreviewMessage] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setPreviewMessage(false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setPreviewMessage(true);
  }

  const inputClass =
    "mt-2 block min-h-[52px] w-full rounded-xl border border-[#EAECF0] bg-white px-4 text-sm text-[#233D4D] outline-none transition-colors placeholder:text-[#3D3D3D]/40 focus:border-[#F87927] focus:ring-2 focus:ring-[#F87927]/10";

  const labelClass =
    "block text-sm font-semibold text-[#233D4D]";

  return (
    <main className="bg-[#FAFAFA] px-5 py-12 sm:px-8 lg:py-20">
      <div className="mx-auto max-w-[1120px] overflow-hidden rounded-[24px] border border-[#EAECF0] bg-white shadow-[0_12px_40px_rgba(35,61,77,0.05)] lg:grid lg:grid-cols-[0.85fr_1.15fr]">

        {/* LEFT BRAND PANEL */}
        <section className="flex flex-col justify-between bg-[#233D4D] p-8 text-white sm:p-10 lg:p-12">
          <div>
            <Link
              to="/"
              className="text-2xl font-extrabold"
            >
              <span className="text-[#F87927]">
                Scouch
              </span>{" "}
              Motors Ltd
            </Link>

            <div className="mt-12 lg:mt-24">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#C2E8FF]">
                Your Journey Starts Here
              </p>

              <h1 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl">
                Create Your Account
              </h1>

              <p className="mt-5 max-w-[360px] text-base leading-8 text-white/75">
                Create an account to manage your rental
                requests and keep track of your bookings
                in one place.
              </p>
            </div>
          </div>

          <p className="mt-12 text-sm text-white/60">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#F87927] hover:underline"
            >
              Sign In
            </Link>
          </p>
        </section>

        {/* REGISTRATION FORM */}
        <section className="p-6 sm:p-10 lg:p-12">
          <div>
            <h2 className="text-2xl font-bold text-[#233D4D]">
              Sign Up
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#3D3D3D]/65">
              Enter your details to get started.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            {/* NAME FIELDS */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="register-first-name"
                  className={labelClass}
                >
                  First Name
                </label>

                <input
                  id="register-first-name"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  placeholder="First name"
                  value={form.firstName}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="register-last-name"
                  className={labelClass}
                >
                  Last Name
                </label>

                <input
                  id="register-last-name"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label
                htmlFor="register-email"
                className={labelClass}
              >
                Email Address
              </label>

              <input
                id="register-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="example@email.com"
                value={form.email}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            {/* PHONE */}
            <div>
              <label
                htmlFor="register-phone"
                className={labelClass}
              >
                Phone Number
              </label>

              <input
                id="register-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+234 800 000 0000"
                value={form.phone}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label
                htmlFor="register-password"
                className={labelClass}
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="register-password"
                  name="password"
                  type={
                    showPassword ? "text" : "password"
                  }
                  autoComplete="new-password"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={handleChange}
                  className={`${inputClass} pr-20`}
                  minLength={8}
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  className="absolute inset-y-0 right-4 mt-2 text-sm font-semibold text-[#233D4D] hover:text-[#F87927]"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label
                htmlFor="register-confirm-password"
                className={labelClass}
              >
                Confirm Password
              </label>

              <div className="relative">
                <input
                  id="register-confirm-password"
                  name="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="new-password"
                  placeholder="Confirm password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={`${inputClass} pr-20`}
                  minLength={8}
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (previous) => !previous
                    )
                  }
                  className="absolute inset-y-0 right-4 mt-2 text-sm font-semibold text-[#233D4D] hover:text-[#F87927]"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirmation password"
                      : "Show confirmation password"
                  }
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {form.confirmPassword &&
              form.password !== form.confirmPassword && (
                <p className="text-sm text-red-600">
                  Passwords do not match.
                </p>
              )}

            {/* PREVIEW NOTICE */}
            {previewMessage && (
              <p
                role="status"
                className="rounded-xl bg-[#C2E8FF]/35 p-4 text-sm leading-6 text-[#233D4D]"
              >
                This is a frontend preview. Account
                registration will be enabled when the
                backend is connected. No account has been
                created.
              </p>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={
                Boolean(form.confirmPassword) &&
                form.password !== form.confirmPassword
              }
              className="flex min-h-[54px] w-full items-center justify-center rounded-xl bg-[#233D4D] px-6 font-semibold text-white transition-colors hover:bg-[#34596F] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Create Account
            </button>

            <p className="text-center text-sm text-[#3D3D3D]/65 lg:hidden">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#F87927]"
              >
                Sign In
              </Link>
            </p>
          </form>

          <p className="mt-6 text-center text-xs leading-5 text-[#3D3D3D]/50">
            Frontend preview — account registration
            is not yet connected.
          </p>
        </section>
      </div>
    </main>
  );
}

export default Register;