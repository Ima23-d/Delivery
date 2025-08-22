# 🔥 Configuração do Firebase - PedidoFácil

## 📋 Pré-requisitos

1. Conta Google ativa
2. Acesso ao [Firebase Console](https://console.firebase.google.com/)
3. Projeto criado no Firebase

## 🚀 Passo a Passo da Configuração

### 1. Criar Projeto no Firebase

1. Acesse [console.firebase.google.com](https://console.firebase.google.com/)
2. Clique em "Criar um projeto"
3. Digite o nome: `pedidofacil-delivery`
4. Aceite os termos e continue
5. Desabilite o Google Analytics (opcional)
6. Clique em "Criar projeto"

### 2. Configurar Authentication

1. No menu lateral, clique em "Authentication"
2. Clique em "Começar"
3. Em "Sign-in method", habilite:
   - **Email/Senha** (padrão)
   - **Google** (opcional)
4. Clique em "Salvar"

### 3. Configurar Firestore Database

1. No menu lateral, clique em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Iniciar no modo de teste" (para desenvolvimento)
4. Escolha a localização mais próxima (ex: `us-central1`)
5. Clique em "Ativar"

### 4. Configurar Storage (Opcional)

1. No menu lateral, clique em "Storage"
2. Clique em "Começar"
3. Escolha "Iniciar no modo de teste"
4. Escolha a localização do Storage
5. Clique em "Ativar"

### 5. Obter Configuração do Projeto

1. Clique na engrenagem ⚙️ ao lado de "Visão geral do projeto"
2. Selecione "Configurações do projeto"
3. Role para baixo até "Seus aplicativos"
4. Clique no ícone da web `</>`
5. Digite o nome: `PedidoFácil Web`
6. Clique em "Registrar app"
7. **Copie a configuração** que aparece

## ⚙️ Configuração no Código

### Substituir em TODOS os arquivos HTML:

```javascript
const firebaseConfig = {
    apiKey: "sua-api-key-aqui",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto-id",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "123456789",
    appId: "seu-app-id-aqui"
};
```

### Exemplo de configuração real:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyB1234567890abcdefghijklmnopqrstuvwxyz",
    authDomain: "pedidofacil-delivery.firebaseapp.com",
    projectId: "pedidofacil-delivery",
    storageBucket: "pedidofacil-delivery.appspot.com",
    messagingSenderId: "987654321",
    appId: "1:987654321:web:abcdef1234567890"
};
```

## 🔒 Regras de Segurança do Firestore

### Regras Básicas (Desenvolvimento):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Regras de Produção (Recomendadas):

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

## 🗄️ Estrutura das Coleções

### Coleção: `usuarios`
```javascript
{
  uid: "string",
  nome: "string",
  email: "string",
  telefone: "string",
  endereco: "string",
  tipo: "cliente" | "restaurante" | "entregador" | "admin",
  dataCadastro: "timestamp",
  ativo: "boolean",
  // Campos específicos por tipo
  cnpj: "string", // restaurante
  categoria: "string", // restaurante
  cpf: "string", // entregador
  veiculo: "string", // entregador
  cargo: "string", // admin
  nivelAcesso: "string", // admin
  permissoes: ["array"] // admin
}
```

### Coleção: `restaurantes`
```javascript
{
  id: "string",
  nome: "string",
  email: "string",
  telefone: "string",
  cnpj: "string",
  endereco: "string",
  categoria: "string",
  ativo: "boolean",
  avaliacao: "number",
  totalAvaliacoes: "number",
  taxaEntrega: "number",
  tempoMedioPreparo: "number",
  horarioFuncionamento: "object",
  dataCadastro: "timestamp"
}
```

### Coleção: `entregadores`
```javascript
{
  id: "string",
  nome: "string",
  email: "string",
  telefone: "string",
  cpf: "string",
  endereco: "string",
  veiculo: "string",
  ativo: "boolean",
  disponivel: "boolean",
  avaliacao: "number",
  totalAvaliacoes: "number",
  totalEntregas: "number",
  totalGanhos: "number",
  dataCadastro: "timestamp"
}
```

### Coleção: `produtos`
```javascript
{
  id: "string",
  nome: "string",
  descricao: "string",
  preco: "number",
  categoriaId: "string",
  restauranteId: "string",
  imagem: "string",
  status: "ativo" | "inativo",
  dataCriacao: "timestamp",
  dataAtualizacao: "timestamp"
}
```

### Coleção: `pedidos`
```javascript
{
  id: "string",
  clienteId: "string",
  clienteNome: "string",
  clienteEmail: "string",
  clienteTelefone: "string",
  clienteEndereco: "string",
  restauranteId: "string",
  restauranteNome: "string",
  entregadorId: "string",
  entregadorNome: "string",
  itens: ["array"],
  subtotal: "number",
  taxaEntrega: "number",
  total: "number",
  formaPagamento: "string",
  status: "pendente" | "preparando" | "pronto" | "em-entrega" | "entregue" | "cancelado",
  dataPedido: "timestamp",
  dataAtualizacao: "timestamp",
  taxaRestaurante: "number",
  taxaEntregador: "number",
  taxaPlataforma: "number"
}
```

### Coleção: `avaliacoes`
```javascript
{
  id: "string",
  pedidoId: "string",
  clienteId: "string",
  restauranteId: "string",
  entregadorId: "string",
  ratings: {
    comida: "number",
    entrega: "number",
    velocidade: "number"
  },
  mediaGeral: "number",
  comentarios: "string",
  dataAvaliacao: "timestamp"
}
```

## 🧪 Testando a Configuração

### 1. Verificar Authentication
- Tente criar uma conta de cliente
- Verifique se aparece no Firebase Console > Authentication > Users

### 2. Verificar Firestore
- Após criar conta, verifique se os dados aparecem em Firestore > Data
- Deve criar documento na coleção `usuarios`

### 3. Verificar Console
- Abra o DevTools (F12)
- Verifique se não há erros de Firebase
- Confirme se as mensagens de sucesso aparecem

## 🚨 Problemas Comuns

### Erro: "Firebase App named '[DEFAULT]' already exists"
**Solução**: Verifique se não está importando o Firebase múltiplas vezes

### Erro: "Permission denied"
**Solução**: Verifique as regras de segurança do Firestore

### Erro: "auth/email-already-in-use"
**Solução**: O email já está cadastrado, use outro ou faça login

### Erro: "auth/weak-password"
**Solução**: A senha deve ter pelo menos 6 caracteres

## 📱 Configuração para Produção

### 1. Alterar Regras de Segurança
- Use as regras de produção mostradas acima
- Teste todas as funcionalidades

### 2. Configurar Domínios Autorizados
- Firebase Console > Authentication > Settings > Authorized domains
- Adicione seu domínio de produção

### 3. Configurar Storage (se usado)
- Defina regras de segurança para Storage
- Configure CORS se necessário

### 4. Monitoramento
- Habilite Firebase Analytics
- Configure alertas de erro
- Monitore o uso e custos

## 💡 Dicas de Desenvolvimento

### 1. Usar Console.log
```javascript
console.log('Dados do usuário:', userData);
console.log('Erro Firebase:', error);
```

### 2. Testar em Modo Incógnito
- Evita conflitos de sessão
- Testa o fluxo completo

### 3. Verificar Network Tab
- Confirme se as requisições estão sendo feitas
- Verifique os dados enviados/recebidos

### 4. Usar Firebase Emulator (Avançado)
- Para desenvolvimento offline
- Testes sem custo

---

**🎯 Com esta configuração, sua plataforma PedidoFácil estará funcionando perfeitamente!**

*Lembre-se de nunca compartilhar suas chaves de API publicamente*
