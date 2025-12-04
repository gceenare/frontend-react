import React, { useEffect, useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { getProducts } from "../api";
import ProductSkeleton from "../components/ProductSkeleton";
import FilterSidebar from "../components/FilterSidebar"; // Import FilterSidebar
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/CartContext";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { add: addToWishlist, remove: removeFromWishlist, isInWishlist } = useWishlist();
  const { add: addToCart } = useCart();
  const query = useQuery();

  // Filter and sort states
  const [sort, setSort] = useState("name");
  const [maxPrice, setMaxPrice] = useState(5000); // Default max price
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(query.get("category") || "");

  useEffect(() => {
    setLoading(true);
    getProducts()
      .then(res => {
        setProducts(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  // Extract unique categories from products
  const categories = useMemo(() => [...new Set(products.map(p => p.category))], [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Filter by price
    result = result.filter(p => p.price <= maxPrice);

    // Filter by stock
    if (inStockOnly) {
      result = result.filter(p => p.stock > 0);
    }

    // Sort
    result.sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "newest":
          // Assuming products have a 'createdAt' field for sorting by newest
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "rating":
          // Assuming products have a 'rating' field
          return (b.rating || 0) - (a.rating || 0);
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return result;
  }, [products, selectedCategory, maxPrice, inStockOnly, sort]);

  const handleWishlistClick = (e, productId) => {
    e.preventDefault();
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  const handleAddToCartClick = (e, productId) => {
    e.preventDefault(); // Prevent navigation
    addToCart(productId, 1);
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-6 flex gap-8">
        {/* Filters Sidebar */}
        <aside className="w-1/4">
          <FilterSidebar
            sort={sort}
            setSort={setSort}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            inStockOnly={inStockOnly}
            setInStockOnly={setInStockOnly}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </aside>

        {/* Product Grid */}
        <main className="w-3/4">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            {selectedCategory || "All Products"}
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              Array.from({ length: 9 }).map((_, index) => <ProductSkeleton key={index} />)
            ) : (
              filteredAndSortedProducts.map((p) => (
                <div key={p.id} className="relative bg-white border rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
                  <button
                    onClick={(e) => handleWishlistClick(e, p.id)}
                    className={`absolute top-2 right-2 text-2xl z-10 ${isInWishlist(p.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
                  >
                    ♥
                  </button>
                  <Link to={`/product/${p.id}`}>
                    <img src={p.imageUrl} alt={p.name} className="w-full h-48 object-cover rounded-t-lg" />
                    <div className="p-4 flex-grow">
                      <h2 className="text-lg font-semibold text-gray-800 truncate">{p.name}</h2>
                      <p className="text-gray-600 mt-1">${p.price.toFixed(2)}</p>
                      {/* Optional: Display rating */}
                    </div>
                  </Link>
                  <div className="p-4 border-t flex justify-between items-center">
                    <Link to={`/product/${p.id}`} className="flex-1 text-center bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 mr-2">
                      View Details
                    </Link>
                    <button
                      onClick={(e) => handleAddToCartClick(e, p.id)}
                      className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
                      disabled={p.stock === 0}
                    >
                      {p.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}