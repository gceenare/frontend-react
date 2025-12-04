import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";
import { useAuth } from "../contexts/AuthContext"; // Import useAuth

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { load: loadCart } = useCart();
  const { showToast } = useToast();
  const { login } = useAuth(); // Get login function from AuthContext

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/"; // Redirect path after login

  const validateForm = () => {
    const newErrors = {};
    if (!username) newErrors.username = "Username is required";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    setServerError("");
    if (!validateForm()) {
      showToast({ message: "Please fill in all required fields.", type: "error" });
      return;
    }

    setLoading(true);
    const success = await login(username, password);
    setLoading(false);

    if (success) {
      loadCart(); // Load cart after successful login
      navigate(from, { replace: true }); // Redirect to previous page or home
    } else {
      // Error message is already shown by AuthContext's showToast
      setServerError("Login failed. Please check your credentials."); // Generic message
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
      {serverError && <p className="text-red-500 text-center mb-4">{serverError}</p>}
      <div className="mb-4">
        <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Username</label>
        <input
          id="username"
          className={`border p-3 block w-full rounded-md ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
        />
        {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
      </div>
      <div className="mb-6">
        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
        <input
          id="password"
          className={`border p-3 block w-full rounded-md ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Enter your password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
      </div>
      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-5 py-3 rounded-md w-full hover:bg-blue-700 transition-colors disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
      <p className="mt-4 text-center text-gray-600">
        Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register here</Link>
      </p>
    </div>
  );
}