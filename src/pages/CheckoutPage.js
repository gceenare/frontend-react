import React, { useState } from "react";
import api from "../api"; // Corrected import path
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext"; // Import useToast

export default function CheckoutPage() {
  const nav = useNavigate();
  const { load } = useCart();
  const { showToast } = useToast(); // Get showToast function
  const [address, setAddress] = useState({ street: "", city: "", zip: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const validateForm = () => {
    const newErrors = {};
    if (!address.street) newErrors.street = "Street is required";
    if (!address.city) newErrors.city = "City is required";
    if (!address.zip) newErrors.zip = "ZIP code is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setServerError("");
    if (!validateForm()) {
      showToast("Please fill in all required address fields.", "error");
      return;
    }

    try {
      await api.post("/orders/checkout", address);
      load(); // Clear cart after successful checkout
      showToast("Order placed successfully!", "success"); // Success toast
      nav("/ordersuccess"); // Assuming an ordersuccess page exists
    } catch (error) {
      console.error("Checkout failed:", error);
      const errorMessage = error.response?.data || "Checkout failed. Please try again.";
      setServerError(errorMessage);
      showToast(errorMessage, "error"); // Error toast
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>
      {serverError && <p className="text-red-500 text-center mb-4">{serverError}</p>}
      <div className="mb-4">
        <input
          className={`border p-3 block w-full rounded-md ${errors.street ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Street"
          value={address.street}
          onChange={(e) => setAddress({ ...address, street: e.target.value })}
        />
        {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
      </div>
      <div className="mb-4">
        <input
          className={`border p-3 block w-full rounded-md ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="City"
          value={address.city}
          onChange={(e) => setAddress({ ...address, city: e.target.value })}
        />
        {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
      </div>
      <div className="mb-6">
        <input
          className={`border p-3 block w-full rounded-md ${errors.zip ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="ZIP"
          value={address.zip}
          onChange={(e) => setAddress({ ...address, zip: e.target.value })}
        />
        {errors.zip && <p className="text-red-500 text-sm mt-1">{errors.zip}</p>}
      </div>
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-5 py-3 rounded-md w-full hover:bg-blue-700 transition-colors"
      >
        Place Order
      </button>
    </div>
  );
}