import React from "react";
import { Link } from "react-router";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-screen bg-white dark:bg-gray-900">
      {/* Left Side - Form */}
      <div className="flex flex-col w-full lg:w-1/2">
        {/* Logo at top left */}
        <div className="p-6 sm:p-8 lg:p-12">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="bg-brand-500 rounded-lg p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Mini QR Ordering
            </span>
          </Link>
        </div>

        {/* Form Content */}
        <div className="flex items-center justify-center flex-1 p-6 sm:p-8 lg:p-12">
          {children}
        </div>
      </div>

      {/* Right Side - Image (Exactly 50%) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-50 dark:bg-gray-800 items-center justify-center">
        <div className="relative w-full h-full">
          <img
            src="http://localhost:5000/images/hamburger.jpg"
            alt="Delicious Food"
            className="object-cover w-full h-full shadow-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <h2 className="text-3xl font-bold mb-2">
              Delicious Food, Quick Orders
            </h2>
            <p className="text-lg text-white/90">
              Scan, Order, Enjoy - Your favorite meals just got easier
            </p>
          </div>
        </div>
      </div>

      {/* Theme Toggle */}
      <div className="fixed z-50 bottom-6 right-6">
        <ThemeTogglerTwo />
      </div>
    </div>
  );
}
