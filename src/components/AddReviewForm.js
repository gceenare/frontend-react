import React, { useState } from 'react';
import { addReview } from '../api';
import { useToast } from '../contexts/ToastContext';

const AddReviewForm = ({ productId, onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newReview = await addReview(productId, { rating, comment });
      showToast({ message: 'Review added successfully!', type: 'success' });
      setRating(0);
      setComment('');
      onReviewAdded(newReview); // Update parent component with new review
    } catch (error) {
      showToast({ message: error.response?.data?.message || 'Failed to add review.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Write a Customer Review</h3>
      <form onSubmit={submitHandler}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rating">
            Rating
          </label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-2xl cursor-pointer ${
                  star <= rating ? 'text-yellow-500' : 'text-gray-300'
                }`}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="comment">
            Comment
          </label>
          <textarea
            id="comment"
            rows="5"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
          disabled={loading || rating === 0 || comment.trim() === ''}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default AddReviewForm;