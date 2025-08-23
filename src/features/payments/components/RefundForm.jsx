import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { RotateCcw, X, AlertTriangle, DollarSign } from 'lucide-react';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import Input from '../../../shared/components/ui/Input';
import Card from '../../../shared/components/ui/Card';
import { RefundReason } from '../types/payment.types';
import { formatCurrency } from '../utils/paymentHelpers';

// Schema de validación para reembolsos
const refundSchema = yup.object().shape({
  amount: yup
    .number()
    .required('El monto es requerido')
    .min(0.01, 'El monto mínimo es S/ 0.01')
    .test('max-amount', 'El monto no puede exceder el monto reembolsable', function(value) {
      const { payment } = this.options.context || {};
      if (!payment) return true;
      return value <= (payment.refundableAmount || payment.amount.total);
    }),
  
  reason: yup
    .string()
    .required('Debe seleccionar un motivo'),
  
  notes: yup
    .string()
    .max(500, 'Las notas no pueden exceder 500 caracteres'),
  
  notifyCustomer: yup
    .boolean(),
  
  processImmediately: yup
    .boolean()
});

const RefundForm = ({ 
  payment,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue
  } = useForm({
    resolver: yupResolver(refundSchema),
    context: { payment },
    defaultValues: {
      amount: payment?.refundableAmount || payment?.amount?.total || 0,
      reason: '',
      notes: '',
      notifyCustomer: true,
      processImmediately: true
    }
  });

  const watchedAmount = watch('amount');
  const watchedReason = watch('reason');

  if (!payment) {
    return (
      <Card>
        <div className="text-center py-8">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error
          </h3>
          <p className="text-gray-600">
            No se pudo cargar la información del pago
          </p>
        </div>
      </Card>
    );
  }

  // Opciones de motivos de reembolso
  const refundReasons = [
    { value: RefundReason.CUSTOMER_REQUEST, label: 'Solicitud del cliente' },
    { value: RefundReason.APPOINTMENT_CANCELLED, label: 'Cita cancelada' },
    { value: RefundReason.SERVICE_NOT_PROVIDED, label: 'Servicio no prestado' },
    { value: RefundReason.BILLING_ERROR, label: 'Error de facturación' },
    { value: RefundReason.DUPLICATE_CHARGE, label: 'Cargo duplicado' },
    { value: RefundReason.FRAUD_PREVENTION, label: 'Prevención de fraude' },
    { value: RefundReason.SYSTEM_ERROR, label: 'Error del sistema' }
  ];

  // Calcular comisiones de reembolso
  const calculateRefundFees = (amount) => {
    const feePercentage = 0.02; // 2% de comisión por reembolso
    const fee = amount * feePercentage;
    return {
      fee: Math.round(fee * 100) / 100,
      netRefund: Math.round((amount - fee) * 100) / 100
    };
  };

  const refundFees = calculateRefundFees(watchedAmount || 0);

  // Determinar si es reembolso total o parcial
  const isFullRefund = watchedAmount === payment.amount.total;
  const refundType = isFullRefund ? 'total' : 'parcial';

  const onFormSubmit = async (data) => {
    const refundData = {
      ...data,
      type: refundType,
      fees: refundFees.fee,
      netAmount: refundFees.netRefund,
      originalPaymentId: payment.id,
      originalAmount: payment.amount.total
    };

    await onSubmit(refundData);
  };

  return (
    <Card title="Procesar Reembolso">
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Información del pago original */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Información del Pago Original
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Número:</span>
              <span className="ml-2 font-mono text-gray-900">{payment.numero}</span>
            </div>
            <div>
              <span className="text-gray-600">Monto:</span>
              <span className="ml-2 font-semibold text-gray-900">
                {formatCurrency(payment.amount.total)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Paciente:</span>
              <span className="ml-2 text-gray-900">
                {payment.patient?.nombres} {payment.patient?.apellidos}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Reembolsable:</span>
              <span className="ml-2 font-semibold text-green-600">
                {formatCurrency(payment.refundableAmount || payment.amount.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Monto del reembolso */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                label="Monto a Reembolsar"
                name="amount"
                type="number"
                step="0.01"
                register={register}
                error={errors.amount?.message}
                placeholder="0.00"
                required
                max={payment.refundableAmount || payment.amount.total}
              />
            </div>
            <div className="pt-6">
              <LoadingButton
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setValue('amount', payment.refundableAmount || payment.amount.total)}
              >
                Monto Completo
              </LoadingButton>
            </div>
          </div>

          {/* Información de comisiones */}
          {watchedAmount > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start">
                <DollarSign className="w-4 h-4 text-yellow-600 mt-0.5 mr-2" />
                <div className="text-sm">
                  <div className="font-medium text-yellow-800">
                    Desglose del Reembolso
                  </div>
                  <div className="mt-1 space-y-1 text-yellow-700">
                    <div className="flex justify-between">
                      <span>Monto solicitado:</span>
                      <span>{formatCurrency(watchedAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Comisión de reembolso (2%):</span>
                      <span>-{formatCurrency(refundFees.fee)}</span>
                    </div>
                    <div className="flex justify-between font-medium border-t border-yellow-300 pt-1">
                      <span>Monto neto a reembolsar:</span>
                      <span>{formatCurrency(refundFees.netRefund)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Motivo del reembolso */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Motivo del Reembolso *
          </label>
          <select
            {...register('reason')}
            className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.reason ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Seleccionar motivo</option>
            {refundReasons.map(reason => (
              <option key={reason.value} value={reason.value}>
                {reason.label}
              </option>
            ))}
          </select>
          {errors.reason && (
            <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>
          )}
        </div>

        {/* Notas adicionales */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notas Adicionales
          </label>
          <textarea
            {...register('notes')}
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Información adicional sobre el reembolso..."
          />
          {errors.notes && (
            <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
          )}
        </div>

        {/* Opciones adicionales */}
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('notifyCustomer')}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              Notificar al cliente por email
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('processImmediately')}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              Procesar inmediatamente
            </span>
          </label>
        </div>

        {/* Advertencias */}
        {watchedReason === RefundReason.FRAUD_PREVENTION && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
              <div>
                <h4 className="text-sm font-medium text-red-800">
                  Reembolso por Fraude
                </h4>
                <p className="text-sm text-red-700 mt-1">
                  Este reembolso será marcado como relacionado con fraude y se iniciará 
                  una investigación automática. El cliente será notificado según los 
                  protocolos de seguridad.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <LoadingButton
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </LoadingButton>
          
          <LoadingButton
            type="submit"
            loading={loading}
            loadingText="Procesando reembolso..."
            disabled={!isValid || loading}
            showSuccessState
            variant="danger"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Procesar Reembolso
          </LoadingButton>
        </div>

        {/* Información adicional */}
        <div className="text-xs text-gray-500 text-center pt-2 border-t">
          Los reembolsos pueden tardar de 3 a 5 días hábiles en reflejarse según el método de pago original.
          Se enviará una confirmación por email una vez procesado.
        </div>
      </form>
    </Card>
  );
};

export default RefundForm;