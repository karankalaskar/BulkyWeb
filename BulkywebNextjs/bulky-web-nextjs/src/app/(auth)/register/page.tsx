"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { RegisterDto } from "@/types/auth";
// import styles from "@/styles/Register.module.css"; // import CSS module
import styles from "../../styles/Register.module.css"

export default function RegisterPage() {
    const [formData, setFormData] = useState<RegisterDto>({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        streetAddress: "",
        city: "",
        state: "",
        postalCode: "",
        phoneNumber: "",
        role: "Customer",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch("https://localhost:7199/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                Swal.fire({
                    title: "User Registered Successfully!",
                    icon: "success",
                    draggable: true,
                    confirmButtonText: "OK",
                });

                setFormData({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    streetAddress: "",
                    city: "",
                    state: "",
                    postalCode: "",
                    phoneNumber: "",
                    role: "Customer",
                });
            } else {
                Swal.fire({
                    title: "Registration Failed",
                    icon: "error",
                    draggable: true,
                    confirmButtonText: "OK",
                });
            }
        } catch (err) {
            Swal.fire({
                title: "Error",
                text: "Unable to reach the server",
                icon: "error",
                draggable: true,
                confirmButtonText: "OK",
            });
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1>Create Account</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        className={styles.formInput}
                    />
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className={styles.formInput}
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className={styles.formInput}
                    />
                    <input
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={styles.formInput}
                    />
                    <input
                        name="streetAddress"
                        placeholder="Street Address"
                        value={formData.streetAddress}
                        onChange={handleChange}
                        className={styles.formInput}
                    />
                    <input
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleChange}
                        className={styles.formInput}
                    />
                    <input
                        name="state"
                        placeholder="State"
                        value={formData.state}
                        onChange={handleChange}
                        className={styles.formInput}
                    />
                    <input
                        name="postalCode"
                        placeholder="Postal Code"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className={styles.formInput}
                    />
                    <input
                        name="phoneNumber"
                        placeholder="Phone Number"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className={styles.formInput}
                    />
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className={styles.selectInput}
                    >
                        <option value="Customer">Customer</option>
                        <option value="Admin">Admin</option>
                    </select>

                    <button type="submit" className={styles.submitBtn}>
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}
