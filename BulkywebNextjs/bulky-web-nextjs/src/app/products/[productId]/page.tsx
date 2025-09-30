"use client";
import { useEffect, useState } from "react";
import { useCart } from "@/app/context/CartContext";

export default function ProductDetails({ params }: { params: { productId: string } }) {
  const { productId } = params;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`https://localhost:7199/api/Home/details/${productId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch product");
        return res.json();
      })
      .then((data) => {
        setProduct(data.product || data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [productId]);

  const getImageUrl = (url: string | undefined) =>
    url
      ? url.startsWith("http")
        ? url
        : `https://localhost:7199${url.replace(/\\/g, "/")}`
      : "";

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <p className="text-gray-700 text-lg animate-pulse">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <p className="text-red-600 font-semibold text-lg">Error: {error}</p>
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <p className="text-gray-700 text-lg">No product found</p>
      </div>
    );

  return (
    <div className="min-h-screen flex justify-center items-center p-6 bg-gray-100 font-[Poppins]">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-5xl w-full grid md:grid-cols-2 gap-10 items-start">
        
        {product.imageUrl && (
          <img
            src={getImageUrl(product.imageUrl)}
            alt={product.title}
            className="w-full h-[400px] object-cover rounded-xl shadow-sm transition-transform duration-300 hover:scale-[1.02]"
          />
        )}

     
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {product.title}
          </h1>

          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Author:</span>{" "}
            {product.author || "N/A"}
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <span className="font-semibold">Description:</span>{" "}
            {product.description || "No description available"}
          </p>

          {/* <p className="text-gray-700 leading-relaxed mb-4">
            <span className="font-semibold">Category:</span>{" "}
            {product.category || "No description available"}
          </p> */}

          <p className="text-2xl font-bold text-emerald-700 mb-6">
            ${product.price}
          </p>

          <button
            onClick={() => addToCart(product)}
            className="self-start px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold shadow-sm transition-all duration-300 hover:bg-emerald-700 hover:-translate-y-0.5 hover:scale-105"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
