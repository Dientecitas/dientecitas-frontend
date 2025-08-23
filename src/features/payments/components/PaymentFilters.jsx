import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Download, RotateCcw, Calendar, CreditCard, Building } from 'lucide-react';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import { usePaymentContext } from '../store/paymentContext';
import { PaymentMethodType, PaymentStatus, PaymentGatewayProvider } from '../types/payment.types';
import { usePayments } from '../hooks/usePayments';

const PaymentFilters = () => {
  const {
    filters,
    ui,
    setFilters,
    clearFilters,
    toggleFilters
  } = usePaymentContext();

  const { fetchPayments, exportPayments, loading } = usePayments();

  // Estados locales para los filtros
  const [localFilters, setLocalFilters] = useState(filters);
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Sincronizar filtros locales con el contexto
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Debounce para la búsqueda
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      if (localFilters.search !== filters.search) {
        handleFilterChange('search', localFilters.search);
      }
    }, 300);

    setSearchTimeout(timeout);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [localFilters.search]);

  // Manejar cambios en filtros
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Resetear página al cambiar filtros
    fetchPayments(newFilters, { page: 1, limit: 10 });
  };

  // Manejar cambio local de búsqueda
  const handleSearchChange = (value) => {
    setLocalFilters(prev => ({ ...prev, search: value }));
  };

  // Manejar filtros de array
  const handleArrayFilterChange = (key, value, checked) => {
    const currentArray = filters[key] || [];
    let newArray;
    
    if (checked) {
      newArray = [...currentArray, value];
    } else {
      newArray = currentArray.filter(item => item !== value);
    }
    
    handleFilterChange(key, newArray);
  };

  // Limpiar filtros
  const handleClearFilters = () => {
    clearFilters();
    setLocalFilters({
      search: '',
      dateFrom: '',
      dateTo: '',
      status: [],
      paymentMethods: [],
      gateways: [],
      amountMin: '',
      amountMax: '',
      currencies: [],
      hasInsurance: null,
      hasInstallments: null,
      hasRefunds: null,
      riskLevels: [],
      patients: [],
      clinics: [],
      dentists: [],
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    fetchPayments({
      search: '',
      dateFrom: '',
      dateTo: '',
      status: [],
      paymentMethods: [],
      gateways: [],
      sortBy: 'createdAt',
      sortOrder: 'desc'
    }, { page: 1, limit: 10 });
  };

  // Exportar datos
  const handleExport = async () => {
    await exportPayments(filters);
  };

  // Contar filtros activos
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.dateFrom) count++;
    if (filters.dateTo) count++;
    if (filters.status?.length > 0) count++;
    if (filters.paymentMethods?.length > 0) count++;
    if (filters.gateways?.length > 0) count++;
    if (filters.amountMin) count++;
    if (filters.amountMax) count++;
    if (filters.hasInsurance !== null) count++;
    if (filters.hasInstallments !== null) count++;
    if (filters.hasRefunds !== null) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  // Opciones de estado
  const statusOptions = [
    { value: PaymentStatus.PENDING, label: 'Pendiente' },
    { value: PaymentStatus.PROCESSING, label: 'Procesando' },
    { value: PaymentStatus.CAPTURED, label: 'Capturado' },
    { value: PaymentStatus.SETTLED, label: 'Liquidado' },
    { value: PaymentStatus.FAILED, label: 'Fallido' },
    { value: PaymentStatus.CANCELLED, label: 'Cancelado' },
    { value: PaymentStatus.REFUNDED, label: 'Reembolsado' }
  ];

  // Opciones de métodos de pago
  const paymentMethodOptions = [
    { value: PaymentMethodType.CREDIT_CARD, label: 'Tarjeta de Crédito' },
    { value: PaymentMethodType.DEBIT_CARD, label: 'Tarjeta de Débito' },
    { value: PaymentMethodType.BANK_TRANSFER, label: 'Transferencia Bancaria' },
    { value: PaymentMethodType.DIGITAL_WALLET, label: 'Billetera Digital' },
    { value: PaymentMethodType.CASH, label: 'Efectivo' }
  ];

  // Opciones de gateways
  const gatewayOptions = [
    { value: PaymentGatewayProvider.CULQI, label: 'Culqi' },
    { value: PaymentGatewayProvider.VISANET, label: 'Visanet' },
    { value: PaymentGatewayProvider.MERCADOPAGO, label: 'MercadoPago' },
    { value: PaymentGatewayProvider.STRIPE, label: 'Stripe' },
    { value: PaymentGatewayProvider.PAYPAL, label: 'PayPal' }
  ];

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda y controles principales */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Búsqueda */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar por número, paciente, email..."
            value={localFilters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {localFilters.search && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Controles */}
        <div className="flex gap-2">
          <LoadingButton
            variant="outline"
            onClick={toggleFilters}
            className="relative"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
            {activeFiltersCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </LoadingButton>

          <LoadingButton
            variant="outline"
            onClick={handleExport}
            loading={loading.export}
            loadingText="Exportando..."
            disabled={loading.export}
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </LoadingButton>
        </div>
      </div>

      {/* Panel de filtros avanzados */}
      {ui.showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">Filtros Avanzados</h3>
            <LoadingButton
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              disabled={activeFiltersCount === 0}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Limpiar
            </LoadingButton>
          </div>

          {/* Filtros de fecha */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="inline w-4 h-4 mr-1" />
                Fecha Desde
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="inline w-4 h-4 mr-1" />
                Fecha Hasta
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Filtros de monto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto Mínimo
              </label>
              <input
                type="number"
                step="0.01"
                value={filters.amountMin}
                onChange={(e) => handleFilterChange('amountMin', e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto Máximo
              </label>
              <input
                type="number"
                step="0.01"
                value={filters.amountMax}
                onChange={(e) => handleFilterChange('amountMax', e.target.value)}
                placeholder="50000.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Filtros de categorías */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Estados */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estados
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {statusOptions.map(option => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(filters.status || []).includes(option.value)}
                      onChange={(e) => handleArrayFilterChange('status', option.value, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Métodos de pago */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CreditCard className="inline w-4 h-4 mr-1" />
                Métodos de Pago
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {paymentMethodOptions.map(option => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(filters.paymentMethods || []).includes(option.value)}
                      onChange={(e) => handleArrayFilterChange('paymentMethods', option.value, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Gateways */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="inline w-4 h-4 mr-1" />
                Gateways
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {gatewayOptions.map(option => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(filters.gateways || []).includes(option.value)}
                      onChange={(e) => handleArrayFilterChange('gateways', option.value, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Filtros booleanos */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.hasInsurance === true}
                onChange={(e) => handleFilterChange('hasInsurance', e.target.checked ? true : null)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Con seguro médico</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.hasInstallments === true}
                onChange={(e) => handleFilterChange('hasInstallments', e.target.checked ? true : null)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Con financiamiento</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.hasRefunds === true}
                onChange={(e) => handleFilterChange('hasRefunds', e.target.checked ? true : null)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Con reembolsos</span>
            </label>
          </div>

          {/* Ordenamiento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ordenar por
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="createdAt">Fecha de Creación</option>
                <option value="amount">Monto</option>
                <option value="patient">Paciente</option>
                <option value="status">Estado</option>
                <option value="gateway">Gateway</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Orden
              </label>
              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="desc">Descendente</option>
                <option value="asc">Ascendente</option>
              </select>
            </div>
          </div>

          {/* Resumen de filtros activos */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
              <span className="text-sm text-gray-600">Filtros activos:</span>
              {filters.search && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  Búsqueda: "{filters.search}"
                  <button
                    onClick={() => handleFilterChange('search', '')}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.dateFrom && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                  Desde: {filters.dateFrom}
                  <button
                    onClick={() => handleFilterChange('dateFrom', '')}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.dateTo && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                  Hasta: {filters.dateTo}
                  <button
                    onClick={() => handleFilterChange('dateTo', '')}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.status?.length > 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                  Estados: {filters.status.length}
                  <button
                    onClick={() => handleFilterChange('status', [])}
                    className="ml-1 text-purple-600 hover:text-purple-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentFilters;