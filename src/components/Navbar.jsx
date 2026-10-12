
import { useState } from "react";

import phoneIcon from "../assets/icons/phone.svg";
import emailIcon from "../assets/icons/email.svg";
import searchIcon from "../assets/icons/search.svg";
import profileIcon from "../assets/icons/profile.svg";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Vehicles", href: "#vehicles" },
  { name: "Our services", href: "#services" },
  { name: "About Us", href: "#about" },
  { name: "Contact", href: "#contact" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="w-full font-sans">
      {/* DESKTOP CONTACT STRIP */}
      <div className="hidden min-h-[65px] items-center bg-white px-5 lg:flex lg:px-[5.2%]">
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-5 lg:gap-12">
            <a
              href="tel:+2348035470559"
              className="flex items-center gap-[6px] text-sm text-body-text 2xl:text-xl"
            >
              <img
                src={phoneIcon}
                alt=""
                className="h-[23px] w-[22px]"
              />
              <span>+234 8035470559</span>
            </a>

            <a
              href="mailto:info@scouchlimited.com"
              className="flex items-center gap-[6px] text-sm text-body-text 2xl:text-xl"
            >
              <img
                src={emailIcon}
                alt=""
                className="h-[22px] w-[26px]"
              />
              <span>Info@scouchlimited.com</span>
            </a>
          </div>

          <a
            href="#contact"
            className="flex min-h-[40px] shrink-0 items-center justify-center rounded-[5px] bg-secondary px-4 text-center text-sm font-extrabold text-white transition-opacity hover:opacity-90 2xl:w-[260px] 2xl:text-xl"
          >
            Book An Appointment
          </a>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <nav className="bg-primary px-5 lg:px-[4.05%]">
        <div className="flex h-[76px] w-full items-center justify-between gap-4 lg:h-[100px] 2xl:gap-6">
          {/* BRAND */}
          <a
            href="#home"
            onClick={closeMenu}
            className="shrink-0 whitespace-nowrap text-xl font-extrabold text-white sm:text-2xl lg:text-xl 2xl:text-2xl"
          >
            <span className="text-secondary">Scouch</span>
            {" Motors Ltd"}
          </a>

          {/* DESKTOP SEARCH */}
          <div className="hidden h-[60px] min-w-0 max-w-[320px] flex-1 items-center gap-4 rounded-[25px] bg-white/25 px-4 xl:flex 2xl:max-w-[420px]">
            <img
              src={searchIcon}
              alt=""
              className="h-[25px] w-[25px] shrink-0"
            />

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for a car"
              aria-label="Search for a car"
              className="w-full min-w-0 bg-transparent text-base text-white outline-none placeholder:text-white 2xl:text-xl"
            />
          </div>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden shrink-0 items-center gap-4 xl:flex 2xl:gap-5">
            {navLinks.map((link, index) => (
              <a
                key={link.name}
                href={link.href}
                className={`whitespace-nowrap text-base transition-colors 2xl:text-xl ${
                  index === 0
                    ? "font-bold text-secondary underline underline-offset-4"
                    : "font-medium text-white hover:text-secondary"
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* DESKTOP PROFILE ICON */}
          <div className="hidden shrink-0 xl:block">
            <img
              src={profileIcon}
              alt="Profile"
              className="h-12 w-12 2xl:h-[54px] 2xl:w-[54px]"
            />
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
            {navLinks.map((link, index) => (
              <a
                key={link.name}
                href={link.href}
                onClick={closeMenu}
                className={`rounded-md px-3 py-3 text-base transition-colors hover:bg-white/10 ${
                  index === 0
                    ? "font-bold text-secondary"
                    : "font-medium text-white"
                }`}
              >
                {link.name}
              </a>
            ))}

            {/* MOBILE CONTACT INFORMATION */}
            <div className="mt-3 flex flex-col gap-4 border-t border-white/20 px-3 pt-5 text-sm text-white">
              <a
                href="tel:+2348035470559"
                className="flex items-center gap-3"
              >
                <img
                  src={phoneIcon}
                  alt=""
                  className="h-5 w-5 shrink-0"
                />
                <span>+234 8035470559</span>
              </a>

              <a
                href="mailto:info@scouchlimited.com"
                className="flex items-center gap-3"
              >
                <img
                  src={emailIcon}
                  alt=""
                  className="h-5 w-5 shrink-0"
                />
                <span className="break-all">
                  Info@scouchlimited.com
                </span>
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* MOBILE SEARCH AND APPOINTMENT SECTION */}
      <div className="bg-white px-5 py-5 lg:px-[4.05%] xl:hidden">
        <div className="mx-auto flex max-w-xl flex-col gap-3 sm:flex-row">
          {/* MOBILE SEARCH */}
          <div className="flex min-h-[48px] min-w-0 flex-1 items-center gap-3 rounded-xl border border-light-gray bg-[#F5F6F7] px-4">
            <img
              src={searchIcon}
              alt=""
              className="h-5 w-5 shrink-0"
            />

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for a car"
              aria-label="Search for a car"
              className="w-full min-w-0 bg-transparent text-sm text-primary outline-none placeholder:text-gray-500"
            />
          </div>

          {/* MOBILE APPOINTMENT BUTTON */}
          <a
            href="#contact"
            className="flex min-h-[48px] shrink-0 items-center justify-center rounded-lg bg-secondary px-5 py-3 text-center text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            Book An Appointment
          </a>
        </div>
      </div>
    </header>
  );
}

export default Navbar;