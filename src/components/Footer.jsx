import brandImage from "../assets/footer/brand-image.png";

import facebookIcon from "../assets/footer/social-1.svg";
import instagramIcon from "../assets/footer/social-2.svg";
import twitterIcon from "../assets/footer/social-3.svg";

// FOOTER NAVIGATION
const pageLinks = [
  { label: "Home", href: "#home" },
  { label: "Vehicles", href: "#vehicles" },
  { label: "Our Services", href: "#services" },
  { label: "About Us", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const quickLinks = [
  { label: "Rent/24hrs", href: "#vehicles" },
  { label: "Repair", href: "#services" },
];

// SOCIAL MEDIA ICONS
const socialIcons = [
  {
    name: "Facebook",
    icon: facebookIcon,
  },
  {
    name: "Instagram",
    icon: instagramIcon,
  },
  {
    name: "Twitter",
    icon: twitterIcon,
  },
];

function Footer() {
  // Automatically returns the current year
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="
        relative
        isolate
        w-full
        overflow-hidden
        bg-[#233D4D]
        text-white
      "
    >
      {/* BACKGROUND GLOW */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          top-1/2
          left-1/2
          -z-10
          h-[480px]
          w-[850px]
          max-w-full
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[rgba(90,214,223,0.73)]
          blur-[200px]
        "
      />

      <div className="mx-auto w-full max-w-[1728px]">

        {/* MAIN FOOTER */}
        <div
          className="
            grid
            grid-cols-1
            gap-10
            px-6
            pt-10
            pb-10

            sm:grid-cols-2
            sm:px-10

            lg:min-h-[420px]
            lg:grid-cols-[minmax(0,2.6fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]
            lg:gap-8
            lg:px-[4.7%]
            lg:pt-[45px]
            lg:pb-8
          "
        >

          {/* COMPANY BRANDING */}
          <div className="flex flex-col items-start">

            {/* LOGO */}
            <img
              src={brandImage}
              alt="Scouch Motors Limited logo"
              loading="lazy"
              className="
                h-auto
                w-[130px]
                object-contain
                sm:w-[150px]
                lg:w-[160px]
              "
            />

            {/* COMPANY NAME */}
            <h2
              className="
                mt-4
                text-[21px]
                leading-tight
                font-extrabold
                lg:text-[24px]
              "
            >
              <span className="text-[#F87927]">
                Scouch
              </span>{" "}
              <span className="text-white">
                Motors Ltd
              </span>
            </h2>

            {/* SOCIAL MEDIA SECTION */}
            <div
              className="
                mt-12
                flex
                flex-wrap
                items-center
                gap-4
                lg:mt-auto
              "
            >

              {/* ICONS */}
              <div
                className="flex items-center gap-3"
                aria-label="Social media icons"
              >
                {socialIcons.map((social) => (
                  <div
                    key={social.name}
                    title={social.name}
                    className="
                      flex
                      h-[45px]
                      w-[45px]
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-[rgba(119,174,255,0.21)]
                      lg:h-[50px]
                      lg:w-[50px]
                    "
                  >
                    <img
                      src={social.icon}
                      alt={social.name}
                      className="
                        block
                        h-[25px]
                        w-[25px]
                        object-contain
                      "
                    />
                  </div>
                ))}
              </div>

              {/* SOCIAL HANDLE */}
              <p
                className="
                  text-base
                  font-medium
                  text-white
                  lg:text-[18px]
                "
              >
                @ Scouch Motors Ltd
              </p>

            </div>
          </div>

          {/* PAGES */}
          <nav aria-label="Footer pages">

            <h3
              className="
                text-[17px]
                font-bold
                text-white
                lg:text-[16px]
              "
            >
              Pages
            </h3>

            <ul className="mt-6 space-y-4 lg:space-y-3">

              {pageLinks.map((link) => (
                <li key={link.label}>

                  <a
                    href={link.href}
                    className="
                      text-[15px]
                      font-medium
                      text-white/75
                      transition-colors
                      hover:text-[#F87927]
                      focus-visible:outline-2
                      focus-visible:outline-offset-4
                      focus-visible:outline-white
                    "
                  >
                    {link.label}
                  </a>

                </li>
              ))}

            </ul>
          </nav>

          {/* QUICK LINKS */}
          <nav aria-label="Footer quick links">

            <h3
              className="
                text-[17px]
                font-bold
                text-white
                lg:text-[16px]
              "
            >
              Quick Links
            </h3>

            <ul className="mt-6 space-y-4 lg:space-y-3">

              {quickLinks.map((link) => (
                <li key={link.label}>

                  <a
                    href={link.href}
                    className="
                      text-[15px]
                      font-medium
                      text-white/75
                      transition-colors
                      hover:text-[#F87927]
                      focus-visible:outline-2
                      focus-visible:outline-offset-4
                      focus-visible:outline-white
                    "
                  >
                    {link.label}
                  </a>

                </li>
              ))}

            </ul>
          </nav>

          {/* OPENING HOURS */}
          <div>

            <h3
              className="
                text-[17px]
                font-bold
                text-white
                lg:text-[16px]
              "
            >
              Open Hours
            </h3>

            <div
              className="
                mt-6
                space-y-4
                text-[15px]
                leading-[1.5]
                font-medium
                text-white/75
              "
            >

              <p>
                Monday – Friday
                <span className="block">
                  10:00am – 4:00pm GMT
                </span>
              </p>

              <p>
                Saturday
                <span className="block">
                  9:00am – 5:00pm GMT
                </span>
              </p>

            </div>
          </div>

        </div>

        {/* DIVIDER */}
        <div
          className="
            h-px
            w-full
            bg-white/30
          "
        />

        {/* COPYRIGHT */}
        <div
          className="
            flex
            min-h-[95px]
            items-center
            justify-center
            px-5
            py-6
          "
        >

          <p
            className="
              text-center
              text-[14px]
              leading-relaxed
              font-normal
              text-white
              sm:text-[16px]
              lg:text-[18px]
            "
          >
            Copyright © {currentYear} Scouch Limited.
            {" "}All rights reserved.
          </p>

        </div>

      </div>
    </footer>
  );
}

export default Footer;