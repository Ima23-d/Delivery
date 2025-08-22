# 🚀 Guia de Instalação e Execução - PedidoFácil

## 📋 Pré-requisitos

- **Navegador moderno** (Chrome, Firefox, Safari, Edge)
- **Conta no Firebase** (gratuita)
- **Editor de código** (VS Code, Sublime Text, etc.)
- **Servidor local** (opcional, mas recomendado)

## 🔥 Configuração do Firebase

### 1. Criar Projeto no Firebase

1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Clique em "Criar projeto"
3. Digite um nome para o projeto (ex: "pedidofacil-delivery")
4. Desative o Google Analytics (opcional)
5. Clique em "Criar projeto"

### 2. Configurar Autenticação

1. No menu lateral, clique em "Authentication"
2. Clique em "Começar"
3. Em "Sign-in method", clique em "Email/Senha"
4. Ative "Email/Senha" e clique em "Salvar"

### 3. Configurar Firestore Database

1. No menu lateral, clique em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Iniciar no modo de teste" (para desenvolvimento)
4. Escolha a localização mais próxima (ex: "us-central1")
5. Clique em "Concluído"

### 4. Obter Configurações

1. Clique na engrenagem (⚙️) ao lado de "Visão geral do projeto"
2. Selecione "Configurações do projeto"
3. Role para baixo até "Seus aplicativos"
4. Clique no ícone da web (</>)
5. Digite um nome para o app (ex: "PedidoFácil Web")
6. Clique em "Registrar app"
7. **Copie as configurações** que aparecem

### 5. Atualizar Configurações

1. Abra o arquivo `firebase-config.js`
2. Substitua as configurações de exemplo pelas suas:

```javascript
const firebaseConfig = {
    apiKey: "sua-api-key-real-aqui",
    authDomain: "seu-projeto-real.firebaseapp.com",
    projectId: "seu-projeto-real-id",
    storageBucket: "seu-projeto-real.appspot.com",
    messagingSenderId: "123456789",
    appId: "seu-app-id-real-aqui"
};
```

## 📁 Estrutura do Projeto

```
projeto-delivery/
├── index.html                    # Página principal
├── firebase-config.js            # Configuração do Firebase
├── INSTALACAO.md                 # Este arquivo
├── README.md                     # Documentação do projeto
├── firebase_config.md            # Configurações detalhadas
├── cliente/                      # Módulo do Cliente
├── restaurante/                  # Módulo do Restaurante
├── entregador/                   # Módulo do Entregador
└── admin/                        # Módulo Administrativo
```

## 🚀 Executando o Projeto

### Opção 1: Servidor Local (Recomendado)

#### Usando Python 3:
```bash
# Na pasta do projeto
python -m http.server 8000
```

#### Usando Node.js:
```bash
# Instalar servidor global
npm install -g http-server

# Na pasta do projeto
http-server -p 8000
```

#### Usando PHP:
```bash
# Na pasta do projeto
php -S localhost:8000
```

### Opção 2: Extensão do VS Code

1. Instale a extensão "Live Server"
2. Clique com botão direito no `index.html`
3. Selecione "Open with Live Server"

### Opção 3: Abrir Diretamente

⚠️ **Não recomendado** - Algumas funcionalidades podem não funcionar devido a restrições de CORS.

## 🌐 Acessando o Sistema

1. Abra seu navegador
2. Acesse: `http://localhost:8000`
3. Você verá a página principal do PedidoFácil
4. Clique em qualquer módulo para começar

## 🧪 Contas de Demonstração

### Cliente Demo
- **Email**: cliente@demo.com
- **Senha**: 123456

### Restaurante Demo
- **Email**: restaurante@demo.com
- **Senha**: 123456

### Entregador Demo
- **Email**: entregador@demo.com
- **Senha**: 123456

### Admin Demo
- **Email**: admin@demo.com
- **Senha**: 123456

## 🔧 Configurações de Segurança

### Regras do Firestore (Produção)

⚠️ **IMPORTANTE**: As regras padrão permitem acesso total. Para produção, configure as regras de segurança:

1. No Firestore, vá para "Regras"
2. Substitua as regras por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários podem ler/escrever apenas seus próprios dados
    match /usuarios/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Restaurantes podem ler/escrever apenas seus dados
    match /restaurantes/{restId} {
      allow read, write: if request.auth != null && request.auth.uid == restId;
    }
    
    // Entregadores podem ler/escrever apenas seus dados
    match /entregadores/{entregadorId} {
      allow read, write: if request.auth != null && request.auth.uid == entregadorId;
    }
    
    // Produtos - qualquer usuário pode ler, apenas restaurantes podem escrever
    match /produtos/{produtoId} {
      allow read: if true;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/usuarios/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.tipo == 'restaurante';
    }
    
    // Pedidos - clientes veem seus pedidos, restaurantes veem pedidos deles
    match /pedidos/{pedidoId} {
      allow read, write: if request.auth != null && 
        (resource.data.clienteId == request.auth.uid || 
         resource.data.restauranteId == request.auth.uid ||
         resource.data.entregadorId == request.auth.uid);
    }
    
    // Avaliações - qualquer usuário pode ler, apenas clientes podem escrever
    match /avaliacoes/{avaliacaoId} {
      allow read: if true;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/usuarios/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.tipo == 'cliente';
    }
    
    // Configurações da plataforma - apenas admins podem acessar
    match /configuracoes_plataforma/{docId} {
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/usuarios/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.tipo == 'admin';
    }
    
    // Estatísticas da plataforma - apenas admins podem acessar
    match /estatisticas_plataforma/{docId} {
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/usuarios/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.tipo == 'admin';
    }
  }
}
```

## 🐛 Solução de Problemas

### Erro: "Firebase is not defined"

**Solução**: Verifique se os scripts do Firebase estão sendo carregados antes do `firebase-config.js`:

```html
<!-- No head ou antes do fechamento do body -->
<script src="https://www.gstatic.com/firebasejs/9.x.x/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.x.x/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.x.x/firebase-firestore.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.x.x/firebase-storage.js"></script>
<script src="firebase-config.js"></script>
```

### Erro: "Permission denied"

**Solução**: Verifique as regras de segurança do Firestore e se o usuário está autenticado.

### Erro: "Quota exceeded"

**Solução**: O plano gratuito do Firebase tem limites. Considere fazer upgrade ou otimizar as consultas.

## 📱 Testando em Dispositivos Móveis

1. Use o servidor local com seu IP da rede
2. Ou use ferramentas como ngrok para expor localmente
3. Teste a responsividade em diferentes tamanhos de tela

## 🔄 Atualizações

Para atualizar o projeto:

1. Faça backup dos seus dados
2. Substitua os arquivos HTML/CSS/JS
3. Mantenha suas configurações do Firebase
4. Teste todas as funcionalidades

## 📞 Suporte

- **Issues**: Crie uma issue no repositório
- **Documentação**: Consulte o `README.md`
- **Firebase**: [Documentação oficial](https://firebase.google.com/docs)

## 🎯 Próximos Passos

1. ✅ Configure o Firebase
2. ✅ Execute o projeto localmente
3. ✅ Teste todas as funcionalidades
4. ✅ Configure as regras de segurança
5. 🚀 Deploy para produção (opcional)

---

**🎉 Parabéns!** Seu sistema PedidoFácil está funcionando localmente. 

Agora você pode:
- Testar todas as funcionalidades
- Personalizar o design
- Adicionar novas features
- Preparar para produção

**Boa sorte com seu projeto de delivery! 🚀**
