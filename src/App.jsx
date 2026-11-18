import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";

import AdminGate from "./components/admin/AdminGate";
import AdminLayout from "./components/admin/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminEnquiries from "./pages/admin/AdminEnquiries";
import AdminBookings from "./pages/admin/AdminBookings";

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

function PublicLayout() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Outlet />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        {/* CUSTOMER WEBSITE */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/vehicles" element={<BrowseVehicles />} />
          <Route path="/vehicles/:id" element={<VehicleDetails />} />
          <Route path="/vehicles/:id/book" element={<RentalBooking />} />
          <Route path="/services/repair" element={<RepairMaintenance />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />

          <Route path="/payments/test/result" element={<PaymentResult />} />

          <Route path="*" element={<NotFound />} />
        </Route>

        {/* ADMINISTRATOR WORKSPACE */}
        <Route path="/admin" element={<AdminGate />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />

            <Route path="enquiries" element={<AdminEnquiries />} />

            <Route path="bookings" element={<AdminBookings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
