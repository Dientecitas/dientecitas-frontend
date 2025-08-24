import React, { useState, useEffect } from 'react';
import { Search, MapPin, Phone, Clock, Loader2 } from 'lucide-react';
import { useBooking } from '../store/bookingContext';
import { bookingApi } from '../services/bookingApi';
import DistrictCard from './ui/DistrictCard';
import Card from '../../../shared/components/ui/Card';
import Input from '../../../shared/components/ui/Input';
import LoadingButton from '../../../shared/components/ui/LoadingButton';

const DistrictSelector = () => {
  const { district, setDistrict, setLoading, setError, clearError } = useBooking();
  const [districts, setDistricts] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDistricts();
  }, []);

  useEffect(() => {
    filterDistricts();
  }, [districts, searchTerm]);

  const loadDistricts = async () => {
    setIsLoading(true);
    clearError('districts');
    
    try {
      const response = await bookingApi.getDistricts();
      
      if (response.success) {
        setDistricts(response.data);
      } else {
        setError('districts', 'Error al cargar distritos. Intente nuevamente.');
      }
    } catch (error) {
      setError('districts', 'Error al cargar distritos. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const filterDistricts = () => {
    if (!searchTerm.trim()) {
      setFilteredDistricts(districts);
      return;
    }

    const filtered = districts.filter(district =>
      district.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      district.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredDistricts(filtered);
  };

  const handleDistrictSelect = (selectedDistrict) => {
    setDistrict(selectedDistrict);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (isLoading) {
    return (
      <Card title="Seleccionar Ubicación" className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Cargando ubicaciones disponibles...</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Seleccionar Ubicación" className="max-w-6xl mx-auto">
      <div className="space-y-6">
        <div className="text-center mb-6">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-gray-600">
            Elige la ubicación más conveniente para tu cita dental
          </p>
        </div>

        {/* Buscador */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por distrito o dirección..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Grid de distritos */}
        {filteredDistricts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDistricts.map((districtItem) => (
              <DistrictCard
                key={districtItem.id}
                district={districtItem}
                selected={district?.id === districtItem.id}
                onSelect={handleDistrictSelect}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron ubicaciones
            </h3>
            <p className="text-gray-600">
              Intenta con otros términos de búsqueda
            </p>
          </div>
        )}

        {/* Distrito seleccionado */}
        {district && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-blue-800 font-medium">Ubicación seleccionada</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Distrito</label>
                <p className="text-gray-900">{district.name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Dirección</label>
                <p className="text-gray-900">{district.address}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Teléfono</label>
                <p className="text-gray-900">{district.phone}</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </Card>
  );
};

export default DistrictSelector;