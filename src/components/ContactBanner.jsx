import contactCar from "../assets/contact/contact-car.png";
import businessSettings from "../config/businessSettings";

import facebookIcon from "../assets/contact/icons/facebook.svg";
import instagramIcon from "../assets/contact/icons/instagram.svg";
import twitterIcon from "../assets/contact/icons/twitter.svg";

const socialIcons = [
  {
    name: "Facebook",
    icon: facebookIcon,
    settingsKey: "facebook",
  },
  {
    name: "Instagram",
    icon: instagramIcon,
    settingsKey: "instagram",
  },
  {
    name: "Twitter",
    icon: twitterIcon,
    settingsKey: "twitter",
  },
];

function ContactBanner() {
  const activeSocials = socialIcons.filter((social) => {
    const settings = businessSettings.socialMedia?.[social.settingsKey];

    if (!settings?.enabled || !settings.url) {
      return false;
    }

    try {
      return new URL(settings.url).protocol === "https:";
    } catch {
      return false;
    }
  });

  return (
    <section
      id="contact"
      className="w-full bg-white px-5 pt-12 pb-4 sm:px-8 lg:px-[4.05%] lg:pt-16 lg:pb-8"
    >
      {/* MAIN BANNER CONTAINER */}
      <div
        className="
          relative
          mx-auto
          w-full
          max-w-[1400px]
          lg:h-[400px]
        "
      >
        {/* BACKGROUND PANEL - DESKTOP */}
        <div
          aria-hidden="true"
          className="
            absolute
            top-[10%]
            right-0
            bottom-[10%]
            left-[20%]
            hidden
            rounded-[50px]
            bg-[#EAECF0]
            lg:block
          "
        />

        {/* MOBILE BACKGROUND */}
        <div
          className="
            relative
            overflow-hidden
            rounded-[30px]
            bg-[#EAECF0]
            lg:static
            lg:overflow-visible
            lg:rounded-none
            lg:bg-transparent
          "
        >
          {/* SUV IMAGE */}
          <div
            className="
    relative
    z-10
    flex
    w-full
    items-center
    justify-center
    px-4
    pt-10
    sm:px-8
    lg:absolute
    lg:top-1/2
    lg:left-0
    lg:w-[49%]
    lg:-translate-y-1/2
    lg:px-0
    lg:pt-0
  "
          >
            {/* GROUND SHADOW */}
            <div
              aria-hidden="true"
              className="
      pointer-events-none
      absolute
      bottom-[7%]
      left-[12%]
      z-0
      h-[12%]
      w-[76%]
      rounded-full
      bg-black/35
      blur-[22px]
      lg:bottom-[5%]
      lg:blur-[28px]
    "
            />

            {/* VEHICLE */}
            <img
              src={contactCar}
              alt="Toyota SUV"
              loading="lazy"
              decoding="async"
              className="
      relative
      z-10
      block
      h-auto
      w-full
      object-contain
      lg:scale-[1]
    "
            />
          </div>

          {/* CONTACT INFORMATION */}
          <div
            className="
              relative
              z-20
              flex
              flex-col
              items-start
              px-6
              py-10
              sm:px-10
              lg:ml-auto
              lg:h-[440px]
              lg:w-[44%]
              lg:justify-center
              lg:px-0
              lg:py-0
              lg:pr-6
            "
          >
            {/* HEADING */}
            <h2
              className="
                text-[28px]
                leading-tight
                font-semibold
                text-[#233D4D]
                sm:text-[30px]
                lg:text-[32px]
              "
            >
              Contact Us
            </h2>

            {/* DESCRIPTION */}
            <p
              className="
                mt-3
                max-w-[474px]
                text-base
                leading-[1.4]
                font-semibold
                text-[#233D4D]/50
                sm:text-xl
                lg:text-[clamp(16px,1.4vw,20px)]
              "
            >
              Lorem ipsum dolor sit amet consectetur. Congue dictum ipsum sit
              massa id sed.
            </p>

            {/* SOCIAL MEDIA */}
            {activeSocials.length > 0 && (
              <div
                className="
      mt-8
      flex
      flex-wrap
      items-center
      gap-3
      lg:mt-[50px]
      lg:gap-5
    "
              >
                <div className="flex items-center gap-3 lg:gap-4">
                  {activeSocials.map((social) => (
                    <a
                      key={social.name}
                      href={
                        businessSettings.socialMedia[social.settingsKey].url
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit Scouch Motors on ${social.name}`}
                      className="
            flex
            h-[48px]
            w-[48px]
            shrink-0
            items-center
            justify-center
            overflow-hidden
            rounded-full
            transition-transform
            duration-200
            hover:scale-105
            focus-visible:outline-2
            focus-visible:outline-offset-4
            focus-visible:outline-[#F87927]
            lg:h-[60px]
            lg:w-[60px]
          "
                    >
                      <img
                        src={social.icon}
                        alt=""
                        aria-hidden="true"
                        className="block h-full w-full object-contain"
                      />
                    </a>
                  ))}
                </div>

                <span
                  className="
        whitespace-nowrap
        text-base
        font-medium
        text-[#233D4D]/80
        sm:text-lg
        lg:text-[clamp(16px,1.4vw,22px)]
      "
                >
                  @ {businessSettings.companyName}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactBanner;
