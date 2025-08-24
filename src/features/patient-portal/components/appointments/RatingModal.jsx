import React, { useState } from 'react';
import { X, Star } from 'lucide-react';
import StarRating from '../ui/StarRating';
import LoadingButton from '../../../../shared/components/ui/LoadingButton';
import Modal from '../../../../shared/components/ui/Modal';

const RatingModal = ({ isOpen, onClose, appointment, onSubmit, isLoading }) => {
  const [rating, setRating] = useState({
    stars: 0,
    comment: '',
    categories: {
      atencion: 0,
      puntualidad: 0,
      instalaciones: 0,
      tratamiento: 0
    }
  });

  const [errors, setErrors] = useState({});

  const categories = [
    { key: 'atencion', label: 'Atención del personal' },
    { key: 'puntualidad', label: 'Puntualidad' },
    { key: 'instalaciones', label: 'Instalaciones' },
    { key: 'tratamiento', label: 'Calidad del tratamiento' }
  ];

  const handleStarsChange = (stars) => {
    setRating(prev => ({ ...prev, stars }));
    if (errors.stars) {
      setErrors(prev => ({ ...prev, stars: null }));
    }
  };

  const handleCategoryChange = (category, value) => {
    setRating(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: value
      }
    }));
  };

  const handleCommentChange = (e) => {
    setRating(prev => ({ ...prev, comment: e.target.value }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (rating.stars === 0) {
      newErrors.stars = 'Debes seleccionar al menos una estrella';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onSubmit(appointment.id, rating);
  };

  const handleClose = () => {
    setRating({
      stars: 0,
      comment: '',
      categories: {
        atencion: 0,
        puntualidad: 0,
        instalaciones: 0,
        tratamiento: 0
      }
    });
    setErrors({});
    onClose();
  };

  if (!appointment) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Valorar Cita"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Appointment Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">{appointment.servicio.nombre}</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>Dr. {appointment.dentista.nombre}</p>
            <p>{appointment.clinica.nombre}</p>
            <p>{new Date(appointment.fecha).toLocaleDateString('es-ES')} - {appointment.hora}</p>
          </div>
        </div>

        {/* Overall Rating */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Valoración General *
          </label>
          <div className="flex items-center space-x-2">
            <StarRating
              rating={rating.stars}
              onRatingChange={handleStarsChange}
              size="lg"
            />
            <span className="text-sm text-gray-600">
              {rating.stars > 0 ? `${rating.stars}/5` : 'Selecciona una valoración'}
            </span>
          </div>
          {errors.stars && (
            <p className="text-sm text-red-600">{errors.stars}</p>
          )}
        </div>

        {/* Category Ratings */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Valoración por Categorías
          </label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((category) => (
              <div key={category.key} className="space-y-2">
                <label className="block text-sm text-gray-600">
                  {category.label}
                </label>
                <StarRating
                  rating={rating.categories[category.key]}
                  onRatingChange={(value) => handleCategoryChange(category.key, value)}
                  size="sm"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Comentario (Opcional)
          </label>
          <textarea
            value={rating.comment}
            onChange={handleCommentChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Comparte tu experiencia con otros pacientes..."
            maxLength={500}
          />
          <div className="text-xs text-gray-500 text-right">
            {rating.comment.length}/500 caracteres
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <LoadingButton
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancelar
          </LoadingButton>
          
          <LoadingButton
            type="submit"
            variant="primary"
            loading={isLoading}
            loadingText="Enviando..."
            icon={<Star className="w-4 h-4" />}
          >
            Enviar Valoración
          </LoadingButton>
        </div>
      </form>
    </Modal>
  );
};

export default RatingModal;