import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { useToast } from "../contexts/ToastContext"; // Import useToast

export default function RegisterPage() {
  const nav = useNavigate();
  const { showToast } = useToast(); // Get showToast function
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const validateForm = () => {
    const newErrors = {};
    if (!form.username) newErrors.username = "Username is required";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const register = async () => {
    setServerError("");
    if (!validateForm()) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    try {
      const res = await api.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("role", res.data.role);
      showToast("Registration successful!", "success"); // Success toast
      nav("/"); // Navigate to home or login after successful registration
    } catch (error) {
      console.error("Registration failed:", error);
      const errorMessage = error.response?.data || "Registration failed. Please try again.";
      setServerError(errorMessage);
      showToast(errorMessage, "error"); // Error toast
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Register</h1>
      {serverError && <p className="text-red-500 text-center mb-4">{serverError}</p>}
      <div className="mb-4">
        <input
          className={`border p-3 block w-full rounded-md ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
      </div>
      <div className="mb-6">
        <input
          className={`border p-3 block w-full rounded-md ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
      </div>
      <button
        onClick={register}
        className="bg-green-600 text-white px-5 py-3 rounded-md w-full hover:bg-green-700 transition-colors"
      >
        Create Account
      </button>
    </div>
  );
}