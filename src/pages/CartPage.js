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
    <div>
      <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item.product.id} className="flex items-center gap-6 border-b py-4">
              <img src={item.product.imageUrl} alt={item.product.name} className="w-20" />
              <div>
                <p>{item.product.name}</p>
                <p>${item.product.price}</p>
              </div>
              <input
                type="number"
                value={item.quantity}
                className="border px-2 w-16"
                onChange={(e) => updateCart(item.product.id, Number(e.target.value))}
                min="0"
              />
              <button
                onClick={() => removeFromCart(item.product.id)}
                className="text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <h2 className="text-2xl font-bold mt-6">Total: ${total.toFixed(2)}</h2>
          <Link to="/checkout" className="inline-block mt-6 bg-green-600 text-white px-4 py-2 rounded">
            Proceed to Checkout
          </Link>
        </div>
      )}
    </div>
  );
}