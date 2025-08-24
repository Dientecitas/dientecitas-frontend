import React from 'react';
import { Clock, User, Check } from 'lucide-react';

const TimeSlotButton = ({ 
  slot, 
  selected = false, 
  onSelect, 
  disabled = false,
  showDentist = true 
}) => {
  const handleClick = () => {
    if (!disabled && slot.available) {
      onSelect(slot);
    }
  };

  const getButtonClasses = () => {
    if (disabled || !slot.available) {
      return 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200';
    }
    
    if (selected) {
      return 'bg-blue-600 text-white border-blue-600 shadow-md';
    }
    
    return 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50 cursor-pointer';
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || !slot.available}
      className={`
        relative p-3 rounded-lg border-2 transition-all duration-200 w-full text-left
        ${getButtonClasses()}
      `}
    >
      {/* Selected Indicator */}
      {selected && (
        <div className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full p-0.5">
          <Check className="w-3 h-3" />
        </div>
      )}
      
      {/* Time */}
      <div className="flex items-center space-x-2 mb-2">
        <Clock className="w-4 h-4" />
        <span className="font-medium">{slot.time}</span>
      </div>
      
      {/* Dentist Info */}
      {showDentist && slot.dentist && (
        <div className="flex items-center space-x-2 text-sm">
          <User className="w-3 h-3" />
          <span className="truncate">{slot.dentist.name}</span>
        </div>
      )}
      
      {/* Duration */}
      <div className="text-xs text-gray-500 mt-1">
        {slot.duration} minutos
      </div>
      
      {/* Availability Status */}
      {!slot.available && (
        <div className="absolute inset-0 bg-gray-100/80 rounded-lg flex items-center justify-center">
          <span className="text-xs font-medium text-gray-500">No disponible</span>
        </div>
      )}
      
      {/* Reserved Status */}
      {slot.reserved && (
        <div className="absolute top-1 left-1">
          <div className="w-2 h-2 bg-orange-500 rounded-full" />
        </div>
      )}
    </button>
  );
};

export default TimeSlotButton;