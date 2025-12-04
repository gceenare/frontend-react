import React, { useEffect } from "react";
import { useCart } from "../contexts/CartContext";
import { Link } from "react-router-dom";

export default function CartPage() {
  const { cart, updateCart, removeFromCart, load } = useCart();

  useEffect(() => {
    load();
  }, [load]);

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Your Cart</h1>
        {cart.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-xl text-gray-600">Your cart is empty.</p>
            <Link to="/" className="inline-block mt-6 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center gap-6 border-b py-4 last:border-b-0">
                  <img src={item.product.imageUrl} alt={item.product.name} className="w-24 h-24 object-cover rounded-lg" />
                  <div className="flex-grow">
                    <h2 className="text-lg font-semibold text-gray-800">{item.product.name}</h2>
                    <p className="text-gray-600">${item.product.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      value={item.quantity}
                      className="border rounded-lg px-3 py-1 w-20 text-center"
                      onChange={(e) => updateCart(item.product.id, Math.max(0, Number(e.target.value)))}
                      min="0"
                    />
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-red-500 hover:text-red-700 font-semibold transition duration-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Box */}
            <div className="bg-white p-8 rounded-lg shadow-md h-fit">
              <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-4">Summary</h2>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-800">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-6">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold text-gray-800">Free</span>
              </div>
              <div className="flex justify-between font-bold text-xl border-t pt-4">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <Link to="/checkout" className="block w-full text-center mt-6 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}