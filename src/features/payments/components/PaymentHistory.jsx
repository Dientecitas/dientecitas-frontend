import React, { useState } from 'react';
import { 
  Eye, 
  Download, 
  RefreshCw, 
  CreditCard, 
  Building, 
  Smartphone,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Receipt,
  RotateCcw
} from 'lucide-react';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import Card from '../../../shared/components/ui/Card';
import TableLoader from '../../../shared/components/ui/TableLoader';
import { usePaymentContext } from '../store/paymentContext';
import { usePayments } from '../hooks/usePayments';
import { formatCurrency, formatDate, getStatusColor, getStatusText, getMethodIcon } from '../utils/paymentHelpers';

const PaymentHistory = ({ 
  onView, 
  onRefund, 
  onDownloadReceipt,
  showActions = true,
  patientId = null // Para filtrar por paciente específico
}) => {
  const {
    payments,
    pagination,
    ui,
    setSelectedPayment
  } = usePaymentContext();

  const { 
    loading, 
    changePage, 
    changeLimit,
    refundPayment,
    fetchPayments
  } = usePayments();

  const [selectedPayments, setSelectedPayments] = useState([]);

  // Filtrar pagos por paciente si se especifica
  const displayPayments = patientId 
    ? payments.filter(p => p.patientId === patientId)
    : payments;

  // Manejar selección múltiple
  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = displayPayments.map(p => p.id);
      setSelectedPayments(allIds);
    } else {
      setSelectedPayments([]);
    }
  };

  const handleSelectPayment = (paymentId, checked) => {
    if (checked) {
      setSelectedPayments(prev => [...prev, paymentId]);
    } else {
      setSelectedPayments(prev => prev.filter(id => id !== paymentId));
    }
  };

  // Obtener icono del método de pago
  const getPaymentMethodIcon = (method) => {
    const icons = {
      credit_card: CreditCard,
      debit_card: CreditCard,
      bank_transfer: Building,
      digital_wallet: Smartphone,
      cash: DollarSign
    };
    return icons[method] || DollarSign;
  };

  // Obtener icono del estado
  const getStatusIcon = (status) => {
    const icons = {
      captured: CheckCircle,
      settled: CheckCircle,
      pending: Clock,
      processing: Clock,
      failed: XCircle,
      cancelled: XCircle,
      refunded: RotateCcw,
      partially_refunded: RotateCcw,
      disputed: AlertTriangle
    };
    return icons[status] || Clock;
  };

  // Manejar acciones
  const handleAction = async (action, payment) => {
    setSelectedPayment(payment);
    
    switch (action) {
      case 'view':
        onView?.(payment);
        break;
      case 'refund':
        onRefund?.(payment);
        break;
      case 'receipt':
        onDownloadReceipt?.(payment);
        break;
    }
  };

  // Acciones masivas
  const handleBulkAction = async (action) => {
    if (selectedPayments.length === 0) return;

    try {
      switch (action) {
        case 'download_receipts':
          // Implementar descarga masiva de recibos
          console.log('Descargando recibos para:', selectedPayments);
          break;
        case 'export_selected':
          // Implementar exportación de pagos seleccionados
          console.log('Exportando pagos seleccionados:', selectedPayments);
          break;
      }
      setSelectedPayments([]);
    } catch (error) {
      console.error('Error en acción masiva:', error);
    }
  };

  // Componente de paginación
  const Pagination = () => {
    if (pagination.totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
        <div className="flex justify-between flex-1 sm:hidden">
          <LoadingButton
            variant="outline"
            onClick={() => changePage(pagination.page - 1)}
            disabled={pagination.page === 1 || loading.payments}
          >
            Anterior
          </LoadingButton>
          <LoadingButton
            variant="outline"
            onClick={() => changePage(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages || loading.payments}
          >
            Siguiente
          </LoadingButton>
        </div>

        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Mostrando{' '}
              <span className="font-medium">
                {(pagination.page - 1) * pagination.limit + 1}
              </span>{' '}
              a{' '}
              <span className="font-medium">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{' '}
              de{' '}
              <span className="font-medium">{pagination.total}</span>{' '}
              pagos
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={pagination.limit}
              onChange={(e) => changeLimit(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
              disabled={loading.payments}
            >
              <option value={10}>10 por página</option>
              <option value={25}>25 por página</option>
              <option value={50}>50 por página</option>
            </select>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Historial de Pagos ({pagination.total})
          </h3>
          <div className="flex items-center gap-2">
            <LoadingButton
              variant="outline"
              size="sm"
              onClick={() => fetchPayments()}
              loading={loading.payments}
            >
              <RefreshCw className="w-4 h-4" />
            </LoadingButton>
          </div>
        </div>

        {/* Acciones masivas */}
        {selectedPayments.length > 0 && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <span className="text-sm text-blue-700">
              {selectedPayments.length} pagos seleccionados
            </span>
            <LoadingButton
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction('download_receipts')}
            >
              <Receipt className="w-4 h-4 mr-1" />
              Descargar Recibos
            </LoadingButton>
            <LoadingButton
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction('export_selected')}
            >
              <Download className="w-4 h-4 mr-1" />
              Exportar
            </LoadingButton>
          </div>
        )}

        {/* Tabla de pagos */}
        {loading.payments ? (
          <TableLoader rows={5} columns={8} />
        ) : displayPayments.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <div className="text-gray-500 mb-2">No se encontraron pagos</div>
            <p className="text-sm text-gray-400">
              No hay transacciones que coincidan con los filtros aplicados
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedPayments.length === displayPayments.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transacción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paciente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Método de Pago
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gateway
                  </th>
                  {showActions && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayPayments.map((payment) => {
                  const PaymentMethodIcon = getPaymentMethodIcon(payment.paymentMethod.type);
                  const StatusIcon = getStatusIcon(payment.status);
                  
                  return (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedPayments.includes(payment.id)}
                          onChange={(e) => handleSelectPayment(payment.id, e.target.checked)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 font-mono">
                            {payment.numero}
                          </div>
                          <div className="text-sm text-gray-500">
                            {payment.appointment?.motivo}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {payment.patient?.nombres} {payment.patient?.apellidos}
                          </div>
                          <div className="text-sm text-gray-500">
                            {payment.patient?.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <PaymentMethodIcon className="w-4 h-4 text-gray-600 mr-2" />
                          <div>
                            <div className="text-sm text-gray-900 capitalize">
                              {payment.paymentMethod.type.replace('_', ' ')}
                            </div>
                            <div className="text-sm text-gray-500">
                              {payment.paymentMethod.details.cardNumber && 
                                `**** ${payment.paymentMethod.details.cardNumber}`}
                              {payment.paymentMethod.details.bankName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(payment.amount.total)}
                          </div>
                          {payment.amount.insuranceCovered > 0 && (
                            <div className="text-xs text-green-600">
                              Seguro: {formatCurrency(payment.amount.insuranceCovered)}
                            </div>
                          )}
                          {payment.installmentPlan && (
                            <div className="text-xs text-blue-600">
                              {payment.installmentPlan.numberOfPayments} cuotas
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <StatusIcon className={`w-4 h-4 mr-2 ${
                            ['captured', 'settled'].includes(payment.status) ? 'text-green-600' :
                            ['pending', 'processing'].includes(payment.status) ? 'text-yellow-600' :
                            'text-red-600'
                          }`} />
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                            {getStatusText(payment.status)}
                          </span>
                        </div>
                        {payment.fraudScore > 50 && (
                          <div className="flex items-center mt-1">
                            <AlertTriangle className="w-3 h-3 text-orange-500 mr-1" />
                            <span className="text-xs text-orange-600">
                              Riesgo: {payment.fraudScore}/100
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(payment.createdAt)}
                        </div>
                        {payment.processedAt && (
                          <div className="text-xs text-gray-500">
                            Procesado: {formatDate(payment.processedAt)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 capitalize">
                          {payment.gateway.provider}
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                          {payment.gateway.transactionId}
                        </div>
                      </td>
                      {showActions && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <LoadingButton
                              size="sm"
                              variant="outline"
                              onClick={() => handleAction('view', payment)}
                              title="Ver detalles"
                            >
                              <Eye className="w-4 h-4" />
                            </LoadingButton>
                            
                            <LoadingButton
                              size="sm"
                              variant="outline"
                              onClick={() => handleAction('receipt', payment)}
                              title="Descargar recibo"
                            >
                              <Receipt className="w-4 h-4" />
                            </LoadingButton>
                            
                            {['captured', 'settled'].includes(payment.status) && (
                              <LoadingButton
                                size="sm"
                                variant="outline"
                                onClick={() => handleAction('refund', payment)}
                                title="Reembolsar"
                                disabled={payment.refundableAmount <= 0}
                              >
                                <RotateCcw className="w-4 h-4" />
                              </LoadingButton>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <Pagination />
      </div>
    </Card>
  );
};

export default PaymentHistory;