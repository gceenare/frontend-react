import React from "react";
import ProductListPage from "./ProductListPage";

export default function HomePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Featured Products</h1>
      <ProductListPage />
    </div>
  );
}