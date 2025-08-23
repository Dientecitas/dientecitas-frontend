import { useCallback, useEffect } from 'react';
import { usePaymentContext } from '../store/paymentContext';
import { paymentApi } from '../services/paymentApi';
import { useLoading } from '../../../shared/hooks/useLoading';

export const usePayments = () => {
  const {
    payments,
    pagination,
    filters,
    loading,
    errors,
    stats,
    setPayments,
    addPayment,
    updatePayment,
    removePayment,
    setStats,
    setLoading,
    setError,
    clearError,
    setPagination
  } = usePaymentContext();
  
  const { withLoading, isLoading: isLoadingHook } = useLoading();

  // Cargar pagos
  const fetchPayments = useCallback(async (customFilters = null, customPagination = null) => {
    const currentFilters = customFilters || filters;
    const currentPagination = customPagination || pagination;

    try {
      clearError('payments');
      const response = await withLoading('fetch-payments', async () => {
        return await paymentApi.getPayments(currentFilters, currentPagination);
      });
      setPayments(response.data, response.pagination);
    } catch (error) {
      setError('payments', error.message);
    }
  }, [filters, pagination, setPayments, setError, clearError, withLoading]);

  // Procesar pago
  const processPayment = useCallback(async (paymentData) => {
    try {
      clearError('process');
      const newPayment = await withLoading('process-payment', async () => {
        return await paymentApi.processPayment(paymentData);
      });
      addPayment(newPayment);
      
      // Recargar estadísticas
      await fetchStats();
      
      return { success: true, data: newPayment };
    } catch (error) {
      setError('process', error.message);
      return { success: false, error: error.message };
    }
  }, [addPayment, setError, clearError, withLoading]);

  // Reembolsar pago
  const refundPayment = useCallback(async (paymentId, refundData) => {
    try {
      clearError('refund');
      const result = await withLoading('refund-payment', async () => {
        return await paymentApi.refundPayment(paymentId, refundData);
      });
      updatePayment(result.payment);
      
      // Recargar estadísticas
      await fetchStats();
      
      return { success: true, data: result };
    } catch (error) {
      setError('refund', error.message);
      return { success: false, error: error.message };
    }
  }, [updatePayment, setError, clearError, withLoading]);

  // Crear plan de financiamiento
  const createInstallmentPlan = useCallback(async (planData) => {
    try {
      clearError('installments');
      const plan = await withLoading('create-installment', async () => {
        return await paymentApi.createInstallmentPlan(planData);
      });
      
      return { success: true, data: plan };
    } catch (error) {
      setError('installments', error.message);
      return { success: false, error: error.message };
    }
  }, [setError, clearError, withLoading]);

  // Verificar elegibilidad de seguro
  const verifyInsurance = useCallback(async (insuranceData) => {
    try {
      clearError('insurance');
      const eligibility = await withLoading('verify-insurance', async () => {
        return await paymentApi.verifyInsuranceEligibility(insuranceData);
      });
      
      return { success: true, data: eligibility };
    } catch (error) {
      setError('insurance', error.message);
      return { success: false, error: error.message };
    }
  }, [setError, clearError, withLoading]);

  // Detectar fraude
  const detectFraud = useCallback(async (transactionData) => {
    try {
      clearError('fraud');
      const fraudAnalysis = await withLoading('detect-fraud', async () => {
        return await paymentApi.detectFraud(transactionData);
      });
      
      return { success: true, data: fraudAnalysis };
    } catch (error) {
      setError('fraud', error.message);
      return { success: false, error: error.message };
    }
  }, [setError, clearError, withLoading]);

  // Cargar estadísticas
  const fetchStats = useCallback(async () => {
    try {
      clearError('stats');
      const statsData = await withLoading('fetch-stats', async () => {
        return await paymentApi.getPaymentStats();
      });
      setStats(statsData);
    } catch (error) {
      setError('stats', error.message);
    }
  }, [setStats, setError, clearError, withLoading]);

  // Exportar pagos
  const exportPayments = useCallback(async (customFilters = null) => {
    const currentFilters = customFilters || filters;
    
    try {
      clearError('export');
      const data = await withLoading('export-payments', async () => {
        return await paymentApi.exportPayments(currentFilters);
      });
      
      // Crear CSV
      const headers = [
        'Número',
        'Fecha',
        'Paciente',
        'Monto Total',
        'Método de Pago',
        'Gateway',
        'Estado',
        'Score de Fraude',
        'Seguro',
        'Financiamiento'
      ];

      const csvContent = [
        headers.join(','),
        ...data.map(payment => [
          payment.numero,
          new Date(payment.createdAt).toLocaleDateString('es-PE'),
          `"${payment.patient?.nombres} ${payment.patient?.apellidos}"`,
          payment.amount.total,
          payment.paymentMethod.type,
          payment.gateway.provider,
          payment.status,
          payment.fraudScore || 0,
          payment.insurance ? 'Sí' : 'No',
          payment.installmentPlan ? 'Sí' : 'No'
        ].join(','))
      ].join('\n');

      // Descargar archivo
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `pagos_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return { success: true };
    } catch (error) {
      setError('export', error.message);
      return { success: false, error: error.message };
    }
  }, [filters, setError, clearError, withLoading]);

  // Cambiar página
  const changePage = useCallback((page) => {
    setPagination({ page });
    fetchPayments(null, { ...pagination, page });
  }, [pagination, setPagination, fetchPayments]);

  // Cambiar límite por página
  const changeLimit = useCallback((limit) => {
    setPagination({ page: 1, limit });
    fetchPayments(null, { page: 1, limit });
  }, [setPagination, fetchPayments]);

  // Efecto para cargar datos iniciales
  useEffect(() => {
    if (payments.length === 0) {
      fetchPayments();
      fetchStats();
    }
  }, []); // Solo al montar el componente

  return {
    // Datos
    payments,
    pagination,
    filters,
    stats,
    
    // Estados
    loading: {
      payments: isLoadingHook('fetch-payments'),
      process: isLoadingHook('process-payment'),
      refund: isLoadingHook('refund-payment'),
      installments: isLoadingHook('create-installment'),
      insurance: isLoadingHook('verify-insurance'),
      fraud: isLoadingHook('detect-fraud'),
      stats: isLoadingHook('fetch-stats'),
      export: isLoadingHook('export-payments')
    },
    errors,
    
    // Acciones
    fetchPayments,
    processPayment,
    refundPayment,
    createInstallmentPlan,
    verifyInsurance,
    detectFraud,
    fetchStats,
    exportPayments,
    changePage,
    changeLimit,
    
    // Utilidades
    isLoading: (key) => isLoadingHook(key),
    hasError: (key) => !!errors[key],
    getError: (key) => errors[key]
  };
};

export default usePayments;