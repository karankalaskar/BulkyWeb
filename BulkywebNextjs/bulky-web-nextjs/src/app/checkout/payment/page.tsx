"use client";
import { useCartStore } from "@/store/useCartStore"; // ✅ use zustand store
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentPage() {
  const cart = useCartStore((state) => state.cart);      // ✅ read cart from zustand
  const clearCart = useCartStore((state) => state.clearCart);
  const router = useRouter();
  const [shipping, setShipping] = useState<any>(null);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    const saved = localStorage.getItem("shipping");
    if (saved) setShipping(JSON.parse(saved));
    else router.replace("/checkout/shipping"); // redirect if no shipping
  }, [router]);

  const handlePayment = () => {
    console.log("Order placed:", { shipping, cart, total });
    clearCart();
    localStorage.removeItem("shipping");
    router.push("/checkout/success");
  };

  if (!shipping) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center font-[Poppins]">
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl font-bold mb-8 text-center text-emerald-700">
          Payment
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
           
          <div className="bg-white text-gray-900 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-emerald-700">
              Shipping Details
            </h2>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Name:</span> {shipping.fullName}</p>
              <p><span className="font-medium">Address:</span> {shipping.address}, {shipping.city}</p>
              <p><span className="font-medium">Postal Code:</span> {shipping.postalCode}</p>
              <p><span className="font-medium">Country:</span> {shipping.country}</p>
              <p><span className="font-medium">Phone:</span> {shipping.phone}</p>
            </div>
          </div>

           
          <div className="bg-white text-gray-900 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-emerald-700">
              Order Summary
            </h2>
            <ul className="divide-y divide-gray-200 mb-4 text-sm">
              {cart.map((item) => (
                <li key={item.id} className="flex justify-between items-center py-2">
                  <span>
                    {item.title}{" "}
                    <span className="text-gray-500">x{item.quantity}</span>
                  </span>
                  <span className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-lg font-bold text-right mb-6">
              Total: ${total.toFixed(2)}
            </p>

            <button
              onClick={handlePayment}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl shadow-md transition duration-300"
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
