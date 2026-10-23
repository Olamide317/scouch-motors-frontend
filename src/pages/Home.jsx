import Hero from "../components/Hero";
import Vehicles from "../components/Vehicles";
import OurServices from "../components/OurServices";
import AboutUs from "../components/AboutUs";
import ContactBanner from "../components/ContactBanner";
import VisitUs from "../components/VisitUs";
import ContactForm from "../components/ContactForm";

function Home() {
  return (
    <main>
      <section id="home">
        <Hero />
      </section>

      <section id="vehicles">
        <Vehicles />
      </section>

      <section id="services">
        <OurServices />
      </section>

      <section id="about">
        <AboutUs />
      </section>

      <ContactBanner />

      <VisitUs />

      <section id="contact">
        <ContactForm />
      </section>
    </main>
  );
}

export default Home;
