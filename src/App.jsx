import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Vehicles from "./components/Vehicles";
import WhatsAppButton from "./components/WhatsAppButton";

function App() {
  return (
    <div id="home" className="min-h-screen bg-white">
      <Navbar />

      <main>
        <Hero />
        <Vehicles />
      </main>

      <WhatsAppButton />
    </div>
  );
}

export default App;