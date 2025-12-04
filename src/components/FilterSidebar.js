import React from 'react';

const FilterSidebar = ({
  sort,
  setSort,
  maxPrice,
  setMaxPrice,
  inStockOnly,
  setInStockOnly,
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Filters</h2>

      {/* Sort By */}
      <div className="mb-6">
        <label htmlFor="sort" className="block text-gray-700 font-semibold mb-2">Sort By</label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="name">Name (A-Z)</option>
          <option value="price-asc">Price (Low to High)</option>
          <option value="price-desc">Price (High to Low)</option>
          <option value="newest">Newest</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <label htmlFor="category" className="block text-gray-700 font-semibold mb-2">Category</label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Price Range Slider */}
      <div className="mb-6">
        <label htmlFor="price-range" className="block text-gray-700 font-semibold mb-2">
          Max Price: ${maxPrice.toFixed(2)}
        </label>
        <input
          type="range"
          id="price-range"
          min="0"
          max="5000" // Assuming a max price for the slider
          step="10"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>

      {/* In Stock Only */}
      <div className="mb-6 flex items-center">
        <input
          type="checkbox"
          id="in-stock"
          checked={inStockOnly}
          onChange={(e) => setInStockOnly(e.target.checked)}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="in-stock" className="ml-2 text-gray-700 font-semibold">In Stock Only</label>
      </div>
    </div>
  );
};

export default FilterSidebar;