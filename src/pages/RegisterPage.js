import React, { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import { useAuth } from "../contexts/AuthContext"; // Import useAuth

export default function RegisterPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { login } = useAuth(); // Use login from AuthContext after registration
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!form.username) newErrors.username = "Username is required";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    setServerError("");
    if (!validateForm()) {
      showToast({ message: "Please fill in all required fields.", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/register", form);
      // After successful registration, automatically log in the user
      const success = await login(form.username, form.password);
      if (success) {
        showToast({ message: "Registration successful! You are now logged in.", type: "success" });
        navigate("/"); // Navigate to home after successful registration and login
      } else {
        // This case should ideally not happen if login is successful after register
        setServerError("Registration successful, but automatic login failed.");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
      setServerError(errorMessage);
      showToast({ message: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Register</h1>
      {serverError && <p className="text-red-500 text-center mb-4">{serverError}</p>}
      <div className="mb-4">
        <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Username</label>
        <input
          id="username"
          className={`border p-3 block w-full rounded-md ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Choose a username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          disabled={loading}
        />
        {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
      </div>
      <div className="mb-6">
        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
        <input
          id="password"
          className={`border p-3 block w-full rounded-md ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Choose a password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          disabled={loading}
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
      </div>
      <button
        onClick={handleRegister}
        className="bg-green-600 text-white px-5 py-3 rounded-md w-full hover:bg-green-700 transition-colors disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Registering...' : 'Create Account'}
      </button>
      <p className="mt-4 text-center text-gray-600">
        Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login here</Link>
      </p>
    </div>
  );
}