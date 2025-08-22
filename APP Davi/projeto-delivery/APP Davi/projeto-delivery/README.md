# 🚀 PedidoFácil - Plataforma de Delivery

## 📋 Descrição do Projeto

O **PedidoFácil** é uma plataforma completa de delivery desenvolvida com **HTML + CSS + JavaScript puro**, integrada ao **Firebase** para autenticação, banco de dados e armazenamento. A plataforma oferece um modelo de monetização transparente com taxas fixas para todos os participantes.

## 💰 Modelo de Negócio

### Taxas Fixas e Transparentes
- **Restaurantes**: R$ 1,00 por pedido
- **Entregadores**: R$ 1,00 por entrega
- **Plataforma**: R$ 2,00 por pedido entregue

### Vantagens do Modelo
- ✅ **Transparência total** - Sem surpresas nas taxas
- ✅ **Previsibilidade** - Custos fixos para planejamento
- ✅ **Simplicidade** - Fácil de entender e calcular
- ✅ **Justiça** - Todos pagam proporcionalmente ao uso

## 🏗️ Arquitetura do Sistema

### Tecnologias Utilizadas
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **Design**: Responsivo e moderno
- **Compatibilidade**: Todos os navegadores modernos

### Estrutura de Pastas
```
projeto-delivery/
├── cliente/                    # Módulo do Cliente
│   ├── cadastro_login_cliente.html
│   ├── home_cliente.html
│   ├── restaurante.html
│   ├── carrinho.html
│   ├── checkout.html
│   ├── pedido_status.html
│   ├── avaliacao.html
│   └── perfil_cliente.html
├── restaurante/               # Módulo do Restaurante
│   ├── cadastro_login_restaurante.html
│   ├── home_restaurante.html
│   ├── pedidos_restaurante.html
│   ├── cardapio_restaurante.html
│   ├── perfil_restaurante.html
│   ├── pedido_detalhes.html
│   ├── configuracoes_restaurante.html
│   └── relatorios_restaurante.html
├── entregador/                # Módulo do Entregador
│   ├── cadastro_login_entregador.html
│   ├── home_entregador.html
│   ├── pedidos_entregador.html
│   ├── perfil_entregador.html
│   ├── historico_entregas.html
│   └── configuracoes_entregador.html
├── admin/                     # Módulo Administrativo
│   ├── cadastro_login_admin.html
│   ├── home_admin.html
│   ├── gerenciar_usuarios.html
│   ├── gerenciar_restaurantes.html
│   ├── gerenciar_entregadores.html
│   ├── gerenciar_pedidos.html
│   ├── configuracoes_plataforma.html
│   └── relatorios_plataforma.html
└── README.md
```

## 👥 Módulos e Funcionalidades

### 🛒 Módulo Cliente
- **Cadastro/Login**: Sistema de autenticação com Firebase
- **Home**: Lista de restaurantes com filtros e busca
- **Restaurante**: Visualização de cardápio e produtos
- **Carrinho**: Gerenciamento de itens selecionados
- **Checkout**: Finalização de pedidos com taxas transparentes
- **Status do Pedido**: Acompanhamento em tempo real
- **Avaliação**: Sistema de rating para pedidos entregues
- **Perfil**: Gerenciamento de dados pessoais

### 🏪 Módulo Restaurante
- **Dashboard**: Visão geral com estatísticas
- **Pedidos**: Gerenciamento completo de pedidos
- **Cardápio**: CRUD de produtos e categorias
- **Perfil**: Configurações do estabelecimento
- **Configurações**: Horários, taxas e notificações
- **Relatórios**: Analytics e performance

### 🚚 Módulo Entregador
- **Dashboard**: Visão geral de entregas
- **Pedidos**: Aceitar e gerenciar entregas
- **Perfil**: Dados pessoais e veículo
- **Histórico**: Relatório de entregas realizadas
- **Configurações**: Preferências e disponibilidade

### ⚙️ Módulo Administrativo
- **Dashboard**: Visão geral da plataforma
- **Usuários**: Gerenciamento de todos os usuários
- **Restaurantes**: Aprovação e controle de estabelecimentos
- **Entregadores**: Gestão da frota de entregadores
- **Pedidos**: Monitoramento de todas as transações
- **Configurações**: Configurações globais da plataforma
- **Relatórios**: Analytics e métricas da plataforma

## 🔥 Integração Firebase

### Firebase Authentication
- Login/Registro para todos os tipos de usuário
- Controle de acesso baseado em roles
- Recuperação de senha
- Sessões seguras

### Firestore Database
- **Coleções principais**:
  - `usuarios` - Todos os usuários da plataforma
  - `restaurantes` - Dados dos estabelecimentos
  - `entregadores` - Dados dos entregadores
  - `produtos` - Cardápio dos restaurantes
  - `pedidos` - Todas as transações
  - `avaliacoes` - Sistema de ratings
  - `configuracoes_plataforma` - Configurações globais

### Firebase Storage
- Logos de restaurantes
- Fotos de produtos
- Documentos de entregadores
- Imagens de perfil

## 🚀 Como Executar o Projeto

### 1. Configuração do Firebase
```javascript
// Substitua em todos os arquivos HTML
const firebaseConfig = {
    apiKey: "sua-api-key",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "123456789",
    appId: "seu-app-id"
};
```

### 2. Estrutura do Firestore
```javascript
// Regras de segurança recomendadas
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
    
    // Pedidos - clientes veem seus pedidos, restaurantes veem pedidos deles
    match /pedidos/{pedidoId} {
      allow read, write: if request.auth != null && 
        (resource.data.clienteId == request.auth.uid || 
         resource.data.restauranteId == request.auth.uid);
    }
  }
}
```

### 3. Execução Local
1. Clone o repositório
2. Configure o Firebase
3. Abra os arquivos HTML em um servidor local (devido ao CORS)
4. Use um servidor como Live Server (VS Code) ou Python SimpleHTTPServer

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- 📱 **Mobile**: Smartphones e tablets
- 💻 **Desktop**: Computadores e notebooks
- 🌐 **Web**: Todos os navegadores modernos

## 🔒 Segurança

### Autenticação
- Firebase Authentication com email/senha
- Controle de acesso baseado em roles
- Sessões seguras com logout automático

### Validação
- Validação client-side em todos os formulários
- Sanitização de dados de entrada
- Proteção contra XSS e injeção

### Autorização
- Usuários só acessam dados relacionados a eles
- Administradores têm acesso completo
- Restaurantes veem apenas seus pedidos
- Entregadores veem apenas suas entregas

## 📊 Funcionalidades Avançadas

### Tempo Real
- Atualizações em tempo real com Firestore `onSnapshot`
- Status de pedidos atualizado instantaneamente
- Notificações push (preparado para implementação)

### Analytics
- Relatórios detalhados para todos os módulos
- Métricas de performance
- Exportação de dados
- Gráficos e visualizações

### Sistema de Avaliações
- Rating de 1 a 5 estrelas
- Comentários detalhados
- Média calculada automaticamente
- Histórico de avaliações

## 🛠️ Personalização

### Cores e Temas
- Sistema de cores centralizado
- Fácil personalização de branding
- Suporte a temas claro/escuro (preparado)

### Configurações
- Taxas configuráveis via painel admin
- Horários de funcionamento flexíveis
- Categorias de restaurantes personalizáveis
- Configurações de notificações

## 📈 Escalabilidade

### Arquitetura
- Código modular e organizado
- Separação clara de responsabilidades
- Fácil manutenção e atualização
- Preparado para crescimento

### Performance
- Lazy loading de dados
- Paginação para grandes volumes
- Cache local quando apropriado
- Otimizações de consultas Firestore

## 🔮 Roadmap e Melhorias

### Funcionalidades Futuras
- [ ] Sistema de pagamentos integrado
- [ ] Notificações push nativas
- [ ] App mobile nativo
- [ ] Sistema de cupons e promoções
- [ ] Integração com mapas
- [ ] Chat em tempo real
- [ ] Sistema de fidelidade
- [ ] Analytics avançados

### Melhorias Técnicas
- [ ] PWA (Progressive Web App)
- [ ] Service Workers para offline
- [ ] Otimização de performance
- [ ] Testes automatizados
- [ ] CI/CD pipeline

## 🤝 Contribuição

### Como Contribuir
1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

### Padrões de Código
- HTML5 semântico
- CSS3 com metodologia BEM
- JavaScript ES6+ com comentários
- Nomes de variáveis em português
- Estrutura de pastas organizada

## 📞 Suporte

### Documentação
- Código comentado em português
- Estrutura clara e organizada
- Exemplos de uso em cada módulo

### Comunidade
- Issues no GitHub
- Discussões sobre melhorias
- Compartilhamento de experiências

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🙏 Agradecimentos

- Firebase pela infraestrutura robusta
- Comunidade de desenvolvedores
- Todos os contribuidores do projeto

---

**Desenvolvido com ❤️ para revolucionar o delivery no Brasil!**

*PedidoFácil - Simples, Transparente, Eficiente*
