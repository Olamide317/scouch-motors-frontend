import Hero from "../components/Hero";
import Vehicles from "../components/Vehicles";
import OurServices from "../components/OurServices";
import AboutUs from "../components/AboutUs";
import ContactBanner from "../components/ContactBanner";
import VisitUs from "../components/VisitUs";
import ContactForm from "../components/ContactForm";

function Home() {
  return (
    <main id="home">
      {/* HOMEPAGE HERO */}
      <Hero />

      {/* FEATURED VEHICLES */}
      <Vehicles featured />

      {/* OUR SERVICES */}
      <OurServices />

      {/* ABOUT US */}
      <AboutUs />

      {/* CONTACT SECTION */}
      <ContactBanner />

      {/* VISIT US */}
      <VisitUs />

      {/* CONTACT FORM */}
      <ContactForm />
    </main>
  );
}

export default Home;