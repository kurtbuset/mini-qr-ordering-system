import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import { useAuthInit } from "./hooks/useAuthInit";
import ToastContainer from "./components/ui/toast/ToastContainer";
import { ProtectedRoute } from "./components/auth/ProtectedRoutes";
import Products from "./pages/Products/Products";
import { CartProvider } from "./context/CartContext";
import Orders from "./pages/Orders/Orders";
import GenerateQR from "./pages/GenerateQR/GenerateQR";
import SignUp from "./pages/AuthPages/SignUp";
import AccountsManagement from "./pages/Accounts/AccountsManagement";
import { Role } from "./types/role";

export default function App() {
  useAuthInit();

  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        {/* authorized routes */}
        <Routes>
          {/* Dashboard Layout */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            {/* Home - All authenticated users */}
            <Route index path="/" element={<Home />} />

            {/* Profile - All authenticated users */}
            <Route path="/profile" element={<UserProfiles />} />

            <Route path="/orders" element={<Orders />} />

            <Route path="/generate-qr" element={<GenerateQR />} />

            {/* Accounts Management - Admin only */}
            <Route
              path="/accounts"
              element={
                <ProtectedRoute roles={[Role.Admin]}>
                  <AccountsManagement />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="/products" element={<Products />} />

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>

      <ToastContainer />
    </CartProvider>
  );
}
