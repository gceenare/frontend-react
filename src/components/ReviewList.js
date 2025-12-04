import React from 'react';
import Rating from './Rating';

const ReviewList = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return <p className="text-gray-600">No reviews yet.</p>;
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
          <div className="flex items-center mb-2">
            <strong className="text-gray-800 mr-2">{review.user.name}</strong>
            <Rating value={review.rating} />
          </div>
          <p className="text-gray-700 mb-2">{review.comment}</p>
          <p className="text-sm text-gray-500">
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;