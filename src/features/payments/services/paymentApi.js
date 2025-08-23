import api from '../../../shared/services/apiService';

// Mock data para desarrollo
const mockPayments = [
  {
    id: '1',
    numero: 'PAY-2024-001234',
    appointmentId: '1',
    patientId: 'p1',
    clinicId: 'c1',
    dentistaId: 'd1',
    amount: {
      subtotal: 150.00,
      taxes: 27.00,
      discounts: 0.00,
      fees: 5.25,
      total: 182.25,
      insuranceCovered: 0.00,
      patientResponsibility: 182.25,
      currency: 'PEN'
    },
    paymentMethod: {
      type: 'credit_card',
      details: {
        cardNumber: '****1234',
        cardBrand: 'Visa',
        cardType: 'Credit',
        expiryMonth: 12,
        expiryYear: 2025,
        cardholderName: 'Juan Pérez'
      }
    },
    gateway: {
      provider: 'culqi',
      transactionId: 'txn_123456789',
      authorizationCode: 'AUTH123',
      referenceNumber: 'REF789'
    },
    status: 'captured',
    fraudScore: 15,
    riskLevel: 'low',
    createdAt: '2024-01-15T10:30:00Z',
    processedAt: '2024-01-15T10:30:15Z',
    patient: {
      nombres: 'Juan Carlos',
      apellidos: 'Pérez García',
      email: 'juan.perez@email.com',
      telefono: '987654321'
    },
    appointment: {
      fecha: '2024-01-15',
      horaInicio: '10:00',
      motivo: 'Limpieza dental'
    }
  },
  {
    id: '2',
    numero: 'PAY-2024-001235',
    appointmentId: '2',
    patientId: 'p2',
    clinicId: 'c1',
    dentistaId: 'd2',
    amount: {
      subtotal: 300.00,
      taxes: 54.00,
      discounts: 30.00,
      fees: 10.50,
      total: 334.50,
      insuranceCovered: 240.00,
      patientResponsibility: 94.50,
      currency: 'PEN'
    },
    paymentMethod: {
      type: 'bank_transfer',
      details: {
        bankName: 'BCP',
        accountNumber: '****5678',
        accountType: 'Savings'
      }
    },
    gateway: {
      provider: 'visanet',
      transactionId: 'txn_987654321',
      referenceNumber: 'REF456'
    },
    status: 'pending',
    fraudScore: 8,
    riskLevel: 'low',
    createdAt: '2024-01-16T14:20:00Z',
    patient: {
      nombres: 'Ana María',
      apellidos: 'Rodríguez Silva',
      email: 'ana.rodriguez@email.com',
      telefono: '987654322'
    },
    appointment: {
      fecha: '2024-01-16',
      horaInicio: '14:00',
      motivo: 'Endodoncia'
    },
    insurance: {
      insuranceId: 'ins1',
      policyNumber: 'POL123456',
      coveragePercentage: 80,
      claimNumber: 'CLM789',
      claimStatus: 'approved'
    }
  },
  {
    id: '3',
    numero: 'PAY-2024-001236',
    appointmentId: '3',
    patientId: 'p3',
    clinicId: 'c2',
    dentistaId: 'd1',
    amount: {
      subtotal: 800.00,
      taxes: 144.00,
      discounts: 0.00,
      fees: 28.00,
      total: 972.00,
      insuranceCovered: 0.00,
      patientResponsibility: 972.00,
      currency: 'PEN'
    },
    paymentMethod: {
      type: 'buy_now_pay_later',
      details: {
        provider: 'Aflore',
        planType: 'interest_free',
        numberOfPayments: 6
      }
    },
    gateway: {
      provider: 'mercadopago',
      transactionId: 'txn_555666777'
    },
    status: 'captured',
    fraudScore: 25,
    riskLevel: 'low',
    createdAt: '2024-01-17T09:15:00Z',
    processedAt: '2024-01-17T09:15:30Z',
    patient: {
      nombres: 'Luis Alberto',
      apellidos: 'Vargas Torres',
      email: 'luis.vargas@email.com',
      telefono: '987654323'
    },
    appointment: {
      fecha: '2024-01-17',
      horaInicio: '09:00',
      motivo: 'Implante dental'
    },
    installmentPlan: {
      id: 'plan1',
      type: 'interest_free',
      numberOfPayments: 6,
      paymentFrequency: 'monthly',
      regularPaymentAmount: 162.00,
      remainingBalance: 810.00,
      paymentsCompleted: 1
    }
  }
];

const mockStats = {
  totalPayments: 156,
  totalAmount: 45680.50,
  averageAmount: 292.82,
  successRate: 94.2,
  failureRate: 5.8,
  refundRate: 2.1,
  fraudRate: 0.3,
  paymentMethodDistribution: [
    { method: 'credit_card', count: 89, percentage: 57.1, totalAmount: 26108.30 },
    { method: 'bank_transfer', count: 34, percentage: 21.8, totalAmount: 12456.80 },
    { method: 'cash', count: 21, percentage: 13.5, totalAmount: 4567.20 },
    { method: 'digital_wallet', count: 12, percentage: 7.7, totalAmount: 2548.20 }
  ],
  gatewayPerformance: [
    { gateway: 'culqi', count: 67, successRate: 96.1, totalFees: 890.45 },
    { gateway: 'visanet', count: 45, successRate: 92.3, totalFees: 675.30 },
    { gateway: 'mercadopago', count: 44, successRate: 93.8, totalFees: 1205.60 }
  ],
  monthlyTrends: [
    { month: '2024-01', amount: 15680.50, count: 52 },
    { month: '2024-02', amount: 18920.30, count: 61 },
    { month: '2024-03', amount: 11079.70, count: 43 }
  ]
};

// Simulación de delay de red
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Simulación de errores aleatorios (3% de probabilidad)
const shouldSimulateError = () => Math.random() < 0.03;

class PaymentApiService {
  constructor() {
    this.payments = [...mockPayments];
    this.stats = { ...mockStats };
  }

  async getPayments(filters = {}, pagination = { page: 1, limit: 10 }) {
    await delay(400);
    
    if (shouldSimulateError()) {
      throw new Error('Error al cargar los pagos. Intente nuevamente.');
    }

    let filteredPayments = [...this.payments];

    // Aplicar filtros
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredPayments = filteredPayments.filter(payment =>
        payment.numero.toLowerCase().includes(searchLower) ||
        payment.patient?.nombres?.toLowerCase().includes(searchLower) ||
        payment.patient?.apellidos?.toLowerCase().includes(searchLower) ||
        payment.patient?.email?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.dateFrom) {
      filteredPayments = filteredPayments.filter(p => p.createdAt >= filters.dateFrom);
    }

    if (filters.dateTo) {
      filteredPayments = filteredPayments.filter(p => p.createdAt <= filters.dateTo);
    }

    if (filters.status?.length > 0) {
      filteredPayments = filteredPayments.filter(p => filters.status.includes(p.status));
    }

    if (filters.paymentMethods?.length > 0) {
      filteredPayments = filteredPayments.filter(p => 
        filters.paymentMethods.includes(p.paymentMethod.type)
      );
    }

    if (filters.gateways?.length > 0) {
      filteredPayments = filteredPayments.filter(p => 
        filters.gateways.includes(p.gateway.provider)
      );
    }

    if (filters.amountMin) {
      filteredPayments = filteredPayments.filter(p => p.amount.total >= filters.amountMin);
    }

    if (filters.amountMax) {
      filteredPayments = filteredPayments.filter(p => p.amount.total <= filters.amountMax);
    }

    // Aplicar ordenamiento
    if (filters.sortBy) {
      filteredPayments.sort((a, b) => {
        let aValue = a[filters.sortBy];
        let bValue = b[filters.sortBy];

        if (filters.sortBy === 'createdAt') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        } else if (filters.sortBy === 'amount') {
          aValue = a.amount.total;
          bValue = b.amount.total;
        } else if (filters.sortBy === 'patient') {
          aValue = `${a.patient?.nombres} ${a.patient?.apellidos}`.toLowerCase();
          bValue = `${b.patient?.nombres} ${b.patient?.apellidos}`.toLowerCase();
        }

        if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Aplicar paginación
    const total = filteredPayments.length;
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    const paginatedPayments = filteredPayments.slice(startIndex, endIndex);

    return {
      data: paginatedPayments,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit)
      }
    };
  }

  async processPayment(paymentData) {
    await delay(2000); // Simular procesamiento
    
    if (shouldSimulateError()) {
      throw new Error('Error al procesar el pago. Verifique los datos e intente nuevamente.');
    }

    // Simular validación de fraude
    const fraudScore = Math.floor(Math.random() * 100);
    if (fraudScore > 85) {
      throw new Error('Transacción bloqueada por seguridad. Contacte a soporte.');
    }

    const newPayment = {
      id: Date.now().toString(),
      numero: `PAY-2024-${String(Date.now()).slice(-6)}`,
      ...paymentData,
      status: fraudScore > 50 ? 'processing' : 'captured',
      fraudScore,
      riskLevel: fraudScore > 70 ? 'high' : fraudScore > 30 ? 'medium' : 'low',
      gateway: {
        provider: paymentData.gateway || 'culqi',
        transactionId: `txn_${Date.now()}`,
        authorizationCode: `AUTH${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        referenceNumber: `REF${Math.random().toString(36).substr(2, 8).toUpperCase()}`
      },
      createdAt: new Date().toISOString(),
      processedAt: new Date().toISOString()
    };

    this.payments.unshift(newPayment);
    return newPayment;
  }

  async refundPayment(paymentId, refundData) {
    await delay(1500);
    
    if (shouldSimulateError()) {
      throw new Error('Error al procesar el reembolso. Intente nuevamente.');
    }

    const paymentIndex = this.payments.findIndex(p => p.id === paymentId);
    if (paymentIndex === -1) {
      throw new Error('Pago no encontrado');
    }

    const payment = this.payments[paymentIndex];
    
    if (payment.status !== 'captured' && payment.status !== 'settled') {
      throw new Error('Solo se pueden reembolsar pagos capturados o liquidados');
    }

    const refund = {
      id: `ref_${Date.now()}`,
      amount: refundData.amount,
      reason: refundData.reason,
      type: refundData.amount === payment.amount.total ? 'full' : 'partial',
      status: 'completed',
      requestedBy: 'admin',
      requestedAt: new Date().toISOString(),
      processedAt: new Date().toISOString(),
      refundTransactionId: `ref_txn_${Date.now()}`
    };

    // Actualizar el pago
    const updatedPayment = {
      ...payment,
      status: refund.type === 'full' ? 'refunded' : 'partially_refunded',
      refunds: [...(payment.refunds || []), refund],
      refundableAmount: payment.amount.total - refundData.amount
    };

    this.payments[paymentIndex] = updatedPayment;
    return { payment: updatedPayment, refund };
  }

  async getPaymentStats() {
    await delay(300);
    
    if (shouldSimulateError()) {
      throw new Error('Error al cargar estadísticas. Intente nuevamente.');
    }

    // Calcular estadísticas en tiempo real
    const totalPayments = this.payments.length;
    const totalAmount = this.payments.reduce((sum, p) => sum + p.amount.total, 0);
    const successfulPayments = this.payments.filter(p => 
      ['captured', 'settled'].includes(p.status)
    ).length;

    return {
      ...this.stats,
      totalPayments,
      totalAmount,
      averageAmount: totalPayments > 0 ? totalAmount / totalPayments : 0,
      successRate: totalPayments > 0 ? (successfulPayments / totalPayments) * 100 : 0
    };
  }

  async createInstallmentPlan(planData) {
    await delay(800);
    
    if (shouldSimulateError()) {
      throw new Error('Error al crear plan de financiamiento.');
    }

    const plan = {
      id: `plan_${Date.now()}`,
      ...planData,
      status: 'active',
      createdAt: new Date().toISOString(),
      payments: this.generateInstallmentPayments(planData)
    };

    return plan;
  }

  generateInstallmentPayments(planData) {
    const payments = [];
    const { totalAmount, numberOfPayments, interestRate = 0, startDate } = planData;
    
    const monthlyRate = interestRate / 12;
    const paymentAmount = monthlyRate > 0 
      ? (totalAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
      : totalAmount / numberOfPayments;

    for (let i = 0; i < numberOfPayments; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + i);

      payments.push({
        id: `payment_${i + 1}`,
        installmentNumber: i + 1,
        dueDate: dueDate.toISOString(),
        amount: Math.round(paymentAmount * 100) / 100,
        principal: Math.round((paymentAmount - (totalAmount * monthlyRate)) * 100) / 100,
        interest: Math.round((totalAmount * monthlyRate) * 100) / 100,
        fees: 0,
        status: 'pending'
      });
    }

    return payments;
  }

  async verifyInsuranceEligibility(insuranceData) {
    await delay(1200);
    
    if (shouldSimulateError()) {
      throw new Error('Error al verificar elegibilidad del seguro.');
    }

    // Simular verificación de seguro
    const isEligible = Math.random() > 0.2; // 80% de probabilidad de elegibilidad

    if (isEligible) {
      return {
        eligible: true,
        benefits: {
          deductible: 100,
          deductibleMet: 50,
          copay: 25,
          coinsurance: 0.2,
          coverageLevel: 0.8,
          maxBenefit: 5000,
          remainingBenefit: 4200
        },
        validThrough: '2024-12-31'
      };
    } else {
      return {
        eligible: false,
        reason: 'Policy not active or coverage expired',
        errorCode: 'POLICY_INACTIVE'
      };
    }
  }

  async detectFraud(transactionData) {
    await delay(500);
    
    // Simular análisis de fraude
    const riskFactors = [];
    let riskScore = 0;

    // Factor de velocidad
    if (transactionData.amount > 1000) {
      riskFactors.push({
        type: 'high_amount',
        severity: 'medium',
        description: 'Monto alto para el perfil del cliente',
        score: 25
      });
      riskScore += 25;
    }

    // Factor geográfico
    if (transactionData.ipCountry !== 'PE') {
      riskFactors.push({
        type: 'foreign_ip',
        severity: 'high',
        description: 'IP desde país extranjero',
        score: 40
      });
      riskScore += 40;
    }

    // Factor de dispositivo
    if (transactionData.newDevice) {
      riskFactors.push({
        type: 'new_device',
        severity: 'low',
        description: 'Dispositivo no reconocido',
        score: 10
      });
      riskScore += 10;
    }

    let recommendation = 'approve';
    if (riskScore > 70) {
      recommendation = 'decline';
    } else if (riskScore > 40) {
      recommendation = 'review';
    }

    return {
      riskScore,
      recommendation,
      riskFactors,
      confidence: 0.85,
      requiresReview: riskScore > 40,
      reviewPriority: riskScore > 70 ? 'high' : 'medium'
    };
  }

  async exportPayments(filters = {}) {
    await delay(1000);
    
    const { data } = await this.getPayments(filters, { page: 1, limit: 1000 });
    return data;
  }
}

// Instancia singleton del servicio
const paymentApiService = new PaymentApiService();

// API pública del servicio
export const paymentApi = {
  getPayments: (filters, pagination) => paymentApiService.getPayments(filters, pagination),
  processPayment: (data) => paymentApiService.processPayment(data),
  refundPayment: (id, data) => paymentApiService.refundPayment(id, data),
  getPaymentStats: () => paymentApiService.getPaymentStats(),
  createInstallmentPlan: (data) => paymentApiService.createInstallmentPlan(data),
  verifyInsuranceEligibility: (data) => paymentApiService.verifyInsuranceEligibility(data),
  detectFraud: (data) => paymentApiService.detectFraud(data),
  exportPayments: (filters) => paymentApiService.exportPayments(filters)
};

export default paymentApi;