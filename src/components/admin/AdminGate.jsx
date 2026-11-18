import {
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";

import {
  Link,
  Navigate,
  Outlet,
} from "react-router-dom";

import {
  apiRequest,
  getAccessToken,
  subscribeToAuthChanges,
} from "../../services/api";

function AdminGate() {
  const token = useSyncExternalStore(
    subscribeToAuthChanges,
    getAccessToken
  );

  const [access, setAccess] = useState({
    token: null,
    status: "checking",
    message: "",
  });

  useEffect(() => {
    if (!token) return;

    let active = true;

    async function checkAccess() {
      try {
        const result = await apiRequest(
          "/api/auth/admin-check",
          { authenticated: true }
        );

        if (!active) return;

        setAccess({
          token,
          status:
            result?.success === true
              ? "allowed"
              : "denied",
          message: "",
        });
      } catch (error) {
        if (!active) return;

        setAccess({
          token,
          status: "denied",
          message:
            error.message ||
            "Unable to verify administrator access.",
        });
      }
    }

    checkAccess();

    return () => {
      active = false;
    };
  }, [token]);

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: "/admin" }}
      />
    );
  }

  if (
    access.token !== token ||
    access.status === "checking"
  ) {
    return (
      <main
        role="status"
        className="flex min-h-screen items-center justify-center bg-[#F7F8FA] px-5"
      >
        <p className="text-[#233D4D]">
          Verifying administrator access...
        </p>
      </main>
    );
  }

  if (access.status !== "allowed") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F8FA] px-5">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-[#233D4D]">
            Admin Access Unavailable
          </h1>

          <p role="alert" className="mt-4 text-sm leading-7 text-[#3D3D3D]">
            {access.message ||
              "This account does not have administrator access."}
          </p>

          <Link
            to="/"
            className="mt-6 inline-flex rounded-xl bg-[#233D4D] px-6 py-3 font-semibold text-white"
          >
            Return to Website
          </Link>
        </div>
      </main>
    );
  }

  return <Outlet />;
}

export default AdminGate;