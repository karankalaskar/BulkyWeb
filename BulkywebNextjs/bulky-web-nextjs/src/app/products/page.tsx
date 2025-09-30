"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";
import { getToken, removeToken, getImageUrl } from "@/app/utils/auth";
import { useCartStore } from "@/store/useCartStore";  
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [authChecking, setAuthChecking] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const addToCart = useCartStore((state) => state.addToCart);  

  const handleLogout = () => {
    removeToken();
    router.replace("/login");
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    setAuthChecking(false);

    const fetchProducts = async () => {
      try {
        const res = await fetch("https://localhost:7199/api/Home/homepage", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch products");
        const data: Product[] = await res.json();
        const normalized = data.map((p) => ({
          ...p,
          imageUrl: getImageUrl(p.imageUrl),
        }));
        setProducts(normalized);
        setFilteredProducts(normalized);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [router]);

  useEffect(() => {
    if (!products) return;
    setFilteredProducts(
      products.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.author.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, products]);

  if (authChecking) {
    return (
      <div className="min-h-screen p-8 max-w-[1200px] mx-auto bg-gray-100">
         
        <Skeleton className="h-8 w-48 rounded-full bg-gray-300 animate-pulse" />
      </div>
    );
  }

  if (error)
    return (
      <p className="text-red-600 text-center font-bold mt-6">{error}</p>
    );

  return (
    <div className="p-8 font-[Poppins] max-w-[1200px] mx-auto min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-center text-4xl font-bold text-gray-800 tracking-wide">
          Product List
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          Logout
        </button>
      </div>

      <div className="mb-10 flex justify-center">
        <input
          type="text"
          placeholder="Search by title or author"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-8 justify-items-center">
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            className="relative rounded-xl p-5 w-full max-w-[250px] text-center bg-white shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            {p.imageUrl && (
              <img
                src={p.imageUrl}
                alt={p.title}
                className="w-full h-[180px] object-cover rounded-lg mb-3 transition-transform duration-300 hover:scale-105"
              />
            )}
            <h2 className="text-lg font-semibold text-gray-900 mt-2 mb-1">
              {p.title}
            </h2>
            <p className="text-gray-500 text-sm mb-2">by {p.author}</p>
            <p className="font-bold text-emerald-700 bg-emerald-100 inline-block px-3 py-1 rounded-md mb-4">
              ${p.price}
            </p>
            <div className="flex gap-3 justify-center">
              <Link
                href={`/products/${p.id}`}
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium shadow-sm transition-all duration-300 hover:bg-blue-700"
              >
                View
              </Link>
              <button
                onClick={() => addToCart(p)}  
                className="inline-block px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium shadow-sm transition-all duration-300 hover:bg-emerald-700"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
