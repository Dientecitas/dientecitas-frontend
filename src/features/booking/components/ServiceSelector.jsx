import React, { useState, useEffect } from 'react';
import { Search, Stethoscope, Filter, Info, Loader2 } from 'lucide-react';
import { useBooking } from '../store/bookingContext';
import { bookingApi } from '../services/bookingApi';
import ServiceCard from './ui/ServiceCard';
import Card from '../../../shared/components/ui/Card';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import Modal from '../../../shared/components/ui/Modal';

const ServiceSelector = () => {
  const { district, service, setService, setLoading, setError, clearError } = useBooking();
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showServiceInfo, setShowServiceInfo] = useState(false);
  const [selectedServiceInfo, setSelectedServiceInfo] = useState(null);

  const categories = [
    { id: 'all', name: 'Todos los Servicios' },
    { id: 'Limpieza y Prevención', name: 'Limpieza y Prevención' },
    { id: 'Ortodoncia', name: 'Ortodoncia' },
    { id: 'Endodoncia', name: 'Endodoncia' },
    { id: 'Cirugía Oral', name: 'Cirugía Oral' },
    { id: 'Odontología Estética', name: 'Odontología Estética' },
    { id: 'Odontopediatría', name: 'Odontopediatría' },
    { id: 'Periodoncia', name: 'Periodoncia' },
    { id: 'Implantes', name: 'Implantes' }
  ];

  useEffect(() => {
    if (district) {
      loadServices();
    }
  }, [district]);

  useEffect(() => {
    filterServices();
  }, [services, searchTerm, selectedCategory]);

  const loadServices = async () => {
    setIsLoading(true);
    clearError('services');
    
    try {
      const response = await bookingApi.getServices(district.id);
      
      if (response.success) {
        setServices(response.data);
      } else {
        setError('services', 'Error al cargar servicios. Intente nuevamente.');
      }
    } catch (error) {
      setError('services', 'Error al cargar servicios. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const filterServices = () => {
    let filtered = services;

    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    // Filtrar por búsqueda
    if (searchTerm.trim()) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredServices(filtered);
  };

  const handleServiceSelect = (selectedService) => {
    setService(selectedService);
  };

  const handleServiceInfo = (serviceInfo) => {
    setSelectedServiceInfo(serviceInfo);
    setShowServiceInfo(true);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  if (isLoading) {
    return (
      <Card title="Seleccionar Servicio" className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Cargando servicios disponibles...</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card title="Seleccionar Servicio" className="max-w-6xl mx-auto">
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-gray-600">
              Elige el tratamiento dental que necesitas en {district?.name}
            </p>
          </div>

          {/* Filtros */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Buscador */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar servicios..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Filtro por categoría */}
            <div className="lg:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid de servicios */}
          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((serviceItem) => (
                <ServiceCard
                  key={serviceItem.id}
                  service={serviceItem}
                  selected={service?.id === serviceItem.id}
                  onSelect={handleServiceSelect}
                  onInfo={handleServiceInfo}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Stethoscope className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron servicios
              </h3>
              <p className="text-gray-600">
                Intenta con otros términos de búsqueda o cambia la categoría
              </p>
            </div>
          )}

          {/* Servicio seleccionado */}
          {service && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-purple-800 font-medium">Servicio seleccionado</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Servicio</label>
                  <p className="text-gray-900">{service.name}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Categoría</label>
                  <p className="text-gray-900">{service.category}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Duración</label>
                  <p className="text-gray-900">{service.duration} minutos</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Precio</label>
                  <p className="text-gray-900 font-semibold">S/ {service.price}</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </Card>

      {/* Modal de información del servicio */}
      <Modal
        isOpen={showServiceInfo}
        onClose={() => setShowServiceInfo(false)}
        title="Información del Servicio"
        size="lg"
      >
        {selectedServiceInfo && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <img
                src={selectedServiceInfo.image}
                alt={selectedServiceInfo.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedServiceInfo.name}
                </h3>
                <p className="text-blue-600 font-medium">
                  {selectedServiceInfo.category}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {selectedServiceInfo.duration} min
                </div>
                <div className="text-sm text-gray-600">Duración</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  S/ {selectedServiceInfo.price}
                </div>
                <div className="text-sm text-gray-600">Precio</div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Descripción</h4>
              <p className="text-gray-600">
                {selectedServiceInfo.description}
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <LoadingButton
                variant="outline"
                onClick={() => setShowServiceInfo(false)}
              >
                Cerrar
              </LoadingButton>
              <LoadingButton
                variant="primary"
                onClick={() => {
                  handleServiceSelect(selectedServiceInfo);
                  setShowServiceInfo(false);
                }}
              >
                Seleccionar Servicio
              </LoadingButton>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default ServiceSelector;