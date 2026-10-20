import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Vehicles from "./components/Vehicles";
import WhatsAppButton from "./components/WhatsAppButton";
import OurServices from "./components/OurServices";
import AboutUs from "./components/AboutUs";
import ContactBanner from "./components/ContactBanner";
import VisitUs from "./components/VisitUs";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";

function App() {
  return (
    <div id="home" className="min-h-screen bg-white">
      <Navbar />

      <main>
        <Hero />
        <Vehicles />
        <OurServices />
        <AboutUs />
        <ContactBanner />
        <VisitUs />
        <ContactForm />
      </main>

      <Footer />

      <WhatsAppButton />
    </div>
  );
}

export default App;