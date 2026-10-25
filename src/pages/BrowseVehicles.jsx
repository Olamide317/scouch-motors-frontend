import Vehicles from "../components/Vehicles";

function BrowseVehicles() {
  return (
    <main className="min-h-screen bg-white">
      {/* PAGE INTRODUCTION */}
      <section className="bg-[#233D4D] px-5 py-14 text-white sm:px-8 lg:px-[4.05%] lg:py-20">
        <div className="mx-auto max-w-[1400px]">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#C2E8FF]">
            SCOUCH MOTORS FLEET
          </p>

          <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            Browse Our Vehicles
          </h1>

          <p className="mt-5 max-w-[650px] text-base leading-8 text-white/75">
            Explore our collection of self-drive rental
            vehicles. Search, compare options, and find
            a vehicle that suits your journey.
          </p>
        </div>
      </section>

      {/* FULL VEHICLE INVENTORY */}
      <Vehicles browseMode />
    </main>
  );
}

export default BrowseVehicles;