"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { LoginDto, LoginResponse } from "@/types/auth";
import { setToken } from "@/app/utils/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [formData, setFormData] = useState<LoginDto>({ email: "", password: "" });
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch("https://localhost:7199/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                const data: LoginResponse = await res.json();
                setToken(data.token);

                // await Swal.fire({
                //     title: "Login Successful",
                //     icon: "success",
                //     draggable: true,
                //     confirmButtonText: "OK",
                // });
                try {
                    const payload = JSON.parse(atob(data.token.split(".")[1]));
                    console.log("🔑 JWT Payload:", payload);
                } catch (err) {
                    console.error("Failed to decode token", err);
                }

                router.push("/products");
            } else {
                const error = await res.json();
                await Swal.fire({
                    title: "Login Failed",
                    text: error.message || "Invalid credentials",
                    icon: "error",
                    draggable: true,
                    confirmButtonText: "OK",
                });
            }
        } catch (err) {
            await Swal.fire({
                title: "Error",
                text: "Unable to reach server",
                icon: "error",
                draggable: true,
                confirmButtonText: "OK",
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
                <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
                    Welcome Back
                </h1>
                <p className="text-center text-gray-500 mb-6">
                    Enter your credentials to access your account
                </p>
                <form onSubmit={handleSubmit} className="grid gap-5">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        value={formData.email}
                        className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        value={formData.password}
                        className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 hover:scale-105 transition-transform duration-200 shadow-md"
                    >
                        Login
                    </button>
                </form>
                <div className="text-center mt-6">
                    <p className="text-gray-500 text-sm">
                        Don't have an account?{" "}
                        <a href="/register" className="text-blue-600 hover:underline">
                            Sign Up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
