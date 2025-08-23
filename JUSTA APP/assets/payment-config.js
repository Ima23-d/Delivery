// Configuração do Sistema de Pagamento JUSTA
const PAYMENT_CONFIG = {
    // Stripe Configuration
    stripe: {
        publishableKey: 'pk_test_51ABC123DEF456GHI789JKL012MNO345PQR678STU901VWX234YZA567BCD890EFG', // Substitua pela sua chave real
        apiVersion: '2023-10-16'
    },
    
    // MercadoPago Configuration (alternativa)
    mercadopago: {
        publicKey: 'TEST-12345678-1234-1234-1234-123456789012', // Substitua pela sua chave real
        preferenceUrl: 'https://api.mercadopago.com/checkout/preferences'
    },
    
    // Configurações de pagamento
    payment: {
        currency: 'BRL',
        supportedMethods: ['card', 'pix', 'cash'],
        defaultMethod: 'card',
        minAmount: 5.00,
        maxAmount: 500.00
    },
    
    // Taxas e comissões
    fees: {
        platform: 1.00, // Taxa fixa da plataforma
        percentage: 0.15, // 15% de comissão
        driverPercentage: 0.85 // 85% para o motorista
    }
};

// Sistema de Pagamento com Stripe
class StripePaymentSystem {
    constructor() {
        this.stripe = null;
        this.elements = null;
        this.cardElement = null;
        this.initialized = false;
    }
    
    async initialize() {
        try {
            // Carregar Stripe
            if (typeof Stripe === 'undefined') {
                await this.loadStripeScript();
            }
            
            this.stripe = Stripe(PAYMENT_CONFIG.stripe.publishableKey);
            this.initialized = true;
            
            console.log('Sistema de pagamento Stripe inicializado');
            return true;
        } catch (error) {
            console.error('Erro ao inicializar Stripe:', error);
            return false;
        }
    }
    
    async loadStripeScript() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://js.stripe.com/v3/';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    async createPaymentIntent(amount, currency = 'BRL') {
        if (!this.initialized) {
            throw new Error('Sistema de pagamento não inicializado');
        }
        
        try {
            // Em produção, isso seria feito no backend
            const response = await fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: Math.round(amount * 100), // Stripe usa centavos
                    currency: currency
                })
            });
            
            const data = await response.json();
            return data.clientSecret;
        } catch (error) {
            // Fallback para desenvolvimento
            console.warn('Usando modo de desenvolvimento para pagamentos');
            return this.createTestPaymentIntent(amount, currency);
        }
    }
    
    createTestPaymentIntent(amount, currency) {
        // Simulação para desenvolvimento
        return `pi_test_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    async processPayment(paymentMethodId, amount, description) {
        if (!this.initialized) {
            throw new Error('Sistema de pagamento não inicializado');
        }
        
        try {
            const { paymentIntent, error } = await this.stripe.confirmCardPayment(
                paymentMethodId,
                {
                    payment_method: {
                        card: this.cardElement,
                        billing_details: {
                            name: 'Usuário JUSTA'
                        }
                    }
                }
            );
            
            if (error) {
                throw new Error(error.message);
            }
            
            if (paymentIntent.status === 'succeeded') {
                return {
                    success: true,
                    transactionId: paymentIntent.id,
                    amount: amount,
                    status: 'completed'
                };
            }
            
            throw new Error('Pagamento não foi processado');
        } catch (error) {
            console.error('Erro no processamento do pagamento:', error);
            throw error;
        }
    }
}

// Sistema de Pagamento com MercadoPago (alternativa)
class MercadoPagoPaymentSystem {
    constructor() {
        this.initialized = false;
    }
    
    async initialize() {
        try {
            // Carregar MercadoPago
            if (typeof Mercadopago === 'undefined') {
                await this.loadMercadoPagoScript();
            }
            
            Mercadopago.setPublishableKey(PAYMENT_CONFIG.mercadopago.publicKey);
            this.initialized = true;
            
            console.log('Sistema de pagamento MercadoPago inicializado');
            return true;
        } catch (error) {
            console.error('Erro ao inicializar MercadoPago:', error);
            return false;
        }
    }
    
    async loadMercadoPagoScript() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://sdk.mercadopago.com/js/v2';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    async createPreference(items, backUrls) {
        if (!this.initialized) {
            throw new Error('Sistema de pagamento não inicializado');
        }
        
        try {
            const preference = {
                items: items,
                back_urls: backUrls,
                auto_return: 'approved',
                external_reference: `justa_${Date.now()}`,
                notification_url: '/api/webhook/mercadopago'
            };
            
            const response = await fetch(PAYMENT_CONFIG.mercadopago.preferenceUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${PAYMENT_CONFIG.mercadopago.publicKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(preference)
            });
            
            const data = await response.json();
            return data.init_point;
        } catch (error) {
            console.error('Erro ao criar preferência:', error);
            throw error;
        }
    }
}

// Sistema de Pagamento Principal
class PaymentSystem {
    constructor() {
        this.stripe = new StripePaymentSystem();
        this.mercadopago = new MercadoPagoPaymentSystem();
        this.currentProvider = 'stripe'; // Padrão
    }
    
    async initialize(provider = 'stripe') {
        this.currentProvider = provider;
        
        if (provider === 'stripe') {
            return await this.stripe.initialize();
        } else if (provider === 'mercadopago') {
            return await this.mercadopago.initialize();
        }
        
        throw new Error('Provedor de pagamento não suportado');
    }
    
    async processRidePayment(rideData, paymentMethod) {
        try {
            const amount = rideData.totalFare;
            const description = `Corrida JUSTA: ${rideData.origin} → ${rideData.destination}`;
            
            if (this.currentProvider === 'stripe') {
                return await this.stripe.processPayment(paymentMethod, amount, description);
            } else if (this.currentProvider === 'mercadopago') {
                // Implementar para MercadoPago
                throw new Error('MercadoPago não implementado para corridas');
            }
        } catch (error) {
            console.error('Erro no pagamento da corrida:', error);
            throw error;
        }
    }
    
    async createPaymentMethod(cardData) {
        if (this.currentProvider === 'stripe') {
            return await this.stripe.stripe.createPaymentMethod({
                type: 'card',
                card: cardData
            });
        }
        
        throw new Error('Método não implementado para este provedor');
    }
    
    validateCard(cardNumber, expiryMonth, expiryYear, cvc) {
        // Validação básica de cartão
        if (!cardNumber || cardNumber.length < 13 || cardNumber.length > 19) {
            return { valid: false, error: 'Número do cartão inválido' };
        }
        
        if (!expiryMonth || expiryMonth < 1 || expiryMonth > 12) {
            return { valid: false, error: 'Mês de expiração inválido' };
        }
        
        if (!expiryYear || expiryYear < new Date().getFullYear()) {
            return { valid: false, error: 'Ano de expiração inválido' };
        }
        
        if (!cvc || cvc.length < 3 || cvc.length > 4) {
            return { valid: false, error: 'CVC inválido' };
        }
        
        return { valid: true };
    }
}

// Exportar para uso global
window.PaymentSystem = PaymentSystem;
window.PAYMENT_CONFIG = PAYMENT_CONFIG;
