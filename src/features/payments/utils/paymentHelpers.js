import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

// Formateo de moneda
export const formatCurrency = (amount, currency = 'PEN') => {
  if (typeof amount !== 'number') return 'S/ 0.00';
  
  const currencySymbols = {
    PEN: 'S/',
    USD: '$',
    EUR: '€'
  };
  
  const symbol = currencySymbols[currency] || 'S/';
  return `${symbol} ${amount.toLocaleString('es-PE', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
};

// Formateo de porcentajes
export const formatPercentage = (value, decimals = 1) => {
  if (typeof value !== 'number') return '0%';
  return `${value.toFixed(decimals)}%`;
};

// Formateo de fechas
export const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    return format(parseISO(dateString), 'dd/MM/yyyy HH:mm', { locale: es });
  } catch (error) {
    return dateString;
  }
};

export const formatDateShort = (dateString) => {
  if (!dateString) return '';
  try {
    return format(parseISO(dateString), 'dd/MM/yyyy', { locale: es });
  } catch (error) {
    return dateString;
  }
};

// Estados de pagos
export const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    authorized: 'bg-purple-100 text-purple-800',
    captured: 'bg-green-100 text-green-800',
    settled: 'bg-emerald-100 text-emerald-800',
    failed: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800',
    expired: 'bg-orange-100 text-orange-800',
    disputed: 'bg-red-100 text-red-800',
    refunded: 'bg-indigo-100 text-indigo-800',
    partially_refunded: 'bg-indigo-100 text-indigo-800'
  };
  
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const getStatusText = (status) => {
  const texts = {
    pending: 'Pendiente',
    processing: 'Procesando',
    authorized: 'Autorizado',
    captured: 'Capturado',
    settled: 'Liquidado',
    failed: 'Fallido',
    cancelled: 'Cancelado',
    expired: 'Expirado',
    disputed: 'En Disputa',
    refunded: 'Reembolsado',
    partially_refunded: 'Reembolso Parcial'
  };
  
  return texts[status] || status;
};

// Métodos de pago
export const getMethodIcon = (method) => {
  const icons = {
    credit_card: 'CreditCard',
    debit_card: 'CreditCard',
    bank_transfer: 'Building',
    digital_wallet: 'Smartphone',
    cash: 'DollarSign',
    check: 'FileText',
    buy_now_pay_later: 'Calendar',
    cryptocurrency: 'Bitcoin',
    insurance_direct_pay: 'Shield'
  };
  
  return icons[method] || 'DollarSign';
};

export const getMethodText = (method) => {
  const texts = {
    credit_card: 'Tarjeta de Crédito',
    debit_card: 'Tarjeta de Débito',
    bank_transfer: 'Transferencia Bancaria',
    digital_wallet: 'Billetera Digital',
    cash: 'Efectivo',
    check: 'Cheque',
    buy_now_pay_later: 'Compra Ahora, Paga Después',
    cryptocurrency: 'Criptomoneda',
    insurance_direct_pay: 'Pago Directo de Seguro'
  };
  
  return texts[method] || method;
};

// Niveles de riesgo de fraude
export const getRiskColor = (riskLevel) => {
  const colors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
    critical: 'bg-red-200 text-red-900'
  };
  
  return colors[riskLevel] || 'bg-gray-100 text-gray-800';
};

export const getRiskText = (riskLevel) => {
  const texts = {
    low: 'Riesgo Bajo',
    medium: 'Riesgo Medio',
    high: 'Riesgo Alto',
    critical: 'Riesgo Crítico'
  };
  
  return texts[riskLevel] || riskLevel;
};

// Cálculos financieros
export const calculatePaymentFees = (amount, paymentMethod, gateway) => {
  const gatewayFees = {
    culqi: { percentage: 0.039, fixed: 0.30 },
    visanet: { percentage: 0.035, fixed: 0.50 },
    mercadopago: { percentage: 0.041, fixed: 0.00 },
    stripe: { percentage: 0.029, fixed: 0.30 },
    paypal: { percentage: 0.049, fixed: 0.00 }
  };

  const methodMultipliers = {
    credit_card: 1.0,
    debit_card: 0.8,
    bank_transfer: 0.5,
    digital_wallet: 0.7,
    cash: 0.0
  };

  const gatewayConfig = gatewayFees[gateway] || gatewayFees.culqi;
  const methodMultiplier = methodMultipliers[paymentMethod] || 1.0;

  const percentageFee = amount * gatewayConfig.percentage * methodMultiplier;
  const fixedFee = gatewayConfig.fixed * methodMultiplier;
  const totalFees = percentageFee + fixedFee;

  return {
    percentageFee: Math.round(percentageFee * 100) / 100,
    fixedFee: Math.round(fixedFee * 100) / 100,
    totalFees: Math.round(totalFees * 100) / 100,
    netAmount: Math.round((amount - totalFees) * 100) / 100
  };
};

export const calculateTaxes = (amount, taxRate = 0.18) => {
  const taxAmount = amount * taxRate;
  return {
    subtotal: Math.round((amount - taxAmount) * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    total: Math.round(amount * 100) / 100
  };
};

// Validaciones
export const validateCardNumber = (cardNumber) => {
  if (!cardNumber) return false;
  
  // Algoritmo de Luhn
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

export const detectCardBrand = (cardNumber) => {
  const patterns = {
    visa: /^4/,
    mastercard: /^5[1-5]/,
    amex: /^3[47]/,
    discover: /^6(?:011|5)/,
    diners: /^3[0689]/,
    jcb: /^35/
  };
  
  for (const [brand, pattern] of Object.entries(patterns)) {
    if (pattern.test(cardNumber)) {
      return brand;
    }
  }
  
  return 'unknown';
};

export const maskCardNumber = (cardNumber) => {
  if (!cardNumber) return '';
  const lastFour = cardNumber.slice(-4);
  return `**** **** **** ${lastFour}`;
};

// Generación de números únicos
export const generatePaymentNumber = () => {
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString().slice(-6);
  return `PAY-${year}-${timestamp}`;
};

export const generateInvoiceNumber = () => {
  const year = new Date().getFullYear();
  const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
  const timestamp = Date.now().toString().slice(-4);
  return `INV-${year}${month}-${timestamp}`;
};

// Utilidades de exportación
export const exportPaymentsToCSV = (payments) => {
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
    'Financiamiento',
    'Comisiones',
    'ID Transacción'
  ];

  const csvContent = [
    headers.join(','),
    ...payments.map(payment => [
      payment.numero,
      formatDateShort(payment.createdAt),
      `"${payment.patient?.nombres} ${payment.patient?.apellidos}"`,
      payment.amount.total,
      getMethodText(payment.paymentMethod.type),
      payment.gateway.provider,
      getStatusText(payment.status),
      payment.fraudScore || 0,
      payment.insurance ? 'Sí' : 'No',
      payment.installmentPlan ? 'Sí' : 'No',
      payment.amount.fees || 0,
      payment.gateway.transactionId
    ].join(','))
  ].join('\n');

  return csvContent;
};

// Análisis de patrones de pago
export const analyzePaymentPatterns = (payments) => {
  const patterns = {
    preferredMethods: {},
    averageAmounts: {},
    timePatterns: {},
    successRates: {}
  };

  payments.forEach(payment => {
    const method = payment.paymentMethod.type;
    const hour = new Date(payment.createdAt).getHours();
    const status = payment.status;

    // Métodos preferidos
    patterns.preferredMethods[method] = (patterns.preferredMethods[method] || 0) + 1;

    // Montos promedio por método
    if (!patterns.averageAmounts[method]) {
      patterns.averageAmounts[method] = { total: 0, count: 0 };
    }
    patterns.averageAmounts[method].total += payment.amount.total;
    patterns.averageAmounts[method].count += 1;

    // Patrones de tiempo
    patterns.timePatterns[hour] = (patterns.timePatterns[hour] || 0) + 1;

    // Tasas de éxito por método
    if (!patterns.successRates[method]) {
      patterns.successRates[method] = { successful: 0, total: 0 };
    }
    patterns.successRates[method].total += 1;
    if (['captured', 'settled'].includes(status)) {
      patterns.successRates[method].successful += 1;
    }
  });

  // Calcular promedios
  Object.keys(patterns.averageAmounts).forEach(method => {
    const data = patterns.averageAmounts[method];
    patterns.averageAmounts[method] = data.total / data.count;
  });

  // Calcular tasas de éxito
  Object.keys(patterns.successRates).forEach(method => {
    const data = patterns.successRates[method];
    patterns.successRates[method] = (data.successful / data.total) * 100;
  });

  return patterns;
};

// Predicciones y recomendaciones
export const generatePaymentRecommendations = (paymentData, customerHistory) => {
  const recommendations = [];

  // Recomendación de método de pago
  if (customerHistory.preferredMethod) {
    recommendations.push({
      type: 'payment_method',
      title: 'Método Recomendado',
      description: `Basado en su historial, recomendamos usar ${getMethodText(customerHistory.preferredMethod)}`,
      confidence: 0.8
    });
  }

  // Recomendación de gateway
  if (paymentData.amount > 1000) {
    recommendations.push({
      type: 'gateway',
      title: 'Gateway Sugerido',
      description: 'Para montos altos, recomendamos usar Visanet por su mayor tasa de éxito',
      confidence: 0.7
    });
  }

  // Recomendación de financiamiento
  if (paymentData.amount > 500) {
    recommendations.push({
      type: 'financing',
      title: 'Financiamiento Disponible',
      description: 'Puede dividir este pago en hasta 12 cuotas sin interés',
      confidence: 0.9
    });
  }

  return recommendations;
};