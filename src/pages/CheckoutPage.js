import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";
import { applyCoupon } from "../api";
import api from "../api"; // For checkout

export default function CheckoutPage() {
  const nav = useNavigate();
  const { cart, clearCart } = useCart();
  const { showToast } = useToast();
  const [address, setAddress] = useState({ street: "", city: "", state: "", zipCode: "", country: "" });
  const [shippingOption, setShippingOption] = useState("standard");
  const [couponCodeInput, setCouponCodeInput] = useState(""); // Input field for coupon
  const [appliedCouponCode, setAppliedCouponCode] = useState(null); // Stores the successfully applied coupon
  const [discount, setDiscount] = useState(0);
  const [addressErrors, setAddressErrors] = useState({});

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingCosts = { standard: 5, express: 15, pickup: 0 };
  const currentShippingCost = shippingCosts[shippingOption];
  const total = subtotal + currentShippingCost - discount;

  const validateAddress = () => {
    const errors = {};
    if (!address.street) errors.street = "Street is required";
    if (!address.city) errors.city = "City is required";
    if (!address.state) errors.state = "State/Province is required";
    if (!address.zipCode) errors.zipCode = "ZIP Code is required";
    if (!address.country) errors.country = "Country is required";
    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleApplyCoupon = async () => {
    if (!couponCodeInput) {
      showToast({ message: "Please enter a coupon code.", type: "warning" });
      return;
    }
    try {
      const res = await applyCoupon(couponCodeInput);
      setDiscount(res.data.discountAmount);
      setAppliedCouponCode(couponCodeInput);
      showToast({ message: 'Coupon applied successfully!', type: 'success' });
    } catch (error) {
      setDiscount(0);
      setAppliedCouponCode(null);
      showToast({ message: error.response?.data?.message || 'Invalid coupon code.', type: 'error' });
    }
  };

  const handleRemoveCoupon = () => {
    setDiscount(0);
    setAppliedCouponCode(null);
    setCouponCodeInput("");
    showToast({ message: 'Coupon removed.', type: 'info' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAddress()) {
      showToast({ message: "Please fill in all required address fields.", type: "warning" });
      return;
    }

    try {
      await api.post("/orders/checkout", {
        shippingAddress: address, // Changed to match backend expectation
        shippingOption,
        couponCode: appliedCouponCode, // Send applied coupon code
        totalAmount: total, // Send calculated total
        items: cart.map(item => ({ productId: item.product.id, quantity: item.quantity, price: item.product.price }))
      });
      clearCart();
      showToast({ message: "Order placed successfully!", type: "success" });
      nav("/profile?tab=orders");
    } catch (error) {
      showToast({ message: error.response?.data?.message || "Checkout failed. Please try again.", type: "error" });
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Side: Form */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            {/* Shipping Address */}
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Shipping Address</h2>
            <div className="space-y-4 mb-8">
              <div>
                <input className={`border p-3 w-full rounded-md ${addressErrors.street ? 'border-red-500' : 'border-gray-300'}`} placeholder="Street Address" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
                {addressErrors.street && <p className="text-red-500 text-sm mt-1">{addressErrors.street}</p>}
              </div>
              <div>
                <input className={`border p-3 w-full rounded-md ${addressErrors.city ? 'border-red-500' : 'border-gray-300'}`} placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                {addressErrors.city && <p className="text-red-500 text-sm mt-1">{addressErrors.city}</p>}
              </div>
              <div>
                <input className={`border p-3 w-full rounded-md ${addressErrors.state ? 'border-red-500' : 'border-gray-300'}`} placeholder="State/Province" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
                {addressErrors.state && <p className="text-red-500 text-sm mt-1">{addressErrors.state}</p>}
              </div>
              <div>
                <input className={`border p-3 w-full rounded-md ${addressErrors.zipCode ? 'border-red-500' : 'border-gray-300'}`} placeholder="ZIP Code" value={address.zipCode} onChange={(e) => setAddress({ ...address, zipCode: e.target.value })} />
                {addressErrors.zipCode && <p className="text-red-500 text-sm mt-1">{addressErrors.zipCode}</p>}
              </div>
              <div>
                <input className={`border p-3 w-full rounded-md ${addressErrors.country ? 'border-red-500' : 'border-gray-300'}`} placeholder="Country" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} />
                {addressErrors.country && <p className="text-red-500 text-sm mt-1">{addressErrors.country}</p>}
              </div>
            </div>

            {/* Shipping Options */}
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Shipping Options</h2>
            <div className="space-y-4 mb-8">
              <label className={`flex items-center border p-4 rounded-lg cursor-pointer transition-all ${shippingOption === 'standard' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                <input type="radio" name="shipping" value="standard" checked={shippingOption === 'standard'} onChange={(e) => setShippingOption(e.target.value)} className="mr-4 text-blue-600 focus:ring-blue-500"/>
                <div>
                  <p className="font-semibold">Standard Shipping</p>
                  <p className="text-sm text-gray-600">$5.00 (3-7 business days)</p>
                </div>
              </label>
              <label className={`flex items-center border p-4 rounded-lg cursor-pointer transition-all ${shippingOption === 'express' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                <input type="radio" name="shipping" value="express" checked={shippingOption === 'express'} onChange={(e) => setShippingOption(e.target.value)} className="mr-4 text-blue-600 focus:ring-blue-500"/>
                <div>
                  <p className="font-semibold">Express Shipping</p>
                  <p className="text-sm text-gray-600">$15.00 (1-2 business days)</p>
                </div>
              </label>
              <label className={`flex items-center border p-4 rounded-lg cursor-pointer transition-all ${shippingOption === 'pickup' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                <input type="radio" name="shipping" value="pickup" checked={shippingOption === 'pickup'} onChange={(e) => setShippingOption(e.target.value)} className="mr-4 text-blue-600 focus:ring-blue-500"/>
                <div>
                  <p className="font-semibold">Store Pickup</p>
                  <p className="text-sm text-gray-600">Free (Ready in 2-4 hours)</p>
                </div>
              </label>
            </div>
            
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition duration-300">Place Order</button>
          </form>
        </div>

        {/* Right Side: Summary */}
        <div className="bg-white p-8 rounded-lg shadow-md h-fit">
          <h2 className="text-2xl font-bold border-b pb-4 mb-4 text-gray-800">Order Summary</h2>
          {cart.length === 0 ? (
            <p className="text-gray-600">Your cart is empty.</p>
          ) : (
            cart.map(item => (
              <div key={item.product.id} className="flex justify-between items-center mb-2 text-gray-700">
                <p>{item.product.name} x {item.quantity}</p>
                <p>${(item.product.price * item.quantity).toFixed(2)}</p>
              </div>
            ))
          )}
          <div className="border-t pt-4 mt-4 space-y-2 text-gray-700">
            <div className="flex justify-between"><p>Subtotal:</p><p>${subtotal.toFixed(2)}</p></div>
            <div className="flex justify-between"><p>Shipping:</p><p>${currentShippingCost.toFixed(2)}</p></div>
            {discount > 0 && <div className="flex justify-between text-green-600"><p>Discount:</p><p>-${discount.toFixed(2)}</p></div>}
            <div className="flex justify-between font-bold text-xl pt-2 border-t mt-2 text-gray-800"><p>Total:</p><p>${total.toFixed(2)}</p></div>
          </div>
          <div className="mt-6">
            <h3 className="font-bold mb-2 text-gray-800">Promo Code</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCodeInput}
                onChange={(e) => setCouponCodeInput(e.target.value)}
                className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter code"
                disabled={!!appliedCouponCode}
              />
              {!appliedCouponCode ? (
                <button
                  onClick={handleApplyCoupon}
                  className="bg-gray-200 px-4 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
                  disabled={!couponCodeInput}
                >
                  Apply
                </button>
              ) : (
                <button
                  onClick={handleRemoveCoupon}
                  className="bg-red-500 text-white px-4 rounded-md hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
            {appliedCouponCode && (
              <p className="text-green-600 text-sm mt-2">Coupon '{appliedCouponCode}' applied! You saved ${discount.toFixed(2)}.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}