import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api"; // Corrected import path
import { useCart } from "../contexts/CartContext";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { add } = useCart(); // Changed from addToCart to add

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data));
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="flex gap-10">
      <img src={product.imageUrl} className="w-96 rounded" />
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-xl mt-2">${product.price}</p>
        <p className="mt-4">{product.description}</p>
        <button
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => add(product.id, 1)} // Changed from addToCart to add
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}