import React from 'react';

const ProductSkeleton = () => {
  return (
    <div className="bg-white border rounded-lg p-4 shadow-md animate-pulse">
      <div className="w-full h-48 bg-gray-300 rounded-t-lg"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
      <div className="p-4 border-t">
        <div className="h-10 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

export default ProductSkeleton;