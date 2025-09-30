"use client";

import { useCartStore } from "@/store/useCartStore"; // ✅ Zustand store
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getToken } from "@/app/utils/auth"; // ✅ correct path

export default function CartPage() {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCartStore(); // ✅ Zustand hook
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const router = useRouter();

  // ✅ Protect this page: redirect if not logged in
  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="p-6 min-h-screen bg-gray-100 font-[Poppins]">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
        Your Cart
      </h1>

      {cart.length === 0 ? (
        <p className="text-center text-gray-600 mt-10 text-lg">
          No items in your cart.
        </p>
      ) : (
        <>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cart.map((item) => (
              <li
                key={item.id}
                className="flex flex-col items-center bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-28 h-28 object-cover rounded-md mb-3"
                />
                <p className="font-semibold text-gray-900 text-center mb-1">
                  {item.title}
                </p>
                <p className="text-gray-500 text-sm mb-2">
                  ${item.price.toFixed(2)}
                </p>

                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="bg-gray-200 text-gray-800 px-2 py-1 rounded hover:bg-gray-300 disabled:opacity-50"
                    disabled={item.quantity === 1}
                  >
                    -
                  </button>
                  <span className="text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="bg-gray-200 text-gray-800 px-2 py-1 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>

                <p className="text-emerald-600 font-bold text-sm mb-3">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-10 text-center">
            <p className="text-2xl font-bold text-gray-900 mb-4">
              Total: ${total.toFixed(2)}
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={clearCart}
                className="bg-gray-700 hover:bg-gray-800 text-white px-5 py-2 rounded-lg font-medium transition"
              >
                Clear Cart
              </button>
              <button
                onClick={() => router.push("/checkout/shipping")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition"
              >
                Buy Now
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
