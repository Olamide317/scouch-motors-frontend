import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import businessSettings, { getPhoneUrl } from "../config/businessSettings";

import phoneIcon from "../assets/icons/phone.svg";
import emailIcon from "../assets/icons/email.svg";
import searchIcon from "../assets/icons/search.svg";
import profileIcon from "../assets/icons/profile.svg";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Vehicles", href: "/vehicles" },
  { name: "Our services", href: "/#services" },
  { name: "About Us", href: "/#about" },
  { name: "Contact", href: "/#contact" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [accountOpen, setAccountOpen] = useState(false);
  const accountMenuRef = useRef(null);

  useEffect(() => {
    if (!accountOpen) return;

    function handleClickOutside(event) {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target)
      ) {
        setAccountOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setAccountOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [accountOpen]);

  const { contact } = businessSettings;

  const closeMenu = () => setMenuOpen(false);

  const location = useLocation();

  function isActiveLink(link) {
    const { pathname, hash } = location;

    switch (link.name) {
      case "Home":
        return pathname === "/" && (!hash || hash === "#home");

      case "Vehicles":
        return (
          pathname === "/vehicles" ||
          pathname.startsWith("/vehicles/") ||
          (pathname === "/" && hash === "#vehicles")
        );

      case "Our services":
        return hash === "#services" || pathname.startsWith("/services/");

      case "About Us":
        return pathname === "/" && hash === "#about";

      case "Contact":
        return pathname === "/" && hash === "#contact";

      default:
        return false;
    }
  }

  const navigate = useNavigate();

  function handleNavbarSearch(event) {
    event.preventDefault();

    const query = search.trim();

    if (query) {
      navigate(`/vehicles?q=${encodeURIComponent(query)}`);
    } else {
      navigate("/vehicles");
    }

    setMenuOpen(false);
    setAccountOpen(false);
  }

  return (
    <header className="w-full font-sans">
      {/* DESKTOP CONTACT STRIP */}
      <div className="hidden h-[65px] items-center bg-white px-5 lg:flex lg:px-[5.2%]">
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-5 lg:gap-12">
            <a
              href={getPhoneUrl(contact.phone)}
              className="flex items-center gap-[6px] text-sm text-body-text 2xl:text-xl"
            >
              <img src={phoneIcon} alt="" className="h-[23px] w-[22px]" />
              <span>{contact.phone}</span>
            </a>

            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-[6px] text-sm text-body-text 2xl:text-xl"
            >
              <img src={emailIcon} alt="" className="h-[22px] w-[26px]" />
              <span>{contact.email}</span>
            </a>
          </div>

          <Link
            to="/#contact"
            className="flex min-h-[40px] shrink-0 items-center justify-center rounded-[5px] bg-secondary px-4 text-center text-sm font-extrabold text-white transition-opacity hover:opacity-90 2xl:w-[260px] 2xl:text-xl"
          >
            Book An Appointment
          </Link>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <nav className="bg-primary px-5 lg:px-[4.05%]">
        <div className="flex h-[76px] w-full items-center justify-between gap-4 lg:h-[100px] 2xl:gap-6">
          {/* BRAND */}
          <Link
            to="/"
            onClick={closeMenu}
            className="shrink-0 whitespace-nowrap text-xl font-extrabold text-white sm:text-2xl lg:text-xl 2xl:text-2xl"
          >
            <span className="text-secondary">Scouch</span>
            {" Motors Ltd"}
          </Link>

          {/* DESKTOP SEARCH */}
          <form
            onSubmit={handleNavbarSearch}
            role="search"
            className="hidden h-[60px] min-w-0 max-w-[320px] flex-1 items-center gap-4 rounded-[25px] bg-white/25 px-4 xl:flex 2xl:max-w-[420px]"
          >
            <button
              type="submit"
              aria-label="Search vehicles"
              className="flex shrink-0 items-center justify-center"
            >
              <img src={searchIcon} alt="" className="h-[25px] w-[25px]" />
            </button>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search for a car"
              aria-label="Search for a car"
              className="w-full min-w-0 bg-transparent text-base text-white outline-none placeholder:text-white 2xl:text-xl"
            />
            {/* CLEAR SEARCH */}
            {search.trim() !== "" && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                title="Clear search"
                className="
      flex
      h-8
      w-8
      shrink-0
      items-center
      justify-center
      rounded-full
      text-xl
      font-medium
      text-white/75
      transition-colors
      hover:bg-white/10
      hover:text-white
      focus-visible:outline-2
      focus-visible:outline-white
    "
              >
                &times;
              </button>
            )}
          </form>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden shrink-0 items-center gap-4 xl:flex 2xl:gap-5">
            {navLinks.map((link) => {
              const isActive = isActiveLink(link);

              return (
                <Link
                  key={link.name}
                  to={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`whitespace-nowrap text-base transition-colors 2xl:text-xl ${
                    isActive
                      ? "font-bold text-secondary underline underline-offset-4"
                      : "font-medium text-white hover:text-secondary"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* DESKTOP ACCOUNT MENU — INSIDE MAIN NAVBAR */}
          <div ref={accountMenuRef} className="relative hidden shrink-0 xl:block">
            <button
              type="button"
              onClick={() => setAccountOpen((prev) => !prev)}
              aria-label="Account menu"
              aria-expanded={accountOpen}
              aria-controls="desktop-account-menu"
              className="
                flex items-center justify-center
                rounded-full
                transition-transform
                hover:scale-105
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-[#F87927]
              "
            >
              <img
                src={profileIcon}
                alt=""
                className="h-12 w-12 2xl:h-[54px] 2xl:w-[54px]"
              />
            </button>

            {accountOpen && (
              <div
                id="desktop-account-menu"
                className="
                  absolute
                  right-0
                  top-full
                  z-50
                  mt-3
                  w-[210px]
                  overflow-hidden
                  rounded-xl
                  border
                  border-[#EAECF0]
                  bg-white
                  p-2
                  shadow-[0_12px_35px_rgba(35,61,77,0.15)]
                "
              >
                <Link
                  to="/login"
                  onClick={() => setAccountOpen(false)}
                  className="
                    block rounded-lg px-4 py-3
                    text-sm font-semibold text-[#233D4D]
                    transition-colors hover:bg-[#EAECF0]
                  "
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setAccountOpen(false)}
                  className="
                    mt-1 block rounded-lg px-4 py-3
                    text-sm font-semibold text-[#233D4D]
                    transition-colors hover:bg-[#EAECF0]
                  "
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            className="ml-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-3xl text-white transition-colors hover:bg-white/10 xl:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* MOBILE NAVIGATION MENU */}
        {menuOpen && (
          <div
            id="mobile-navigation"
            className="flex flex-col gap-1 border-t border-white/20 py-4 xl:hidden"
          >
            {navLinks.map((link) => {
              const isActive = isActiveLink(link);

              return (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={closeMenu}
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-md px-3 py-3 text-base transition-colors hover:bg-white/10 ${
                    isActive
                      ? "font-bold text-secondary"
                      : "font-medium text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* MOBILE ACCOUNT LINKS */}
            <div className="mt-3 border-t border-white/20 pt-3">
              <Link
                to="/login"
                onClick={closeMenu}
                className="
                  block rounded-md px-3 py-3
                  text-base font-medium text-white
                  transition-colors hover:bg-white/10
                "
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={closeMenu}
                className="
                  block rounded-md px-3 py-3
                  text-base font-semibold text-[#F87927]
                  transition-colors hover:bg-white/10
                "
              >
                Create Account
              </Link>
            </div>

            {/* MOBILE CONTACT INFORMATION */}
            <div className="mt-3 flex flex-col gap-4 border-t border-white/20 px-3 pt-5 text-sm text-white">
              <a href="tel:+2348035470559" className="flex items-center gap-3">
                <img src={phoneIcon} alt="" className="h-5 w-5 shrink-0" />
                <span>+234 8035470559</span>
              </a>

              <a
                href="mailto:info@scouchlimited.com"
                className="flex items-center gap-3"
              >
                <img src={emailIcon} alt="" className="h-5 w-5 shrink-0" />
                <span className="break-all">Info@scouchlimited.com</span>
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* MOBILE SEARCH AND APPOINTMENT SECTION */}
      <div className="bg-white px-5 py-5 lg:px-[4.05%] xl:hidden">
        <div className="mx-auto flex max-w-xl flex-col gap-3 sm:flex-row">
          {/* MOBILE SEARCH */}
          <form
            onSubmit={handleNavbarSearch}
            role="search"
            className="flex min-h-[48px] min-w-0 flex-1 items-center gap-3 rounded-xl border border-light-gray bg-[#F5F6F7] px-4"
          >
            <button
              type="submit"
              aria-label="Search vehicles"
              className="flex shrink-0 items-center justify-center"
            >
              <img src={searchIcon} alt="" className="h-5 w-5" />
            </button>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search for a car"
              aria-label="Search for a car"
              className="w-full min-w-0 bg-transparent text-sm text-primary outline-none placeholder:text-gray-500"
            />
            {/* CLEAR MOBILE SEARCH */}
            {search.trim() !== "" && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                title="Clear search"
                className="
      flex
      h-8
      w-8
      shrink-0
      items-center
      justify-center
      rounded-full
      text-xl
      text-[#233D4D]/60
      transition-colors
      hover:bg-[#233D4D]/10
      hover:text-[#233D4D]
      focus-visible:outline-2
      focus-visible:outline-[#F87927]
    "
              >
                &times;
              </button>
            )}
          </form>

          {/* MOBILE APPOINTMENT BUTTON */}
          <Link
            to="/#contact"
            className="flex min-h-[48px] shrink-0 items-center justify-center rounded-lg bg-secondary px-5 py-3 text-center text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            Book An Appointment
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
