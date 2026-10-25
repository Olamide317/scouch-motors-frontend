import prado from "../assets/hero/prado.png";
import bookCarIcon from "../assets/hero/book-car.svg";
import ratesIcon from "../assets/hero/rates.svg";
import roadPath from "../assets/hero/road-path.svg";
import roadMarkings from "../assets/hero/road-markings.svg";

function Hero() {
  return (
    <section id="hero" className="relative w-full overflow-hidden bg-white">
      {/* ========================================
          DESKTOP HERO - FIGMA PROPORTIONS
          Original design width: 1728px
      ======================================== */}

      <div className="@container relative mx-auto hidden aspect-[1728/930] w-full max-w-[1728px] lg:block">
        {/* ROAD BACKGROUND */}
        <img
          src={roadPath}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute top-[56.56%] left-[-8.565%] z-0 block h-auto w-[113.66%] max-w-none"
        />

        {/* ROAD MARKINGS */}
        <img
          src={roadMarkings}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute top-[68%] left-[-4.05%] z-10 block h-auto w-[73.29%] max-w-none"
        />

        {/* HERO HEADING */}
        <div className="absolute top-[20.43%] left-[4.05%] z-20 w-[41.38%]">
          <h1 className="font-black leading-[1.2] tracking-normal text-body-text text-[3.704cqw]">
            <span className="block whitespace-nowrap">
              Reliable <span className="text-secondary">Car Rentals</span>
            </span>

            <span className="block whitespace-nowrap">at Great Rates</span>
          </h1>
        </div>

        {/* HERO DESCRIPTION */}
        <p className="absolute top-[39.14%] left-[4.05%] z-20 w-[41.38%] text-[1.389cqw] leading-[1.2] font-semibold text-body-text/85">
          Choose from our wide selection of economy, luxury, and SUV vehicles
          for any trip, big or small.
        </p>

        {/* HERO BUTTONS */}
        <div className="absolute top-[53.44%] left-[4.05%] z-30 flex items-center gap-[1.736cqw]">
          {/* BOOK A CAR */}
          <a
            href="#vehicles"
            className="flex h-[4.051cqw] w-[13.31cqw] items-center justify-center gap-[0.52cqw] rounded-[0.868cqw] bg-secondary font-semibold text-white text-[1.389cqw] transition-opacity hover:opacity-90"
          >
            <img
              src={bookCarIcon}
              alt=""
              className="h-[1.389cqw] w-[1.157cqw] shrink-0 object-contain"
            />

            <span className="whitespace-nowrap">Book A Car</span>
          </a>

          {/* CHECK RATES */}
          <a
            href="#vehicles"
            className="flex h-[4.051cqw] w-[13.31cqw] items-center justify-center gap-[0.58cqw] rounded-[0.868cqw] bg-light-gray font-semibold text-body-text text-[1.389cqw] transition-colors hover:bg-gray-300"
          >
            <img
              src={ratesIcon}
              alt=""
              className="h-[1.389cqw] w-[1.389cqw] shrink-0 object-contain"
            />

            <span className="whitespace-nowrap">Check Rates</span>
          </a>
        </div>

        {/* TOYOTA PRADO */}
        <div className="pointer-events-none absolute top-[10.75%] left-[47.57%] z-20 w-[56.08%]">
          <img
            src={prado}
            alt="Toyota Prado SUV"
            className="block h-auto w-full"
          />
        </div>
      </div>

      {/* ========================================
          MOBILE HERO
          Responsive adaptation
      ======================================== */}

      <div className="relative flex w-full flex-col lg:hidden">
        {/* MOBILE HERO TEXT */}
        <div className="relative z-20 px-5 pt-10 sm:px-8 sm:pt-12">
          <h1 className="max-w-[650px] text-[36px] leading-[1.2] font-black tracking-tight text-body-text sm:text-[48px]">
            Reliable <span className="text-secondary">Car Rentals</span> at
            Great Rates
          </h1>

          <p className="mt-5 max-w-[600px] text-base leading-relaxed font-semibold text-body-text/85 sm:text-lg">
            Choose from our wide selection of economy, luxury, and SUV vehicles
            for any trip, big or small.
          </p>

          {/* MOBILE BUTTONS */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-5">
            <a
              href="#vehicles"
              className="flex min-h-[54px] items-center justify-center gap-3 rounded-xl bg-secondary px-6 text-base font-semibold text-white transition-opacity hover:opacity-90"
            >
              <img
                src={bookCarIcon}
                alt=""
                className="h-5 w-5 object-contain"
              />
              Book A Car
            </a>

            <a
              href="#vehicles"
              className="flex min-h-[54px] items-center justify-center gap-3 rounded-xl bg-light-gray px-6 text-base font-semibold text-body-text transition-colors hover:bg-gray-300"
            >
              <img
                src={ratesIcon}
                alt=""
                className="h-5 w-5 object-contain"
              />
              Check Rates
            </a>
          </div>
        </div>

        {/* MOBILE CAR AND ROAD */}
        <div className="relative mt-2 aspect-[6/5] w-full overflow-hidden sm:mt-3 sm:aspect-[16/9]">
          {/* ROAD */}
          <img
            src={roadPath}
            alt=""
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              bottom-0
              left-1/2
              z-0
              w-[135%]
              max-w-none
              -translate-x-1/2
              sm:w-[120%]
            "
          />

          {/* ROAD MARKINGS */}
          <img
            src={roadMarkings}
            alt=""
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              bottom-[10%]
              left-1/2
              z-10
              w-[100%]
              max-w-none
              -translate-x-1/2
            "
          />

          {/* TOYOTA PRADO — SMALLER ON MOBILE */}
          <img
            src={prado}
            alt="Toyota Prado SUV"
            className="
              pointer-events-none
              absolute
              bottom-[6%]
              left-1/2
              z-20
              w-[76%]
              max-w-none
              -translate-x-1/2
              object-contain
              sm:bottom-[7%]
              sm:w-[70%]
            "
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;