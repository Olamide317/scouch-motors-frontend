import carRental from "../assets/services/car-rental.png";
import carRepair from "../assets/services/car-repair.png";

const services = [
  {
    id: "rental",
    image: carRental,
    title: "Rent",
    highlight: "24/7",
    alt: "Vehicles available through Scouch Motors rental services",
    imagePosition: "center",
  },
  {
    id: "repair",
    image: carRepair,
    title: "Repair/Maintenance",
    alt: "Car repair and maintenance services",
    imagePosition: "center",
  },
];

function OurServices() {
  return (
    <section
      id="services"
      className="
        w-full
        bg-[#EAECF0]
        pt-16
        pb-16
        sm:pt-20
        sm:pb-20
        lg:pt-[clamp(64px,5.04vw,87px)]
        lg:pb-[clamp(64px,4.98vw,86px)]
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[1728px]
          px-5
          sm:px-8
          lg:px-[4.57%]
        "
      >
        {/* SECTION HEADING */}
        <h2
          className="
            text-center
            text-[28px]
            leading-tight
            font-bold
            text-[#3D3D3D]
            sm:text-[32px]
            lg:text-[35px]
          "
        >
          Our Services
        </h2>

        {/* SECTION DESCRIPTION */}
        <p
          className="
            mx-auto
            mt-4
            max-w-[830px]
            2xl:max-w-[1054px]
            text-center
            text-base
            leading-[1.3]
            font-normal
            text-[#3D3D3D]/90
            sm:text-xl
            lg:text-[clamp(22px,1.74vw,30px)]
          "
        >
          Lorem ipsum dolor sit amet consectetur.
          Faucibus sapien fringilla id sed et diam.
          Purus mattis at egestas quam in pellentesque eu.
          Quisque urna risus blandit lorem odio quam.
        </p>

        {/* SERVICE CARDS */}
        <div
          className="
            mt-10
            grid
            grid-cols-1
            gap-6
            md:grid-cols-2
            lg:mt-[clamp(55px,5.5vw,95px)]
            lg:gap-[clamp(24px,7.52vw,130px)]
          "
        >
          {services.map((service) => (
            <article
              key={service.id}
              className="
                group
                relative
                aspect-[720/367]
                w-full
                overflow-hidden
                rounded-[25px]
                bg-white
              "
            >
              {/* ORIGINAL FIGMA IMAGE */}
              <img
                src={service.image}
                alt={service.alt}
                loading="lazy"
                decoding="async"
                className="
                  absolute
                  inset-0
                  h-full
                  w-full
                  object-cover
                "
                style={{
                  objectPosition: service.imagePosition,
                }}
              />

              {/* FIGMA DARK GRADIENT */}
              <div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  inset-x-0
                  bottom-0
                  h-[51.5%]
                  bg-gradient-to-b
                  from-transparent
                  to-black/[0.88]
                  backdrop-blur-[1px]
                "
              />

              {/* SERVICE TITLE */}
              <h3
                className="
                  absolute
                  bottom-[8%]
                  left-[3.6%]
                  z-10
                  text-[clamp(17px,2vw,32px)]
                  leading-tight
                  font-bold
                  text-white
                "
              >
                {service.title}

                {service.highlight && (
                  <>
                    <span className="text-white"> / </span>

                    <span
                      className="
                        font-semibold
                        text-[#74F827]
                      "
                    >
                      {service.highlight}
                    </span>
                  </>
                )}
              </h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default OurServices;