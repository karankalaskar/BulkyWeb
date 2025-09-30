"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserRole } from "./utils/auth";

// Fonts
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<string | null>(null);

  const checkUserRole = () => {
    const userRole = getUserRole();
    setRole(userRole);
  };

  useEffect(() => {
    checkUserRole();

    const handleAuthChange = () => checkUserRole();

    // Listen to login/logout across tabs + same tab
    window.addEventListener("authChanged", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("authChanged", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        <CartProvider>
          <header className="bg-[#0a2540] text-white shadow-md">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
              <Link
                href="/products"
                className="text-2xl font-bold tracking-wide hover:text-[#ffb703] transition"
              >
                MyStore
              </Link>

              <nav className="flex gap-6 text-sm font-medium items-center">
                <Link href="/products" className="hover:text-[#ffb703] transition">
                  Products
                </Link>

                <Link
                  href="/cart"
                  className="hover:text-[#ffb703] transition flex items-center"
                >
                  <ShoppingCart size={22} strokeWidth={2} />
                </Link>

                {/* ✅ Show dashboard link only if user is Admin */}
                {role === "Admin" && (
                  <Link href="/dashboard" className="hover:text-[#ffb703] transition">
                    Dashboard
                  </Link>
                )}
              </nav>
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>

          <Toaster position="top-right" />
        </CartProvider>
      </body>
    </html>
  );
}
