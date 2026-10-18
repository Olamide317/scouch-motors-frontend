import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Vehicles from "./components/Vehicles";
import WhatsAppButton from "./components/WhatsAppButton";
import OurServices from "./components/OurServices";

function App() {
  return (
    <div id="home" className="min-h-screen bg-white">
      <Navbar />

      <main>
        <Hero />
        <Vehicles />
        <OurServices />
      </main>

      <WhatsAppButton />
    </div>
  );
}

export default App;