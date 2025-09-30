"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  PieChart,
  Pie,
  Label,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { getToken } from "../utils/auth";
import { TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

import { ChartContainer } from "@/components/ui/chart";
import { LayoutDashboard } from "lucide-react";

interface ProductDto {
  id: number;
  title: string;
  category: string;
  price: number;
  quantityAvailable: number;
  quantitySold: number;
  revenue: number;
  imageUrl: string;
  status: string;
  soldPercentage: number;
}

export default function DashboardPage() {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<ProductDto[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      const token = getToken();
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const roles =
          payload.role ||
          payload.roles ||
          payload[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ];

        let isAdmin = false;
        if (roles) {
          if (Array.isArray(roles)) isAdmin = roles.includes("Admin");
          else isAdmin = roles === "Admin";
        }

        if (!isAdmin) {
          router.replace("/products");
          return;
        }
      } catch {
        router.replace("/login");
        return;
      }

      try {
        const res = await fetch(
          "https://localhost:7199/api/Dashboard/products?page=1&pageSize=200",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.status === 401) {
          router.replace("/login");
          return;
        }

        const data = await res.json();
        setProducts(data.items);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [router]);

  // Group products by category
  const categoryCounts = products.reduce(
    (acc: Record<string, number>, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    },
    {}
  );

  const chartData = Object.entries(categoryCounts).map(
    ([category, count]) => ({
      name: category,
      value: count,
    })
  );

  const total = chartData.reduce((acc, item) => acc + item.value, 0);

  const handleSegmentClick = (segmentName: string) => {
    setSelectedSegment(segmentName);
    const filtered = products.filter((p) => p.category === segmentName);
    setSelectedProducts(filtered);
  };

  if (loading) return <p>Loading dashboard...</p>;
  if (products.length === 0) return <p>No products available.</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <LayoutDashboard className="h-6 w-6 text-blue-600" />
        Admin Dashboard
      </h1>

      {/* Donut Chart */}

      
      <Card className="flex flex-col max-w-md">
        <CardHeader className="items-center pb-0">
          <CardTitle>Products by Category</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pb-0">

          <ChartContainer

            config={{}}
            className="mx-auto aspect-square max-h-[300px] w-full"
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  onClick={(data) => handleSegmentClick(data.name)}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={[
                        "#3b82f6",
                        "#10b981",
                        "#f59e0b",
                        "#ef4444",
                        "#8b5cf6",
                      ][index % 5]}
                    />
                  ))}
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-2xl font-bold"
                            >
                              {total}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 20}
                              className="fill-muted-foreground text-sm"
                            >
                              Products
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ResponsiveContainer>

          </ChartContainer>

        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium">
            Trending up <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground">
            Distribution of products across categories
          </div>
        </CardFooter>
      </Card>

      {selectedSegment && (
        <Card>
          
          <CardHeader>
            <CardTitle>{selectedSegment} Products</CardTitle>
          </CardHeader>

          <CardContent>
            {selectedProducts.length > 0 ? (
              <table className="w-full border-collapse border text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Title</th>
                    <th className="p-2 border">Category</th>
                    <th className="p-2 border">Price</th>
                    <th className="p-2 border">Stock</th>
                    <th className="p-2 border">Sold</th>
                    <th className="p-2 border">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProducts.map((p) => (
                    <tr key={p.id} className="text-center">
                      <td className="p-2 border">{p.title}</td>
                      <td className="p-2 border">{p.category}</td>
                      <td className="p-2 border">${p.price}</td>
                      <td className="p-2 border">{p.quantityAvailable}</td>
                      <td className="p-2 border">{p.quantitySold}</td>
                      <td className="p-2 border">{p.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No products found in {selectedSegment}.</p>
            )}
          </CardContent>

        </Card>
      )}
    </div>
  );
}
