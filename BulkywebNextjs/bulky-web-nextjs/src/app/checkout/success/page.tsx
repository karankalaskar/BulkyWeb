"use client";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-700 text-white">
      <div className="text-center p-6 bg-green-800 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4">🎉 Order Successful!</h1>
        <p className="text-lg mb-6">Thank you for your purchase.</p>

        <button
          onClick={() => router.push("/products")}
          className="bg-white text-green-800 font-semibold px-6 py-2 rounded hover:bg-gray-100 transition"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}
