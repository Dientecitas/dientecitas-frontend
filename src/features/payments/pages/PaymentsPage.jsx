import React, { useState } from 'react';
import { Plus, CreditCard, RefreshCw, Download, BarChart3, Settings } from 'lucide-react';
import { usePaymentContext } from '../store/paymentContext';
import { usePayments } from '../hooks/usePayments';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import Card from '../../../shared/components/ui/Card';
import Modal from '../../../shared/components/ui/Modal';
import LoadingOverlay from '../../../shared/components/ui/LoadingOverlay';
import PageLoader from '../../../shared/components/ui/PageLoader';
import PaymentStats from '../components/PaymentStats';
import PaymentFilters from '../components/PaymentFilters';
import PaymentHistory from '../components/PaymentHistory';
import PaymentForm from '../components/PaymentForm';
import RefundForm from '../components/RefundForm';

const PaymentsPage = () => {
  const {
    ui,
    selectedPayment,
    setViewMode,
    toggleModal,
    closeAllModals,
    setSelectedPayment
  } = usePaymentContext();

  const { 
    processPayment, 
    refundPayment, 
    loading, 
    fetchPayments,
    payments,
    exportPayments
  } = usePayments();

  // Show page loader on initial load
  if (loading.payments && !payments.length) {
    return (
      <PageLoader 
        message="Cargando sistema de pagos..." 
        description="Preparando el módulo financiero"
        timeout={10000}
        onTimeout={() => console.error('Timeout loading payments')}
        onRetry={() => fetchPayments()}
      />
    );
  }

  // Handlers para modales
  const handleProcessPayment = async (data) => {
    const result = await processPayment(data);
    if (result.success) {
      toggleModal('process', false);
    }
    return result;
  };

  const handleRefundPayment = async (data) => {
    if (!selectedPayment) return;
    const result = await refundPayment(selectedPayment.id, data);
    if (result.success) {
      toggleModal('refund', false);
      setSelectedPayment(null);
    }
    return result;
  };

  const handleViewPayment = (payment) => {
    setSelectedPayment(payment);
    toggleModal('detail', true);
  };

  const handleRefundClick = (payment) => {
    setSelectedPayment(payment);
    toggleModal('refund', true);
  };

  const handleDownloadReceipt = (payment) => {
    // Implementar descarga de recibo
    console.log('Descargando recibo para:', payment.numero);
  };

  const handleRefresh = () => {
    fetchPayments();
  };

  const handleExport = () => {
    exportPayments();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Sistema de Pagos
          </h1>
          <p className="text-gray-600 mt-1">
            Gestión completa de transacciones y facturación
          </p>
        </div>

        <div className="flex items-center gap-3">
          <LoadingButton
            variant="outline"
            onClick={() => setViewMode('analytics')}
            className={ui.viewMode === 'analytics' ? 'bg-blue-50 border-blue-300' : ''}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </LoadingButton>

          <LoadingButton
            variant="outline"
            onClick={handleExport}
            loading={loading.export}
            loadingText="Exportando..."
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </LoadingButton>

          <LoadingButton
            variant="outline"
            onClick={handleRefresh}
            loading={loading.payments}
            loadingText="Actualizando..."
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </LoadingButton>

          <LoadingButton
            onClick={() => toggleModal('process', true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Procesar Pago
          </LoadingButton>
        </div>
      </div>

      {/* Estadísticas */}
      <PaymentStats />

      {/* Filtros */}
      <PaymentFilters />

      {/* Historial de pagos */}
      <PaymentHistory
        onView={handleViewPayment}
        onRefund={handleRefundClick}
        onDownloadReceipt={handleDownloadReceipt}
      />

      {/* Global loading overlay for operations */}
      <LoadingOverlay
        visible={loading.process}
        message="Procesando pago..."
        description="Verificando información y procesando transacción"
        spinner="circle"
        backdrop="blur"
      />

      <LoadingOverlay
        visible={loading.refund}
        message="Procesando reembolso..."
        description="Esto puede tomar unos minutos"
        spinner="circle"
        backdrop="blur"
      />

      {/* Modal Procesar Pago */}
      <Modal
        isOpen={ui.modals.process}
        onClose={() => toggleModal('process', false)}
        title="Procesar Nuevo Pago"
        size="lg"
      >
        <PaymentForm
          onSubmit={handleProcessPayment}
          onCancel={() => toggleModal('process', false)}
          loading={loading.process}
          showFraudScore={true}
        />
      </Modal>

      {/* Modal Reembolso */}
      <Modal
        isOpen={ui.modals.refund}
        onClose={() => {
          toggleModal('refund', false);
          setSelectedPayment(null);
        }}
        title="Procesar Reembolso"
        size="md"
      >
        <RefundForm
          payment={selectedPayment}
          onSubmit={handleRefundPayment}
          onCancel={() => {
            toggleModal('refund', false);
            setSelectedPayment(null);
          }}
          loading={loading.refund}
        />
      </Modal>

      {/* Modal Detalle de Pago */}
      <Modal
        isOpen={ui.modals.detail}
        onClose={() => {
          toggleModal('detail', false);
          setSelectedPayment(null);
        }}
        title="Detalles del Pago"
        size="xl"
      >
        {selectedPayment && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Información de la Transacción
                </h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Número</dt>
                    <dd className="text-sm text-gray-900 font-mono">{selectedPayment.numero}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Estado</dt>
                    <dd className="text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedPayment.status)}`}>
                        {getStatusText(selectedPayment.status)}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Monto Total</dt>
                    <dd className="text-sm text-gray-900 font-semibold">
                      {formatCurrency(selectedPayment.amount.total)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Gateway</dt>
                    <dd className="text-sm text-gray-900 capitalize">
                      {selectedPayment.gateway.provider}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Información del Paciente
                </h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Paciente</dt>
                    <dd className="text-sm text-gray-900">
                      {selectedPayment.patient?.nombres} {selectedPayment.patient?.apellidos}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="text-sm text-gray-900">{selectedPayment.patient?.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
                    <dd className="text-sm text-gray-900">{selectedPayment.patient?.telefono}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Desglose de montos */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Desglose de Montos
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Subtotal:</span>
                    <span className="text-sm text-gray-900">{formatCurrency(selectedPayment.amount.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Impuestos:</span>
                    <span className="text-sm text-gray-900">{formatCurrency(selectedPayment.amount.taxes)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Descuentos:</span>
                    <span className="text-sm text-green-600">-{formatCurrency(selectedPayment.amount.discounts)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Comisiones:</span>
                    <span className="text-sm text-gray-900">{formatCurrency(selectedPayment.amount.fees)}</span>
                  </div>
                  {selectedPayment.amount.insuranceCovered > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Cubierto por seguro:</span>
                      <span className="text-sm text-blue-600">{formatCurrency(selectedPayment.amount.insuranceCovered)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span className="text-sm text-gray-900">Total:</span>
                    <span className="text-sm text-gray-900">{formatCurrency(selectedPayment.amount.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <LoadingButton
                variant="outline"
                onClick={() => {
                  toggleModal('detail', false);
                  setSelectedPayment(null);
                }}
              >
                Cerrar
              </LoadingButton>
              <LoadingButton
                onClick={() => handleDownloadReceipt(selectedPayment)}
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar Recibo
              </LoadingButton>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PaymentsPage;