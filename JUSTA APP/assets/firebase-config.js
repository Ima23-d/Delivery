// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDQ6IxIEGg1pYibe8zJ_DQO2bnWa0Beng0",
    authDomain: "appdelivery-38949.firebaseapp.com",
    projectId: "appdelivery-38949",
    storageBucket: "appdelivery-38949.firebasestorage.app",
    messagingSenderId: "717102909889",
    appId: "1:717102909889:web:581ee8f19f6f3c68cb4740"
};

// Aguardar o Firebase carregar completamente
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar Firebase
    firebase.initializeApp(firebaseConfig);
    
    // Referências aos serviços
    window.auth = firebase.auth();
    window.db = firebase.firestore();
    // window.storage = firebase.storage(); // Temporariamente comentado devido a CORS
    
    // Funções utilitárias
    window.utils = {
        // Formatar moeda
        formatCurrency: (value) => {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(value);
        },

        // Calcular distância entre dois pontos
        calculateDistance: (lat1, lon1, lat2, lon2) => {
            const R = 6371; // Raio da Terra em km
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                      Math.sin(dLon/2) * Math.sin(dLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            return R * c;
        },

        // Calcular tarifa da corrida
        calculateFare: (distance, duration) => {
            const baseFare = 5.00; // Tarifa base
            const perKm = 2.50; // Por km
            const perMinute = 0.50; // Por minuto
            const platformFee = 1.00; // Taxa da plataforma
            
            const distanceCost = distance * perKm;
            const timeCost = (duration / 60) * perMinute;
            const totalFare = baseFare + distanceCost + timeCost + platformFee;
            
            return {
                total: totalFare,
                breakdown: {
                    base: baseFare,
                    distance: distanceCost,
                    time: timeCost,
                    platform: platformFee
                }
            };
        },

        // Gerar ID único
        generateId: () => {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        },

        // Validar email
        validateEmail: (email) => {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        },

        // Validar telefone
        validatePhone: (phone) => {
            const re = /^\(?[1-9]{2}\)? ?(?:[2-8]|9[1-9])[0-9]{3}\-?[0-9]{4}$/;
            return re.test(phone);
        },

        // Validar CPF
        validateCPF: (cpf) => {
            cpf = cpf.replace(/[^\d]/g, '');
            
            if (cpf.length !== 11) return false;
            
            // Verificar se todos os dígitos são iguais
            if (/^(\d)\1{10}$/.test(cpf)) return false;
            
            // Validar primeiro dígito verificador
            let sum = 0;
            for (let i = 0; i < 9; i++) {
                sum += parseInt(cpf.charAt(i)) * (10 - i);
            }
            let remainder = 11 - (sum % 11);
            let digit1 = remainder < 2 ? 0 : remainder;
            
            // Validar segundo dígito verificador
            sum = 0;
            for (let i = 0; i < 10; i++) {
                sum += parseInt(cpf.charAt(i)) * (11 - i);
            }
            remainder = 11 - (sum % 11);
            let digit2 = remainder < 2 ? 0 : remainder;
            
            return parseInt(cpf.charAt(9)) === digit1 && parseInt(cpf.charAt(10)) === digit2;
        },

        // Validar CNH
        validateCNH: (cnh) => {
            cnh = cnh.replace(/[^\d]/g, '');
            return cnh.length === 11;
        },

        // Validar placa de veículo
        validateLicensePlate: (plate) => {
            // Formato Mercosul: ABC-1234 ou ABC-1A23
            const re = /^[A-Z]{3}-[0-9]{4}$|^[A-Z]{3}-[0-9]{1}[A-Z]{1}[0-9]{2}$/;
            return re.test(plate.toUpperCase());
        },

        // Validar senha forte
        validateStrongPassword: (password) => {
            const minLength = 8;
            const hasUpperCase = /[A-Z]/.test(password);
            const hasLowerCase = /[a-z]/.test(password);
            const hasNumbers = /\d/.test(password);
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
            
            return password.length >= minLength && 
                   hasUpperCase && 
                   hasLowerCase && 
                   hasNumbers && 
                   hasSpecialChar;
        },

        // Sanitizar entrada de texto
        sanitizeInput: (input) => {
            return input.replace(/[<>]/g, '').trim();
        },

        // Validar coordenadas GPS
        validateCoordinates: (lat, lng) => {
            return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
        },

        // Mostrar notificação
        showNotification: (message, type = 'info') => {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.textContent = message;
            
            // Estilos da notificação
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 10000;
                animation: slideIn 0.3s ease;
                max-width: 300px;
            `;
            
            // Cores por tipo
            const colors = {
                success: '#4CAF50',
                error: '#f44336',
                warning: '#ff9800',
                info: '#2196F3'
            };
            
            notification.style.backgroundColor = colors[type] || colors.info;
            
            document.body.appendChild(notification);
            
            // Remover após 5 segundos
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, 5000);
        },

        // Verificar se usuário está logado
        isLoggedIn: () => {
            return localStorage.getItem('userId') && localStorage.getItem('userType');
        },

        // Fazer logout
        logout: () => {
            localStorage.removeItem('userId');
            localStorage.removeItem('userType');
            localStorage.removeItem('userData');
            
            // Determinar o caminho correto baseado na página atual
            const currentPath = window.location.pathname;
            if (currentPath.includes('/passageiro/') || currentPath.includes('/motorista/') || currentPath.includes('/admin/')) {
                window.location.href = '../../index.html';
            } else {
                window.location.href = 'index.html';
            }
        },

        // Log de auditoria
        logAudit: async (action, details, userId = null) => {
            try {
                const currentUserId = userId || localStorage.getItem('userId');
                if (!currentUserId) return;

                await db.collection('auditLogs').add({
                    userId: currentUserId,
                    action: action,
                    details: details,
                    timestamp: new Date(),
                    userAgent: navigator.userAgent,
                    ip: 'client-side' // Em produção, seria obtido do servidor
                });
            } catch (error) {
                console.error('Erro ao registrar log de auditoria:', error);
            }
        },

        // Verificar permissões
        checkPermission: (requiredPermission) => {
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            const userType = localStorage.getItem('userType');
            
            if (!userType) return false;
            
            switch (requiredPermission) {
                case 'admin':
                    return userType === 'admin';
                case 'driver':
                    return userType === 'motorista';
                case 'passenger':
                    return userType === 'passageiro';
                case 'active_account':
                    return userData.status === 'active' || userData.status === 'approved';
                default:
                    return false;
            }
        },

        // Rate limiting básico
        rateLimit: {
            attempts: {},
            maxAttempts: 5,
            timeWindow: 15 * 60 * 1000, // 15 minutos
            
            check: function(action) {
                const now = Date.now();
                const key = `${action}_${localStorage.getItem('userId') || 'anonymous'}`;
                
                if (!this.attempts[key]) {
                    this.attempts[key] = [];
                }
                
                // Remover tentativas antigas
                this.attempts[key] = this.attempts[key].filter(time => now - time < this.timeWindow);
                
                if (this.attempts[key].length >= this.maxAttempts) {
                    return false;
                }
                
                this.attempts[key].push(now);
                return true;
            }
        }
    };

    // Adicionar estilos para notificações
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

// Função para aguardar o Firebase estar pronto
function waitForFirebase() {
    return new Promise((resolve) => {
        if (window.auth && window.db) {
            resolve();
        } else {
            const checkFirebase = setInterval(() => {
                if (window.auth && window.db) {
                    clearInterval(checkFirebase);
                    resolve();
                }
            }, 100);
        }
    });
}
