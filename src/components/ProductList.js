import React, { useState, useEffect } from 'react';
import './ProductList.css';

function ProductList() {
  const [products, setProducts] = useState([]);

  // TODO: Fetch products from the backend API

  return (
    <div className="product-list">
      <h2>Products</h2>
      {products.length === 0 ? (
        <p>No products found. Coming soon!</p>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p className="price">{product.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;
