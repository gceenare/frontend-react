import React from "react";
import { Link } from "react-router-dom";
import ProductListPage from "./ProductListPage";

export default function HomePage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Banner */}
      <div className="bg-blue-600 text-white text-center p-12">
        <h1 className="text-5xl font-bold mb-4">Latest in Tech</h1>
        <p className="text-xl mb-8">Discover our new arrivals and get the best deals.</p>
        <Link to="/products" className="bg-white text-blue-600 font-bold py-3 px-6 rounded-full hover:bg-gray-200 transition duration-300">
          Shop Now
        </Link>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link to="/products?category=laptops" className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 text-center">
              <span className="text-2xl">💻</span>
              <h3 className="font-bold mt-2 text-gray-700">Laptops</h3>
            </Link>
            <Link to="/products?category=desktops" className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 text-center">
              <span className="text-2xl">🖥️</span>
              <h3 className="font-bold mt-2 text-gray-700">Desktops</h3>
            </Link>
            <Link to="/products?category=monitors" className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 text-center">
              <span className="text-2xl">📺</span>
              <h3 className="font-bold mt-2 text-gray-700">Monitors</h3>
            </Link>
            <Link to="/products?category=accessories" className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 text-center">
              <span className="text-2xl">🖱️</span>
              <h3 className="font-bold mt-2 text-gray-700">Accessories</h3>
            </Link>
          </div>
        </div>

        {/* Featured Products */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Featured Products</h2>
          <ProductListPage />
        </div>
      </div>
    </div>
  );
}