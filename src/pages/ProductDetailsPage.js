import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProduct } from "../api";
import { useCart } from "../contexts/CartContext";
import Rating from "../components/Rating";
import ReviewList from "../components/ReviewList";
import AddReviewForm from "../components/AddReviewForm";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const { add } = useCart();
  const isLoggedIn = !!localStorage.getItem('token'); // Simple auth check

  useEffect(() => {
    getProduct(id).then(res => {
      setProduct(res.data);
      setReviews(res.data.reviews || []);
    });
  }, [id]);

  const handleReviewAdded = (newReview) => {
    setReviews(prevReviews => [newReview, ...prevReviews]);
  };

  if (!product) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        {/* Product Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <img src={product.imageUrl} alt={product.name} className="w-full h-auto object-contain rounded-lg" />
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">{product.name}</h1>
            <div className="flex items-center mb-4">
              <Rating value={product.rating} text={`${reviews.length} reviews`} />
            </div>
            <p className="text-lg text-gray-500 mb-4">Brand: {product.brand || 'N/A'}</p>
            <p className="text-3xl font-bold text-blue-600 mb-6">${product.price.toFixed(2)}</p>
            <div className="mb-6">
              <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${product.stock > 0 ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-700 mb-3">Specifications</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                {product.description.split(',').map((spec, i) => <li key={i}>{spec.trim()}</li>)}
              </ul>
            </div>
            <button
              className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-gray-400"
              onClick={() => add(product.id, 1)}
              disabled={product.stock === 0}
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Reviews</h2>
            <ReviewList reviews={reviews} />
          </div>
          <div>
            {isLoggedIn ? (
              <AddReviewForm productId={product.id} onReviewAdded={handleReviewAdded} />
            ) : (
              <div className="bg-gray-100 p-6 rounded-lg text-center">
                <p>You must be logged in to write a review.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}