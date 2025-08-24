import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CreditCard, Smartphone, Banknote, Shield, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { useBooking } from '../store/bookingContext';
import { bookingApi } from '../services/bookingApi';
import { paymentCardSchema } from '../utils/bookingValidations';
import { formatCurrency } from '../utils/bookingHelpers';
import Card from '../../../shared/components/ui/Card';
import Input from '../../../shared/components/ui/Input';
import LoadingButton from '../../../shared/components/ui/LoadingButton';

const PaymentProcessor = () => {
  const { service, appointment, payment, setPayment, pricing, setPricing, setLoading, setError, clearError } = useBooking();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);

  const paymentMethods = [
    {
      id: 'card',
      name: 'Tarjeta de Crédito/Débito',
      description: 'Visa, MasterCard, American Express',
      icon: CreditCard,
      available: true
    },
    {
      id: 'transfer',
      name: 'Transferencia Bancaria',
      description: 'BCP, BBVA, Interbank, Scotiabank',
      icon: Smartphone,
      available: true
    },
    {
      id: 'cash',
      name: 'Pago en Consultorio',
      description: 'Efectivo o tarjeta en el lugar',
      icon: Banknote,
      available: true
    }
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(paymentCardSchema)
  });

  useEffect(() => {
    if (service) {
      calculatePricing();
    }
  }, [service]);

  const calculatePricing = () => {
    const subtotal = service.price;
    const tax = subtotal * 0.18; // IGV 18%
    const total = subtotal + tax;

    setPricing({
      subtotal,
      tax,
      discount: 0,
      total
    });
  };

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    setPaymentResult(null);
    clearError('payment');
  };

  const handleCardPayment = async (cardData) => {
    setIsProcessing(true);
    clearError('payment');

    try {
      const paymentData = {
        method: 'card',
        amount: pricing.total,
        cardData,
        bookingInfo: {
          serviceId: service.id,
          appointmentDate: appointment.date,
          appointmentTime: appointment.timeSlot.time
        }
      };

      const response = await bookingApi.processPayment(paymentData);

      if (response.success) {
        setPaymentResult({
          success: true,
          transactionId: response.data.transactionId,
          message: 'Pago procesado exitosamente'
        });

        setPayment({
          method: 'card',
          status: 'approved',
          transactionId: response.data.transactionId,
          amount: pricing.total
        });
      } else {
        setPaymentResult({
          success: false,
          message: response.error || 'Error en el procesamiento del pago'
        });
      }
    } catch (error) {
      setPaymentResult({
        success: false,
        message: 'Error en el procesamiento del pago. Intente nuevamente.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAlternativePayment = async (method) => {
    setIsProcessing(true);
    clearError('payment');

    try {
      // Simular procesamiento para métodos alternativos
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (method === 'cash') {
        setPaymentResult({
          success: true,
          message: 'Reserva confirmada. Pago pendiente en consultorio.'
        });

        setPayment({
          method: 'cash',
          status: 'pending',
          amount: pricing.total
        });
      } else if (method === 'transfer') {
        setPaymentResult({
          success: true,
          message: 'Instrucciones de transferencia enviadas por email.',
          transferCode: 'TRF-' + Date.now()
        });

        setPayment({
          method: 'transfer',
          status: 'pending',
          amount: pricing.total
        });
      }
    } catch (error) {
      setPaymentResult({
        success: false,
        message: 'Error al procesar la solicitud. Intente nuevamente.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderPaymentForm = () => {
    if (!selectedMethod) return null;

    if (selectedMethod.id === 'card') {
      return (
        <form onSubmit={handleSubmit(handleCardPayment)} className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">
                Pago seguro con encriptación SSL
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Input
              label="Número de Tarjeta"
              name="cardNumber"
              register={register}
              error={errors.cardNumber?.message}
              placeholder="1234 5678 9012 3456"
              maxLength={16}
            />

            <Input
              label="Nombre del Titular"
              name="cardName"
              register={register}
              error={errors.cardName?.message}
              placeholder="Como aparece en la tarjeta"
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Fecha de Vencimiento"
                name="expiryDate"
                register={register}
                error={errors.expiryDate?.message}
                placeholder="MM/YY"
                maxLength={5}
              />

              <Input
                label="CVV"
                name="cvv"
                register={register}
                error={errors.cvv?.message}
                placeholder="123"
                maxLength={4}
              />
            </div>
          </div>

          <LoadingButton
            type="submit"
            variant="primary"
            loading={isProcessing}
            loadingText="Procesando pago..."
            className="w-full"
            icon={<Lock className="w-4 h-4" />}
          >
            Pagar {formatCurrency(pricing.total)}
          </LoadingButton>
        </form>
      );
    }

    if (selectedMethod.id === 'transfer') {
      return (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Instrucciones de Transferencia</h4>
            <p className="text-sm text-blue-800">
              Se enviarán los datos bancarios a tu email para realizar la transferencia.
              Tu cita quedará reservada por 24 horas.
            </p>
          </div>

          <LoadingButton
            variant="primary"
            loading={isProcessing}
            loadingText="Generando instrucciones..."
            className="w-full"
            onClick={() => handleAlternativePayment('transfer')}
            icon={<Smartphone className="w-4 h-4" />}
          >
            Generar Código de Transferencia
          </LoadingButton>
        </div>
      );
    }

    if (selectedMethod.id === 'cash') {
      return (
        <div className="space-y-4">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">Pago en Consultorio</h4>
            <p className="text-sm text-yellow-800">
              Tu cita quedará reservada. Podrás pagar en efectivo o con tarjeta 
              directamente en el consultorio el día de tu cita.
            </p>
          </div>

          <LoadingButton
            variant="primary"
            loading={isProcessing}
            loadingText="Confirmando reserva..."
            className="w-full"
            onClick={() => handleAlternativePayment('cash')}
            icon={<Banknote className="w-4 h-4" />}
          >
            Confirmar Reserva
          </LoadingButton>
        </div>
      );
    }
  };

  return (
    <Card title="Procesar Pago" className="max-w-4xl mx-auto">
      <div className="space-y-6">
        <div className="text-center mb-6">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-gray-600">
            Selecciona tu método de pago preferido para confirmar tu cita
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Métodos de pago */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Métodos de Pago
              </h3>
              
              <div className="space-y-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() => handleMethodSelect(method)}
                      disabled={!method.available}
                      className={`
                        w-full p-4 border-2 rounded-lg text-left transition-all
                        ${selectedMethod?.id === method.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                        }
                        ${!method.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-6 h-6 ${
                          selectedMethod?.id === method.id ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                        <div>
                          <div className="font-medium text-gray-900">
                            {method.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {method.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Formulario de pago */}
            {selectedMethod && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {selectedMethod.name}
                </h3>
                {renderPaymentForm()}
              </div>
            )}

            {/* Resultado del pago */}
            {paymentResult && (
              <div className={`p-4 rounded-lg ${
                paymentResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center space-x-2">
                  {paymentResult.success ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className={`font-medium ${
                    paymentResult.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {paymentResult.message}
                  </span>
                </div>
                
                {paymentResult.transactionId && (
                  <div className="mt-2 text-sm text-green-700">
                    ID de Transacción: {paymentResult.transactionId}
                  </div>
                )}
                
                {paymentResult.transferCode && (
                  <div className="mt-2 text-sm text-blue-700">
                    Código de Transferencia: {paymentResult.transferCode}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Resumen de pago */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Resumen de Pago
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Servicio:</span>
                  <span className="font-medium">{service?.name}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>{formatCurrency(pricing.subtotal)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">IGV (18%):</span>
                  <span>{formatCurrency(pricing.tax)}</span>
                </div>
                
                {pricing.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Descuento:</span>
                    <span>-{formatCurrency(pricing.discount)}</span>
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>{formatCurrency(pricing.total)}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-blue-800">
                    Pago 100% seguro y encriptado
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </Card>
  );
};

export default PaymentProcessor;