import React from 'react';
import { MapPin, Phone, Clock, Check } from 'lucide-react';

const DistrictCard = ({ district, selected = false, onSelect }) => {
  return (
    <div 
      className={`
        relative bg-white rounded-lg border-2 cursor-pointer transition-all duration-200
        hover:shadow-lg transform hover:-translate-y-1
        ${selected ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-blue-300'}
      `}
      onClick={() => onSelect(district)}
    >
      {/* Selected Indicator */}
      {selected && (
        <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1 z-10">
          <Check className="w-4 h-4" />
        </div>
      )}
      
      {/* District Image */}
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        <img 
          src={district.image} 
          alt={district.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-bold">{district.name}</h3>
        </div>
      </div>
      
      {/* District Info */}
      <div className="p-4 space-y-3">
        <div className="flex items-start space-x-2">
          <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
          <span className="text-sm text-gray-600">{district.address}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <span className="text-sm text-gray-600">{district.phone}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <span className="text-sm text-gray-600">{district.hours}</span>
        </div>
        
        {/* Availability Status */}
        <div className="pt-2 border-t border-gray-100">
          <div className={`
            inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
            ${district.available 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
            }
          `}>
            <div className={`
              w-2 h-2 rounded-full mr-1
              ${district.available ? 'bg-green-500' : 'bg-red-500'}
            `} />
            {district.available ? 'Disponible' : 'No disponible'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistrictCard;