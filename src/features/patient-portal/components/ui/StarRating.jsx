import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ 
  rating = 0, 
  onRatingChange, 
  readonly = false, 
  size = 'md',
  showValue = false,
  className = '' 
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const handleStarClick = (value) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleStarHover = (value) => {
    if (!readonly) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const getStarColor = (starIndex) => {
    const currentRating = hoverRating || rating;
    
    if (starIndex <= currentRating) {
      return 'text-yellow-400 fill-yellow-400';
    }
    
    return 'text-gray-300';
  };

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <div 
        className="flex space-x-1"
        onMouseLeave={handleMouseLeave}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleStarHover(star)}
            disabled={readonly}
            className={`
              transition-all duration-200 transform
              ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}
              ${!readonly ? 'focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 rounded' : ''}
            `}
          >
            <Star 
              className={`${sizes[size]} ${getStarColor(star)} transition-colors duration-200`}
            />
          </button>
        ))}
      </div>
      
      {showValue && (
        <span className="text-sm text-gray-600 ml-2">
          {rating > 0 ? `${rating}/5` : 'Sin valorar'}
        </span>
      )}
    </div>
  );
};

export default StarRating;