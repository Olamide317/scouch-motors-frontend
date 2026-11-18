import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

import { clearAccessToken } from "../../services/api";

function AdminLayout() {
  const navigate = useNavigate();

  function handleSignOut() {
    clearAccessToken();
    navigate("/", { replace: true });
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] md:flex">
      <aside className="flex flex-col bg-[#233D4D] px-5 py-6 text-white md:min-h-screen md:w-[260px] md:shrink-0 md:px-6">
        <Link
          to="/admin"
          className="text-xl font-extrabold"
        >
          <span className="text-[#F87927]">
            Scouch
          </span>
          {" Admin"}
        </Link>

        <p className="mt-2 text-xs text-white/60">
          Management Dashboard
        </p>

        <nav
          aria-label="Administrator navigation"
          className="mt-8 space-y-2"
        >
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-[#F87927] text-white"
                  : "text-white/80 hover:bg-white/10"
              }`
            }
          >
            <LayoutDashboard size={19} />
            Overview
          </NavLink>

          <Link
            to="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/80 hover:bg-white/10"
          >
            <ArrowLeft size={19} />
            View Website
          </Link>
        </nav>

        <div className="mt-8 border-t border-white/20 pt-6 md:mt-auto">
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-white hover:bg-white/10"
          >
            <LogOut size={19} />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="border-b border-[#EAECF0] bg-white px-5 py-5 sm:px-8">
          <div className="mx-auto max-w-[1400px]">
            <p className="text-sm font-semibold text-[#F87927]">
              Scouch Motors Ltd
            </p>

            <p className="mt-1 text-sm text-[#3D3D3D]/65">
              Administrator Workspace
            </p>
          </div>
        </header>

        <main className="mx-auto max-w-[1460px] p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;