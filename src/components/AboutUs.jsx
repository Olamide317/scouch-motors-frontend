import aboutImage from "../assets/about/about-image.png";

function AboutUs() {
  return (
    <section
      id="about"
      className="w-full overflow-hidden bg-[#233D4D]"
    >
      <div
        className="
          mx-auto
          grid
          w-full
          max-w-[1728px]
          grid-cols-1
          lg:min-h-[934px]
          lg:grid-cols-[45.2%_54.8%]
        "
      >
        {/* LEFT: ABOUT CONTENT */}
        <div
          className="
            flex
            flex-col
            items-start
            justify-start
            px-5
            py-16
            sm:px-8
            lg:pr-8
            lg:pl-[9.7%]
            lg:pt-[clamp(150px,12.67vw,219px)]
            lg:pb-16
          "
        >
          {/* ABOUT HEADING */}
          <h2
            className="
              text-[30px]
              font-bold
              text-white
              sm:text-[34px]
              lg:text-[clamp(30px,2.08vw,36px)]
            "
          >
            About us
          </h2>

          {/* ABOUT DESCRIPTION */}
          <p
            className="
              mt-4
              max-w-[658px]
              text-base
              leading-relaxed
              font-normal
              text-white/90
              sm:text-xl
              lg:mt-[16px]
              lg:text-[clamp(18px,1.39vw,24px)]
            "
          >
            Lorem ipsum dolor sit amet consectetur.
            Faucibus sapien fringilla id sed et diam.
            Purus mattis at egestas quam in pellentesque eu.
            Quisque urna risus blandit lorem odio quam.
          </p>

          {/* LEARN MORE BUTTON */}
          <a
            href="#contact"
            className="
              mt-12
              flex
              h-[58px]
              w-[200px]
              items-center
              justify-center
              rounded-[15px]
              bg-[#C2E8FF]
              text-lg
              font-semibold
              text-[#233D4D]
              transition-colors
              hover:bg-white
              lg:mt-[clamp(65px,5.5vw,95px)]
              lg:h-[70px]
              lg:w-[260px]
              lg:text-[24px]
            "
          >
            Learn More
          </a>
        </div>

        {/* RIGHT: ABOUT IMAGE */}
        <div
          className="
            relative
            min-h-[340px]
            w-full
            overflow-hidden
            rounded-t-[30px]
            lg:min-h-[934px]
            lg:rounded-t-none
            lg:rounded-l-[30px]
          "
        >
          <img
            src={aboutImage}
            alt="Scouch Motors customer and vehicle"
            loading="lazy"
            decoding="async"
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
            "
          />
        </div>
      </div>
    </section>
  );
}

export default AboutUs;