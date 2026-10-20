import aboutImage from "../assets/about/about-image.png";

function AboutUs() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="w-full bg-white"
    >
      {/* MAIN ABOUT SECTION */}
      <div
        className="
          relative
          mx-auto
          flex
          w-full
          max-w-[1728px]
          flex-col
          bg-[#233D4D]
          lg:h-[clamp(700px,55.85vw,965px)]
          lg:flex-row
        "
      >
        {/* LEFT: ABOUT CONTENT */}
        <div
          className="
            relative
            z-10
            flex
            w-full
            flex-col
            items-start
            px-6
            py-14
            sm:px-10
            lg:w-[45.2%]
            lg:px-0
            lg:pt-[clamp(155px,12.67vw,219px)]
            lg:pl-[4.4%]
            lg:pr-8
            lg:pb-0
          "
        >
          {/* HEADING */}
          <h2
            id="about-title"
            className="
              text-[28px]
              leading-[1.2]
              font-bold
              text-white
              sm:text-[32px]
              lg:text-[clamp(28px,2.08vw,36px)]
            "
          >
            About us
          </h2>

          {/* DESCRIPTION */}
          <p
            className="
              mt-4
              w-full
              max-w-[658px]
              text-base
              leading-[1.4]
              font-normal
              text-white/90
              sm:text-lg
              lg:text-[clamp(18px,1.39vw,24px)]
            "
          >
            Lorem ipsum dolor sit amet consectetur. Faucibus sapien
            fringilla id sed et diam. Purus mattis at egestas quam in
            pellentesque eu. Quisque urna risus blandit lorem odio quam.
          </p>

          {/* LEARN MORE BUTTON */}
          <a
            href="#contact"
            className="
              mt-14
              inline-flex
              h-[56px]
              w-[205px]
              shrink-0
              items-center
              justify-center
              rounded-[15px]
              bg-[#C2E8FF]
              px-5
              text-[18px]
              font-semibold
              text-[#233D4D]
              transition-colors
              duration-200
              hover:bg-white
              focus-visible:outline-2
              focus-visible:outline-offset-4
              focus-visible:outline-white
              sm:mt-16
              lg:mt-[clamp(100px,8.2vw,142px)]
              lg:h-[clamp(56px,4.05vw,70px)]
              lg:w-[clamp(205px,15.05vw,260px)]
              lg:text-[clamp(18px,1.39vw,24px)]
            "
          >
            Learn More
          </a>
        </div>

        {/* RIGHT: ABOUT IMAGE */}
        <div
          className="
            relative
            h-[420px]
            w-full
            shrink-0
            overflow-hidden
            rounded-none
            sm:h-[550px]
            lg:absolute
            lg:top-0
            lg:right-0
            lg:bottom-0
            lg:h-full
            lg:w-[54.8%]
            lg:rounded-[3px]
          "
        >
          <img
            src={aboutImage}
            alt="Scouch Motors representatives presenting a vehicle"
            loading="lazy"
            decoding="async"
            className="
              block
              h-full
              w-full
              object-cover
              object-[45%_center]
              lg:object-center
            "
          />
        </div>
      </div>
    </section>
  );
}

export default AboutUs;