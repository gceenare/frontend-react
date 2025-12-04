import React from 'react';

const Rating = ({ value, text, color = '#f8e825' }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className="text-xl" style={{ color }}>
          <i
            className={
              value >= star
                ? 'fas fa-star'
                : value >= star - 0.5
                ? 'fas fa-star-half-alt'
                : 'far fa-star'
            }
          ></i>
        </span>
      ))}
      <span className="ml-2 text-gray-600">{text && text}</span>
    </div>
  );
};

export default Rating;