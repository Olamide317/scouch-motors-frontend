import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
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

    // Frontend preview only — no authentication yet.
    setPreviewMessage(true);
  }

  const inputClass = `
    mt-2
    block
    min-h-[52px]
    w-full
    rounded-xl
    border
    border-[#EAECF0]
    bg-white
    px-4
    text-sm
    text-[#233D4D]
    outline-none
    transition-colors
    placeholder:text-[#3D3D3D]/40
    focus:border-[#F87927]
    focus:ring-2
    focus:ring-[#F87927]/10
  `;

  return (
    <main className="bg-[#FAFAFA] px-5 py-12 sm:px-8 lg:py-20">
      <div
        className="
          mx-auto
          max-w-[1120px]
          overflow-hidden
          rounded-[24px]
          border
          border-[#EAECF0]
          bg-white
          shadow-[0_12px_40px_rgba(35,61,77,0.05)]
          lg:grid
          lg:grid-cols-[0.85fr_1.15fr]
        "
      >
        {/* LEFT BRAND PANEL */}
        <section
          className="
            flex
            flex-col
            justify-between
            bg-[#233D4D]
            p-8
            text-white
            sm:p-10
            lg:p-12
          "
        >
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
              <p
                className="
                  text-sm
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-[#C2E8FF]
                "
              >
                Welcome Back
              </p>

              <h1
                className="
                  mt-5
                  text-3xl
                  font-bold
                  leading-tight
                  sm:text-4xl
                "
              >
                Your Journey Continues Here
              </h1>

              <p
                className="
                  mt-5
                  max-w-[360px]
                  text-base
                  leading-8
                  text-white/75
                "
              >
                Sign in to access your account,
                manage your rental requests,
                and keep track of your bookings.
              </p>
            </div>
          </div>

          <p className="mt-12 text-sm text-white/60">
            New to Scouch Motors?{" "}
            <Link
              to="/register"
              className="font-semibold text-[#F87927] hover:underline"
            >
              Create an Account
            </Link>
          </p>
        </section>

        {/* RIGHT LOGIN PANEL */}
        <section className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
          <div>
            <h2 className="text-2xl font-bold text-[#233D4D]">
              Sign In
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#3D3D3D]/65">
              Enter your account details to continue.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-6"
          >
            {/* EMAIL */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-sm font-semibold text-[#233D4D]"
              >
                Email Address
              </label>

              <input
                id="login-email"
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

            {/* PASSWORD */}
            <div>
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="login-password"
                  className="text-sm font-semibold text-[#233D4D]"
                >
                  Password
                </label>

                <span
                  className="text-xs font-medium text-[#3D3D3D]/55"
                  title="Password recovery will be added with the backend."
                >
                  Forgot Password?
                </span>
              </div>

              <div className="relative">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  className={`${inputClass} pr-20`}
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  aria-pressed={showPassword}
                  className="
                    absolute
                    inset-y-0
                    right-4
                    mt-2
                    text-sm
                    font-semibold
                    text-[#233D4D]
                    transition-colors
                    hover:text-[#F87927]
                  "
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* DEMO FEEDBACK */}
            {previewMessage && (
              <div
                role="status"
                className="
                  rounded-xl
                  bg-[#C2E8FF]/35
                  p-4
                  text-sm
                  leading-6
                  text-[#233D4D]
                "
              >
                This is a frontend preview.
                Login will become available when
                authentication is connected to the backend.
                You have not been signed in.
              </div>
            )}

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="
                flex
                min-h-[54px]
                w-full
                items-center
                justify-center
                rounded-xl
                bg-[#233D4D]
                px-6
                font-semibold
                text-white
                transition-[background-color,transform]
                duration-200
                hover:bg-[#34596F]
                active:scale-[0.99]
              "
            >
              Sign In
            </button>

            {/* MOBILE REGISTER LINK */}
            <p className="text-center text-sm text-[#3D3D3D]/65 lg:hidden">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-[#F87927]"
              >
                Register
              </Link>
            </p>
          </form>

          <p className="mt-7 text-center text-xs leading-5 text-[#3D3D3D]/50">
            Frontend preview — secure authentication
            is not yet connected.
          </p>
        </section>
      </div>
    </main>
  );
}

export default Login;