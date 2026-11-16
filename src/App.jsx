import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import VehicleDetails from "./pages/VehicleDetails";
import RentalBooking from "./pages/RentalBooking";
import Register from "./pages/Register";
import Login from "./pages/Login";
import RepairMaintenance from "./pages/RepairMaintenance";
import BrowseVehicles from "./pages/BrowseVehicles";
import NotFound from "./pages/NotFound";
import MyBookings from "./pages/MyBookings";
import PaymentResult from "./pages/PaymentResult";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <div className="min-h-screen bg-white">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/vehicles/:id" element={<VehicleDetails />} />

          <Route path="/vehicles/:id/book" element={<RentalBooking />} />

          <Route path="/services/repair" element={<RepairMaintenance />} />

          <Route path="/register" element={<Register />} />

          <Route path="/login" element={<Login />} />

          <Route path="/vehicles" element={<BrowseVehicles />} />

          <Route path="*" element={<NotFound />} />

          <Route path="/my-bookings" element={<MyBookings />} />

          <Route path="/payments/test/result" element={<PaymentResult />} />
        </Routes>

        <Footer />

        <WhatsAppButton />
      </div>
    </BrowserRouter>
  );
}

export default App;
