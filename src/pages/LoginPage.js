import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext"; // Import useToast

export default function LoginPage() {
  const nav = useNavigate();
  const { load } = useCart();
  const { showToast } = useToast(); // Get showToast function
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const validateForm = () => {
    const newErrors = {};
    if (!username) newErrors.username = "Username is required";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const login = async () => {
    setServerError("");
    if (!validateForm()) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    try {
      const res = await api.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("role", res.data.role); // Store role
      load();
      showToast("Logged in successfully!", "success"); // Success toast
      nav("/");
    } catch (error) {
      console.error("Login failed:", error);
      const errorMessage = error.response?.data || "Login failed. Please try again.";
      setServerError(errorMessage);
      showToast(errorMessage, "error"); // Error toast
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
      {serverError && <p className="text-red-500 text-center mb-4">{serverError}</p>}
      <div className="mb-4">
        <input
          className={`border p-3 block w-full rounded-md ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
      </div>
      <div className="mb-6">
        <input
          className={`border p-3 block w-full rounded-md ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
      </div>
      <button
        onClick={login}
        className="bg-blue-600 text-white px-5 py-3 rounded-md w-full hover:bg-blue-700 transition-colors"
      >
        Login
      </button>
    </div>
  );
}