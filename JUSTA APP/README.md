# 🚗 JUSTA - Plataforma de Mobilidade Urbana

## 📋 Descrição
JUSTA é uma plataforma completa de transporte urbano que conecta passageiros e motoristas de forma segura e eficiente. O sistema inclui funcionalidades avançadas de pagamento, validações robustas e sistema de segurança empresarial.

## ✨ Funcionalidades Principais

### 🚶 Passageiros
- **Cadastro e Login** com validações robustas
- **Solicitação de Corridas** com cálculo automático de tarifas
- **Sistema de Pagamento Real** (Stripe + MercadoPago)
- **Histórico de Corridas** detalhado
- **Métodos de Pagamento** múltiplos (Cartão, PIX, Dinheiro)
- **Perfil Personalizado** com preferências

### 🚗 Motoristas
- **Cadastro Verificado** com upload de documentos
- **Sistema de Aprovação** com status tracking
- **Gestão de Saldo** e transações
- **Histórico de Corridas** com detalhes
- **Perfil Profissional** com avaliações

### 👑 Administradores
- **Dashboard Completo** com métricas em tempo real
- **Gestão de Usuários** e motoristas
- **Sistema Financeiro** com relatórios
- **Suporte ao Cliente** integrado
- **Promoções e Descontos** configuráveis

## 🔒 Sistema de Segurança

### Firestore Rules
- **Regras robustas** por tipo de usuário
- **Controle de acesso** baseado em permissões
- **Validação de status** de conta
- **Logs de auditoria** automáticos

### Validações
- **CPF válido** com algoritmo oficial
- **CNH e documentos** verificados
- **Senhas fortes** com critérios múltiplos
- **Rate limiting** contra spam
- **Sanitização** de entrada de dados

## 💳 Sistema de Pagamento

### Stripe (Principal)
- **Cartões de crédito/débito** internacionais
- **Validação em tempo real** de cartões
- **Processamento seguro** de transações
- **Webhooks** para notificações
- **Fallback** para modo de desenvolvimento

### MercadoPago (Alternativo)
- **PIX** e boleto bancário
- **Cartões nacionais** brasileiros
- **Integração completa** com API
- **Notificações automáticas**

## 🚀 Configuração e Instalação

### 1. Pré-requisitos
```bash
# Node.js 16+ (para desenvolvimento)
# Firebase CLI
npm install -g firebase-tools

# Conta Firebase
# Conta Stripe (para pagamentos reais)
# Conta MercadoPago (opcional)
```

### 2. Configuração Firebase
```bash
# Login no Firebase
firebase login

# Inicializar projeto
firebase init

# Selecionar:
# - Firestore
# - Hosting
# - Storage (opcional)
```

### 3. Configuração de Pagamentos

#### Stripe
1. Criar conta em [stripe.com](https://stripe.com)
2. Obter chaves de teste e produção
3. Atualizar `assets/payment-config.js`:

```javascript
stripe: {
    publishableKey: 'pk_test_SUA_CHAVE_AQUI',
    apiVersion: '2023-10-16'
}
```

#### MercadoPago
1. Criar conta em [mercadopago.com.br](https://mercadopago.com.br)
2. Obter chaves de teste e produção
3. Atualizar `assets/payment-config.js`:

```javascript
mercadopago: {
    publicKey: 'TEST_SUA_CHAVE_AQUI',
    preferenceUrl: 'https://api.mercadopago.com/checkout/preferences'
}
```

### 4. Deploy das Regras de Segurança
```bash
# Deploy das regras do Firestore
firebase deploy --only firestore:rules

# Deploy dos índices
firebase deploy --only firestore:indexes
```

### 5. Configuração de Hosting
```bash
# Deploy da aplicação
firebase deploy --only hosting
```

## 🔧 Estrutura do Projeto

```
JUSTA APP/
├── assets/
│   ├── firebase-config.js      # Configuração Firebase + Utilitários
│   └── payment-config.js       # Sistema de Pagamento
├── passageiro/                 # Interface do Passageiro
│   ├── login.html
│   ├── cadastro.html
│   ├── home.html
│   ├── pagamentos.html
│   ├── perfil.html
│   ├── historico.html
│   ├── corrida_confirmacao.html
│   ├── corrida_andamento.html
│   └── corrida_finalizada.html
├── motorista/                  # Interface do Motorista
│   ├── login.html
│   ├── cadastro.html
│   ├── home.html
│   ├── perfil.html
│   ├── saldo.html
│   ├── historico.html
│   ├── corrida_andamento.html
│   └── corrida_finalizada.html
├── admin/                      # Painel Administrativo
│   ├── login.html
│   ├── dashboard.html
│   ├── usuarios.html
│   ├── motoristas.html
│   ├── corridas.html
│   ├── financeiro.html
│   ├── promocoes.html
│   └── suporte.html
├── firestore.rules            # Regras de Segurança
├── firestore.indexes.json     # Índices do Banco
└── index.html                 # Página Principal
```

## 🧪 Testes e Desenvolvimento

### Modo de Desenvolvimento
- **Pagamentos simulados** para testes
- **Validações básicas** ativas
- **Logs detalhados** no console
- **Modo debug** habilitado

### Modo de Produção
- **Pagamentos reais** ativos
- **Validações robustas** completas
- **Logs de auditoria** automáticos
- **Rate limiting** ativo

### 🔧 Sistema de GPS e Mapas
- **Mapas interativos** com Leaflet
- **GPS em tempo real** com alta precisão
- **Rota completa** (motorista → passageiro → destino)
- **Matching inteligente** por proximidade
- **Tracking em tempo real** do motorista

### 🧪 Modo de Teste

O sistema inclui uma funcionalidade de teste que:
- Cria motoristas fictícios próximos à sua localização
- Permite testar o fluxo completo de corridas
- Inclui logs detalhados no console para debug

**Para usar o modo de teste:**
1. Abra o console do navegador (F12)
2. Vá para a página do passageiro (`passageiro/home.html`)
3. Clique em "🔧 Criar Motoristas de Teste"
4. Solicite uma corrida normalmente

**Logs de Debug:**
- Console mostra todo o processo de matching
- Localização do usuário e motoristas
- Cálculos de distância em tempo real
- Status das corridas e notificações

## 📱 Recursos Técnicos

### Frontend
- **HTML5** semântico
- **CSS3** com design responsivo
- **JavaScript ES6+** moderno
- **Firebase SDK** integrado
- **PWA Ready** (Progressive Web App)

### Backend (Firebase)
- **Authentication** com múltiplos provedores
- **Firestore** para banco de dados
- **Storage** para arquivos (opcional)
- **Functions** para lógica de negócio
- **Hosting** para deploy

### Segurança
- **HTTPS** obrigatório
- **CORS** configurado
- **Content Security Policy** ativo
- **Validação de entrada** robusta
- **Autenticação** em todas as rotas

## 🚨 Troubleshooting

### Problemas Comuns

#### Pagamentos não funcionam
1. Verificar chaves do Stripe/MercadoPago
2. Confirmar configuração do Firebase
3. Verificar console para erros
4. Testar em modo de desenvolvimento

#### Upload de arquivos falha
1. Verificar regras do Storage
2. Confirmar permissões CORS
3. Validar tamanho e tipo de arquivo
4. Verificar conexão com internet

#### Login não funciona
1. Verificar regras do Firestore
2. Confirmar configuração de auth
3. Verificar status da conta
4. Limpar cache do navegador

## 📞 Suporte

### Contato Técnico
- **Email**: suporte@justa.com
- **WhatsApp**: (11) 99999-9999
- **Horário**: Segunda a Sexta, 8h às 18h

### Documentação
- **API Reference**: `/docs/api`
- **Guia de Desenvolvimento**: `/docs/dev`
- **FAQ**: `/docs/faq`

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

---

**JUSTA - Transformando a mobilidade urbana, uma corrida de cada vez! 🚗✨**
