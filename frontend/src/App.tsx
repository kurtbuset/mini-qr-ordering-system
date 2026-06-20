import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { useAuthInit } from "./hooks/useAuthInit";
import ToastContainer from "./components/ui/toast/ToastContainer";
import { ProtectedRoute } from "./components/auth/ProtectedRoutes";
import { CartProvider } from "./context/CartContext";
import { Role } from "./types/role";

// Lazy loaded components
const SignIn = lazy(() => import("./pages/AuthPages/SignIn"));
const SignUp = lazy(() => import("./pages/AuthPages/SignUp"));
const NotFound = lazy(() => import("./pages/OtherPage/NotFound"));
const UserProfiles = lazy(() => import("./pages/UserProfiles"));
const AppLayout = lazy(() => import("./layout/AppLayout"));
const Home = lazy(() => import("./pages/Dashboard/Home"));
const Products = lazy(() => import("./pages/Products/Products"));
const Orders = lazy(() => import("./pages/Orders/Orders"));
const GenerateQR = lazy(() => import("./pages/GenerateQR/GenerateQR"));
const AccountsManagement = lazy(
  () => import("./pages/Accounts/AccountsManagement"),
);

// Loading fallback component
const PageLoader = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
  </div>
);

export default function App() {
  useAuthInit();

  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        {/* authorized routes */}
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
      </Router>

      <ToastContainer />
    </CartProvider>
  );
}
