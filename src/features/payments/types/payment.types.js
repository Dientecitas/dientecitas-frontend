// Tipos principales del sistema de pagos
export const PaymentStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  AUTHORIZED: 'authorized',
  CAPTURED: 'captured',
  SETTLED: 'settled',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
  DISPUTED: 'disputed',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'partially_refunded'
};

export const PaymentMethodType = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  BANK_TRANSFER: 'bank_transfer',
  CASH: 'cash',
  CHECK: 'check',
  DIGITAL_WALLET: 'digital_wallet',
  BUY_NOW_PAY_LATER: 'buy_now_pay_later',
  CRYPTOCURRENCY: 'cryptocurrency',
  INSURANCE_DIRECT_PAY: 'insurance_direct_pay'
};

export const PaymentGatewayProvider = {
  VISANET: 'visanet',
  CULQI: 'culqi',
  MERCADOPAGO: 'mercadopago',
  STRIPE: 'stripe',
  PAYPAL: 'paypal'
};

export const RefundReason = {
  CUSTOMER_REQUEST: 'customer_request',
  APPOINTMENT_CANCELLED: 'appointment_cancelled',
  SERVICE_NOT_PROVIDED: 'service_not_provided',
  BILLING_ERROR: 'billing_error',
  DUPLICATE_CHARGE: 'duplicate_charge',
  FRAUD_PREVENTION: 'fraud_prevention',
  SYSTEM_ERROR: 'system_error'
};

export const FraudRiskLevel = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

export const InsuranceClaimStatus = {
  SUBMITTED: 'submitted',
  PROCESSING: 'processing',
  APPROVED: 'approved',
  DENIED: 'denied',
  PAID: 'paid',
  APPEALED: 'appealed'
};

export const InstallmentPlanType = {
  FIXED: 'fixed',
  VARIABLE: 'variable',
  INTEREST_FREE: 'interest_free',
  PROMOTIONAL: 'promotional'
};

// Configuración de gateways
export const GatewayConfiguration = {
  [PaymentGatewayProvider.VISANET]: {
    name: 'Visanet Perú',
    supportedMethods: [PaymentMethodType.CREDIT_CARD, PaymentMethodType.DEBIT_CARD],
    supportedCurrencies: ['PEN'],
    fees: { percentage: 0.035, fixed: 0.50 },
    processingTime: 2000,
    capabilities: ['3d_secure', 'recurring', 'refunds']
  },
  [PaymentGatewayProvider.CULQI]: {
    name: 'Culqi',
    supportedMethods: [PaymentMethodType.CREDIT_CARD, PaymentMethodType.DEBIT_CARD],
    supportedCurrencies: ['PEN', 'USD'],
    fees: { percentage: 0.039, fixed: 0.30 },
    processingTime: 1500,
    capabilities: ['tokenization', 'subscriptions', 'marketplace']
  },
  [PaymentGatewayProvider.MERCADOPAGO]: {
    name: 'MercadoPago',
    supportedMethods: [PaymentMethodType.CREDIT_CARD, PaymentMethodType.DIGITAL_WALLET],
    supportedCurrencies: ['PEN', 'USD'],
    fees: { percentage: 0.041, fixed: 0.00 },
    processingTime: 2500,
    capabilities: ['installments', 'qr_payments', 'digital_wallet']
  }
};

// Validaciones de negocio
export const PaymentValidationRules = {
  MIN_AMOUNT: 1.00,
  MAX_AMOUNT: 50000.00,
  MAX_DAILY_AMOUNT: 10000.00,
  MAX_MONTHLY_AMOUNT: 100000.00,
  FRAUD_SCORE_THRESHOLD: 75,
  VELOCITY_LIMITS: {
    HOURLY: { count: 5, amount: 1000 },
    DAILY: { count: 20, amount: 5000 },
    WEEKLY: { count: 50, amount: 20000 }
  }
};

// Configuración de impuestos
export const TaxConfiguration = {
  IGV: {
    rate: 0.18,
    applies_to: ['services', 'products'],
    jurisdiction: 'PE'
  },
  ISC: {
    rate: 0.10,
    applies_to: ['luxury_services'],
    jurisdiction: 'PE'
  }
};