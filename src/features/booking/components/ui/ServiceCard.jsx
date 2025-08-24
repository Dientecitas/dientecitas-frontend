import React from 'react';
import { Clock, DollarSign, Check, Info } from 'lucide-react';
import { formatCurrency } from '../../utils/bookingHelpers';

const ServiceCard = ({ service, selected = false, onSelect, onInfo }) => {
  return (
    <div 
      className={`
        relative bg-white rounded-lg border-2 cursor-pointer transition-all duration-200
        hover:shadow-lg transform hover:-translate-y-1
        ${selected ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-blue-300'}
      `}
      onClick={() => onSelect(service)}
    >
      {/* Selected Indicator */}
      {selected && (
        <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1 z-10">
          <Check className="w-4 h-4" />
        </div>
      )}
      
      {/* Service Image */}
      <div className="relative h-40 overflow-hidden rounded-t-lg">
        <img 
          src={service.image} 
          alt={service.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Info Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onInfo?.(service);
          }}
          className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-700 rounded-full p-2 transition-colors"
        >
          <Info className="w-4 h-4" />
        </button>
        
        {/* Category Badge */}
        <div className="absolute bottom-2 left-2">
          <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
            {service.category}
          </span>
        </div>
      </div>
      
      {/* Service Info */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {service.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-gray-500">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{service.duration} min</span>
            </div>
            
            <div className="flex items-center space-x-1 text-green-600">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm font-medium">
                {formatCurrency(service.price)}
              </span>
            </div>
          </div>
          
          {/* Availability Status */}
          <div className={`
            inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
            ${service.available 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
            }
          `}>
            <div className={`
              w-2 h-2 rounded-full mr-1
              ${service.available ? 'bg-green-500' : 'bg-red-500'}
            `} />
            {service.available ? 'Disponible' : 'No disponible'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;