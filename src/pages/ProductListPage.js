import React, { useEffect, useState } from "react";
import api from "../api"; // Corrected import path
import { Link } from "react-router-dom";

export default function ProductListPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data));
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((p) => (
        <Link key={p.id} to={`/product/${p.id}`}> 
          <div className="border rounded-xl p-4 shadow hover:shadow-lg transition">
            <img src={p.imageUrl} alt={p.name} className="w-full h-48 object-cover rounded" />
            <h2 className="font-semibold mt-2">{p.name}</h2>
            <p className="text-green-600 font-bold">${p.price}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}