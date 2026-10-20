import locationPreview from "../assets/contact/location-preview.png";

import locationIcon from "../assets/contact/icons/location.svg";
import emailIcon from "../assets/contact/icons/email.svg";
import phoneIcon from "../assets/contact/icons/phone.svg";
import clockIcon from "../assets/contact/icons/clock.svg";

const contactDetails = [
  {
    id: "address",
    icon: locationIcon,
    content: "15 Ezimgbu Link Road (Mommy B Road) GRA Phase 4 Portharcourt",
  },
  {
    id: "email",
    icon: emailIcon,
    content: "info@scouchlimited.com",
    href: "mailto:info@scouchlimited.com",
  },
  {
    id: "phone",
    icon: phoneIcon,
    content: "+234 803 547 0559, +234 (0) 803 261 1750",
  },
];

function VisitUs() {
  return (
    <section
      aria-labelledby="visit-us-title"
      className="w-full bg-white py-8 lg:pb-[20px] lg:pt-[10px]"
    >
      <div
        className="
          mx-auto
          grid
          w-full
          max-w-[1728px]
          grid-cols-1
          items-start
          gap-12
          px-5
          sm:px-8
          lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]
lg:gap-[clamp(24px,3vw,50px)]
          lg:px-[4.7%]
        "
      >
        {/* LEFT: CONTACT INFORMATION */}
        <div className="flex min-w-0 flex-col items-start lg:pt-[25px]">
          {/* HEADING */}
          <h2
            id="visit-us-title"
            className="
              text-[30px]
              leading-tight
              font-extrabold
              text-[#233D4D]
              sm:text-[34px]
              lg:text-[clamp(28px,2.08vw,36px)]
            "
          >
            Visit us today
          </h2>

          {/* CONTACT DETAILS */}
          <div
            className="
              mt-10
              flex
              w-full
              flex-col
              gap-7
              lg:mt-[45px]
              lg:gap-[clamp(24px,2.4vw,40px)]
            "
          >
            {contactDetails.map((detail) => (
              <div key={detail.id} className="flex min-w-0 items-start gap-4">
                <img
                  src={detail.icon}
                  alt=""
                  aria-hidden="true"
                  className="mt-1 h-[25px] w-[25px] shrink-0 object-contain"
                />

                {detail.href ? (
                  <a
                    href={detail.href}
                    className="
                      min-w-0
                      text-base
                      leading-[1.4]
                      font-medium
                      text-[#3D3D3D]/80
                      transition-colors
                      hover:text-[#F87927]
                      sm:text-lg
                      lg:text-[clamp(17px,1.39vw,24px)]
                    "
                  >
                    {detail.content}
                  </a>
                ) : (
                  <p
                    className="
                      min-w-0
                      text-base
                      leading-[1.4]
                      font-medium
                      text-[#3D3D3D]/80
                      sm:text-lg
                      lg:text-[clamp(17px,1.39vw,24px)]
                    "
                  >
                    {detail.content}
                  </p>
                )}
              </div>
            ))}

            {/* OPENING HOURS */}
            <div className="flex min-w-0 items-start gap-4">
              <img
                src={clockIcon}
                alt=""
                aria-hidden="true"
                className="mt-1 h-[25px] w-[25px] shrink-0 object-contain"
              />

              <div
                className="
                  min-w-0
                  text-base
                  leading-[1.4]
                  font-medium
                  text-[#3D3D3D]/80
                  sm:text-lg
                  lg:text-[clamp(17px,1.39vw,24px)]
                "
              >
                <h3 className="font-bold text-[#3D3D3D]">Opening hours:</h3>

                <p>Monday – Friday: 10:00am – 4:00pm GMT</p>

                <p>Saturday: 9:00am – 5:00pm GMT</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: LOCATION MAP */}
        <div className="relative aspect-[793/598] w-full min-w-0 lg:w-[108%]">
          <img
            src={locationPreview}
            alt="Map showing the Port Harcourt area"
            loading="lazy"
            decoding="async"
            className="
      block
      h-full
      w-full
      rounded-[25px]
      object-cover
    "
          />

          {/* LOCATION CONTROL */}
          <div
            aria-hidden="true"
            className="
      pointer-events-none
      absolute
      top-[4.5%]
      right-[5%]
      z-10
      flex
      h-[42px]
      w-[42px]
      items-center
      justify-center
      rounded-full
      bg-[#233D4D]/45
      sm:h-[50px]
      sm:w-[50px]
      lg:h-[55px]
      lg:w-[55px]
    "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-[55%] w-[55%]"
            >
              <path d="M8 3H6a3 3 0 0 0-3 3v2" />
              <path d="M16 3h2a3 3 0 0 1 3 3v2" />
              <path d="M3 16v2a3 3 0 0 0 3 3h2" />
              <path d="M21 16v2a3 3 0 0 1-3 3h-2" />
              <circle cx="12" cy="12" r="3.5" />
              <circle cx="12" cy="12" r="1" fill="white" stroke="none" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

export default VisitUs;
