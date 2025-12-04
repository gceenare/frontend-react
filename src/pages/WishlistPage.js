import React, { useEffect, useState } from 'react';
import { useWishlist } from '../contexts/WishlistContext';
import { Link } from 'react-router-dom';
import { getProduct } from '../api'; // Import getProduct API function
import ProductSkeleton from '../components/ProductSkeleton'; // Re-use ProductSkeleton

const WishlistPage = () => {
  const { wishlist, remove: removeFromWishlist } = useWishlist();
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      setLoading(true);
      const fetchedProducts = [];
      for (const productId of wishlist) {
        try {
          const product = await getProduct(productId);
          fetchedProducts.push(product);
        } catch (error) {
          console.error(`Failed to fetch product ${productId} for wishlist:`, error);
          // Optionally show a toast for individual product fetch failures
        }
      }
      setWishlistProducts(fetchedProducts);
      setLoading(false);
    };

    if (wishlist.length > 0) {
      fetchWishlistProducts();
    } else {
      setWishlistProducts([]);
      setLoading(false);
    }
  }, [wishlist]); // Re-fetch when wishlist changes

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Your Wishlist</h1>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, index) => <ProductSkeleton key={index} />)}
        </div>
      ) : wishlistProducts.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-xl text-gray-600">Your wishlist is empty.</p>
          <Link to="/products" className="inline-block mt-6 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300">
            Discover Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {wishlistProducts.map(product => (
            <div key={product.id} className="relative bg-white border rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <Link to={`/product/${product.id}`}>
                <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover rounded-t-lg" />
                <div className="p-4 flex-grow">
                  <h2 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h2>
                  <p className="text-gray-600 mt-1">${product.price.toFixed(2)}</p>
                </div>
              </Link>
              <div className="p-4 border-t">
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="w-full text-center bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
                >
                  Remove from Wishlist
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;