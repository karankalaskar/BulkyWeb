"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ShippingPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (!form.fullName || !form.phone || !form.address) {
      alert("Please fill required fields");
      return;
    }
    localStorage.setItem("shipping", JSON.stringify(form));
    router.push("/checkout/payment");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6 font-[Poppins]">
      <div className="w-full max-w-2xl bg-white text-gray-900 rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-2 text-center text-emerald-700">
          Shipping Details
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Please provide your delivery information
        </p>

        <div className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">Phone *</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium mb-1">Address *</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              required
            />
          </div>

          {/* City, Postal, Country */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <input
                type="text"
                name="country"
                value={form.country}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleNext}
          className="mt-8 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl shadow-md transition duration-300"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
}
