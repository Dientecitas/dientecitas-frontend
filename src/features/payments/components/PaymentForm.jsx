import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  CreditCard, 
  Building, 
  Smartphone, 
  DollarSign, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import LoadingButton from '../../../shared/components/ui/LoadingButton';
import Input from '../../../shared/components/ui/Input';
import Card from '../../../shared/components/ui/Card';
import { PaymentMethodType } from '../types/payment.types';

// Schema de validación para pagos
const paymentSchema = yup.object().shape({
  amount: yup
    .number()
    .required('El monto es requerido')
    .min(1, 'El monto mínimo es S/ 1.00')
    .max(50000, 'El monto máximo es S/ 50,000.00'),
  
  paymentMethod: yup
    .string()
    .required('Seleccione un método de pago'),
  
  // Validaciones para tarjeta de crédito
  cardNumber: yup
    .string()
    .when('paymentMethod', {
      is: (val) => ['credit_card', 'debit_card'].includes(val),
      then: (schema) => schema
        .required('Número de tarjeta requerido')
        .matches(/^\d{16}$/, 'Número de tarjeta inválido')
        .test('luhn', 'Número de tarjeta inválido', (value) => {
          if (!value) return false;
          return validateLuhn(value);
        })
    }),
  
  cardholderName: yup
    .string()
    .when('paymentMethod', {
      is: (val) => ['credit_card', 'debit_card'].includes(val),
      then: (schema) => schema
        .required('Nombre del titular requerido')
        .min(2, 'Nombre muy corto')
    }),
  
  expiryMonth: yup
    .number()
    .when('paymentMethod', {
      is: (val) => ['credit_card', 'debit_card'].includes(val),
      then: (schema) => schema
        .required('Mes de vencimiento requerido')
        .min(1, 'Mes inválido')
        .max(12, 'Mes inválido')
    }),
  
  expiryYear: yup
    .number()
    .when('paymentMethod', {
      is: (val) => ['credit_card', 'debit_card'].includes(val),
      then: (schema) => schema
        .required('Año de vencimiento requerido')
        .min(new Date().getFullYear(), 'Tarjeta vencida')
        .max(new Date().getFullYear() + 10, 'Año inválido')
    }),
  
  cvv: yup
    .string()
    .when('paymentMethod', {
      is: (val) => ['credit_card', 'debit_card'].includes(val),
      then: (schema) => schema
        .required('CVV requerido')
        .matches(/^\d{3,4}$/, 'CVV inválido')
    }),
  
  // Validaciones para transferencia bancaria
  bankCode: yup
    .string()
    .when('paymentMethod', {
      is: 'bank_transfer',
      then: (schema) => schema.required('Seleccione un banco')
    }),
  
  accountNumber: yup
    .string()
    .when('paymentMethod', {
      is: 'bank_transfer',
      then: (schema) => schema
        .required('Número de cuenta requerido')
        .matches(/^\d{10,20}$/, 'Número de cuenta inválido')
    })
});

// Algoritmo de Luhn para validación de tarjetas
const validateLuhn = (cardNumber) => {
  let sum = 0;
  let isEven = false;
  
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

// Detectar tipo de tarjeta
const detectCardBrand = (cardNumber) => {
  const patterns = {
    visa: /^4/,
    mastercard: /^5[1-5]/,
    amex: /^3[47]/,
    discover: /^6(?:011|5)/,
    diners: /^3[0689]/
  };
  
  for (const [brand, pattern] of Object.entries(patterns)) {
    if (pattern.test(cardNumber)) {
      return brand;
    }
  }
  
  return 'unknown';
};

const PaymentForm = ({ 
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
  showFraudScore = false,
  enableInstallments = true,
  enableInsurance = true
}) => {
  const [selectedMethod, setSelectedMethod] = useState(initialData?.paymentMethod || '');
  const [cardBrand, setCardBrand] = useState('');
  const [fraudScore, setFraudScore] = useState(null);
  const [showCvv, setShowCvv] = useState(false);
  const [processingStep, setProcessingStep] = useState('form'); // 'form' | 'processing' | 'success' | 'error'

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    trigger
  } = useForm({
    resolver: yupResolver(paymentSchema),
    mode: 'onChange',
    defaultValues: {
      amount: initialData?.amount?.total || '',
      paymentMethod: initialData?.paymentMethod || '',
      cardNumber: '',
      cardholderName: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      bankCode: '',
      accountNumber: '',
      savePaymentMethod: false,
      acceptTerms: false
    }
  });

  const watchedCardNumber = watch('cardNumber');
  const watchedPaymentMethod = watch('paymentMethod');

  // Detectar marca de tarjeta cuando cambia el número
  useEffect(() => {
    if (watchedCardNumber && watchedCardNumber.length >= 4) {
      const brand = detectCardBrand(watchedCardNumber);
      setCardBrand(brand);
    } else {
      setCardBrand('');
    }
  }, [watchedCardNumber]);

  // Actualizar método seleccionado
  useEffect(() => {
    setSelectedMethod(watchedPaymentMethod);
  }, [watchedPaymentMethod]);

  // Métodos de pago disponibles
  const paymentMethods = [
    {
      id: PaymentMethodType.CREDIT_CARD,
      name: 'Tarjeta de Crédito',
      icon: CreditCard,
      description: 'Visa, Mastercard, American Express',
      fees: 'Comisión: 3.5% + S/ 0.50',
      popular: true
    },
    {
      id: PaymentMethodType.DEBIT_CARD,
      name: 'Tarjeta de Débito',
      icon: CreditCard,
      description: 'Débito directo desde tu cuenta',
      fees: 'Comisión: 2.5% + S/ 0.30'
    },
    {
      id: PaymentMethodType.BANK_TRANSFER,
      name: 'Transferencia Bancaria',
      icon: Building,
      description: 'Transferencia desde tu banco',
      fees: 'Sin comisión adicional'
    },
    {
      id: PaymentMethodType.DIGITAL_WALLET,
      name: 'Billetera Digital',
      icon: Smartphone,
      description: 'Yape, Plin, PayPal',
      fees: 'Comisión: 2.0%'
    },
    {
      id: PaymentMethodType.CASH,
      name: 'Efectivo',
      icon: DollarSign,
      description: 'Pago en efectivo en clínica',
      fees: 'Sin comisión'
    }
  ];

  // Bancos disponibles para transferencia
  const banks = [
    { code: 'BCP', name: 'Banco de Crédito del Perú' },
    { code: 'BBVA', name: 'BBVA Continental' },
    { code: 'SCOTIABANK', name: 'Scotiabank Perú' },
    { code: 'INTERBANK', name: 'Interbank' },
    { code: 'BIF', name: 'Banco Interamericano de Finanzas' }
  ];

  // Formatear número de tarjeta
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Manejar cambio en número de tarjeta
  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setValue('cardNumber', formatted.replace(/\s/g, ''));
    trigger('cardNumber');
  };

  // Simular análisis de fraude
  const simulateFraudAnalysis = async (formData) => {
    setProcessingStep('processing');
    
    // Simular delay de análisis
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Calcular score de fraude simulado
    let score = Math.floor(Math.random() * 30); // Base score bajo
    
    // Factores que aumentan el score
    if (formData.amount > 1000) score += 20;
    if (formData.paymentMethod === 'credit_card' && !formData.savePaymentMethod) score += 10;
    
    setFraudScore(score);
    
    if (score > 70) {
      setProcessingStep('error');
      throw new Error('Transacción bloqueada por seguridad');
    }
    
    return score;
  };

  // Manejar envío del formulario
  const onFormSubmit = async (data) => {
    try {
      setProcessingStep('processing');
      
      // Análisis de fraude si está habilitado
      if (showFraudScore) {
        await simulateFraudAnalysis(data);
      }
      
      // Preparar datos del pago
      const paymentData = {
        ...data,
        fraudScore,
        deviceFingerprint: navigator.userAgent,
        ipAddress: '192.168.1.100', // En producción sería real
        timestamp: new Date().toISOString()
      };
      
      await onSubmit(paymentData);
      setProcessingStep('success');
      
    } catch (error) {
      setProcessingStep('error');
      throw error;
    }
  };

  // Renderizar campos específicos por método de pago
  const renderPaymentMethodFields = () => {
    switch (selectedMethod) {
      case PaymentMethodType.CREDIT_CARD:
      case PaymentMethodType.DEBIT_CARD:
        return (
          <div className="space-y-4">
            <div className="relative">
              <Input
                label="Número de Tarjeta"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                onChange={handleCardNumberChange}
                error={errors.cardNumber?.message}
                required
                className="pr-12"
              />
              {cardBrand && (
                <div className="absolute right-3 top-8 flex items-center">
                  <span className="text-xs font-medium text-gray-600 capitalize">
                    {cardBrand}
                  </span>
                </div>
              )}
            </div>

            <Input
              label="Nombre del Titular"
              name="cardholderName"
              register={register}
              placeholder="Como aparece en la tarjeta"
              error={errors.cardholderName?.message}
              required
              className="uppercase"
            />

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mes *
                </label>
                <select
                  {...register('expiryMonth')}
                  className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.expiryMonth ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">MM</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <option key={month} value={month}>
                      {month.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
                {errors.expiryMonth && (
                  <p className="mt-1 text-sm text-red-600">{errors.expiryMonth.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Año *
                </label>
                <select
                  {...register('expiryYear')}
                  className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.expiryYear ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">YYYY</option>
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                {errors.expiryYear && (
                  <p className="mt-1 text-sm text-red-600">{errors.expiryYear.message}</p>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV *
                </label>
                <div className="relative">
                  <input
                    {...register('cvv')}
                    type={showCvv ? 'text' : 'password'}
                    placeholder="123"
                    maxLength="4"
                    className={`mt-1 block w-full px-3 py-2 pr-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.cvv ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCvv(!showCvv)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCvv ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.cvv && (
                  <p className="mt-1 text-sm text-red-600">{errors.cvv.message}</p>
                )}
              </div>
            </div>
          </div>
        );

      case PaymentMethodType.BANK_TRANSFER:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Banco *
              </label>
              <select
                {...register('bankCode')}
                className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.bankCode ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar banco</option>
                {banks.map(bank => (
                  <option key={bank.code} value={bank.code}>
                    {bank.name}
                  </option>
                ))}
              </select>
              {errors.bankCode && (
                <p className="mt-1 text-sm text-red-600">{errors.bankCode.message}</p>
              )}
            </div>

            <Input
              label="Número de Cuenta"
              name="accountNumber"
              register={register}
              placeholder="1234567890123456"
              error={errors.accountNumber?.message}
              required
            />
          </div>
        );

      case PaymentMethodType.DIGITAL_WALLET:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {['yape', 'plin', 'paypal'].map(wallet => (
                <div
                  key={wallet}
                  className="p-4 border rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
                >
                  <div className="text-center">
                    <Smartphone className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                    <span className="text-sm font-medium capitalize">{wallet}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case PaymentMethodType.CASH:
        return (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800">
                  Pago en Efectivo
                </h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Deberá realizar el pago en efectivo al momento de la cita en la clínica seleccionada.
                  Se generará un código de reserva que deberá presentar.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Renderizar análisis de fraude
  const renderFraudAnalysis = () => {
    if (!showFraudScore || !fraudScore) return null;

    const getRiskColor = (score) => {
      if (score < 30) return 'text-green-600 bg-green-100';
      if (score < 60) return 'text-yellow-600 bg-yellow-100';
      return 'text-red-600 bg-red-100';
    };

    const getRiskText = (score) => {
      if (score < 30) return 'Riesgo Bajo';
      if (score < 60) return 'Riesgo Medio';
      return 'Riesgo Alto';
    };

    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-900">
            Análisis de Seguridad
          </h4>
          <Shield className="w-4 h-4 text-gray-600" />
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(fraudScore)}`}>
            {getRiskText(fraudScore)} ({fraudScore}/100)
          </div>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                fraudScore < 30 ? 'bg-green-500' : fraudScore < 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${fraudScore}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  // Renderizar estado de procesamiento
  if (processingStep === 'processing') {
    return (
      <Card>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Procesando Pago
          </h3>
          <p className="text-gray-600">
            Verificando información y procesando la transacción...
          </p>
          {showFraudScore && (
            <div className="mt-4">
              <div className="text-sm text-gray-500">Analizando seguridad...</div>
            </div>
          )}
        </div>
      </Card>
    );
  }

  if (processingStep === 'success') {
    return (
      <Card>
        <div className="text-center py-8">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            ¡Pago Exitoso!
          </h3>
          <p className="text-gray-600 mb-4">
            Su pago ha sido procesado correctamente.
          </p>
          <LoadingButton
            onClick={() => setProcessingStep('form')}
            variant="outline"
          >
            Realizar Otro Pago
          </LoadingButton>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Procesar Pago">
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Monto */}
        <div>
          <Input
            label="Monto a Pagar"
            name="amount"
            type="number"
            step="0.01"
            register={register}
            error={errors.amount?.message}
            placeholder="0.00"
            required
            className="text-lg font-medium"
          />
        </div>

        {/* Métodos de pago */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Método de Pago *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {paymentMethods.map(method => {
              const IconComponent = method.icon;
              const isSelected = selectedMethod === method.id;
              
              return (
                <div
                  key={method.id}
                  className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setValue('paymentMethod', method.id)}
                >
                  <input
                    type="radio"
                    {...register('paymentMethod')}
                    value={method.id}
                    className="sr-only"
                  />
                  
                  <div className="flex items-start">
                    <IconComponent className={`w-5 h-5 mt-0.5 mr-3 ${
                      isSelected ? 'text-blue-600' : 'text-gray-600'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className={`text-sm font-medium ${
                          isSelected ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {method.name}
                        </h4>
                        {method.popular && (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {method.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {method.fees}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {errors.paymentMethod && (
            <p className="mt-1 text-sm text-red-600">{errors.paymentMethod.message}</p>
          )}
        </div>

        {/* Campos específicos del método de pago */}
        {selectedMethod && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Información de Pago
            </h3>
            {renderPaymentMethodFields()}
          </div>
        )}

        {/* Análisis de fraude */}
        {renderFraudAnalysis()}

        {/* Opciones adicionales */}
        {selectedMethod && ['credit_card', 'debit_card'].includes(selectedMethod) && (
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('savePaymentMethod')}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Guardar método de pago para futuras transacciones
              </span>
            </label>
          </div>
        )}

        {/* Términos y condiciones */}
        <div className="border-t pt-4">
          <label className="flex items-start">
            <input
              type="checkbox"
              {...register('acceptTerms')}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5"
              required
            />
            <span className="ml-2 text-sm text-gray-700">
              Acepto los{' '}
              <a href="#" className="text-blue-600 hover:text-blue-500">
                términos y condiciones
              </a>{' '}
              y la{' '}
              <a href="#" className="text-blue-600 hover:text-blue-500">
                política de privacidad
              </a>
            </span>
          </label>
        </div>

        {/* Información de seguridad */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-900">
              Transacción Segura
            </span>
          </div>
          <p className="text-xs text-gray-600">
            Sus datos están protegidos con encriptación SSL de 256 bits y cumplimos con los 
            estándares PCI DSS para el manejo seguro de información de tarjetas.
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <LoadingButton
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </LoadingButton>
          
          <LoadingButton
            type="submit"
            loading={loading}
            loadingText="Procesando..."
            disabled={!isValid || loading}
            showSuccessState
            className="bg-green-600 hover:bg-green-700"
          >
            <Lock className="w-4 h-4 mr-2" />
            Procesar Pago
          </LoadingButton>
        </div>
      </form>
    </Card>
  );
};

export default PaymentForm;