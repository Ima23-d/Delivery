# 🔧 Instruções para Resolver o CORS e Reativar Uploads

## 📋 **Status Atual**
As funcionalidades de upload de arquivos foram **temporariamente desabilitadas** para permitir que você teste a aplicação sem erros de CORS.

## 🚨 **Problema Identificado**
```
Access to XMLHttpRequest at 'https://firebasestorage.googleapis.com/v0/b/appdelivery-38949.firebasestorage.app/o?name=drivers%2FuN17xeeCCQORODk2XfPlBiuYBo43%2FuN17xeeCCQORODk2XfPlBiuYBo43_cnh_1755907035914.pdf' from origin 'http://127.0.0.1:5500' has been blocked by CORS policy
```

## 🎯 **Solução: Configurar CORS no Firebase Storage**

### **Opção 1: Via Google Cloud Console (Recomendado)**

1. **Acesse o Google Cloud Console:**
   - Vá para [console.cloud.google.com](https://console.cloud.google.com)
   - Selecione seu projeto Firebase (`appdelivery-38949`)

2. **Navegue para Cloud Storage:**
   - No menu lateral, clique em "Storage" → "Browser"

3. **Configure CORS:**
   - Clique no nome do seu bucket (`appdelivery-38949.appspot.com`)
   - Vá para a aba "CORS"
   - Clique em "Add CORS rule"

4. **Configure as regras CORS:**
   ```json
   [
     {
       "origin": ["http://127.0.0.1:5500", "http://localhost:5500", "http://localhost:3000"],
       "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
       "responseHeader": ["Content-Type", "Access-Control-Allow-Origin"],
       "maxAgeSeconds": 3600
     }
   ]
   ```

### **Opção 2: Via gsutil (Linha de Comando)**

1. **Instale o gsutil** (se não tiver):
   ```bash
   # Windows (via Google Cloud SDK)
   # Baixe e instale o Google Cloud SDK
   
   # macOS/Linux
   curl https://sdk.cloud.google.com | bash
   exec -l $SHELL
   gcloud init
   ```

2. **Crie um arquivo `cors.json`:**
   ```json
   [
     {
       "origin": ["http://127.0.0.1:5500", "http://localhost:5500", "http://localhost:3000"],
       "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
       "responseHeader": ["Content-Type", "Access-Control-Allow-Origin"],
       "maxAgeSeconds": 3600
     }
   ]
   ```

3. **Aplique a configuração:**
   ```bash
   gsutil cors set cors.json gs://appdelivery-38949.appspot.com
   ```

## 🔄 **Como Reativar as Funcionalidades de Upload**

Após configurar o CORS, siga estes passos:

### **1. Reativar o Firebase Storage no `assets/firebase-config.js`:**
```javascript
// Descomente esta linha:
window.storage = firebase.storage();
```

### **2. Reativar os scripts do Firebase Storage nas páginas:**
- Remova os comentários `<!-- -->` dos scripts:
```html
<script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-storage-compat.js"></script>
```

### **3. Reativar as funções de upload:**
- **`motorista/cadastro.html`**: Descomente as funções `handleFileUpload`, `showFilePreview`, `removeFile`, `clearFilePreviews`
- **`passageiro/perfil.html`**: Descomente a função `uploadAvatar`

### **4. Reativar as validações de documentos:**
- **`motorista/cadastro.html`**: Descomente as validações de documentos obrigatórios

### **5. Reativar os inputs de arquivo:**
- Remova os comentários dos inputs `type="file"`
- Restaure os `onclick` e `onchange` handlers

## 📁 **Arquivos Modificados Temporariamente**

### **Comentados no `assets/firebase-config.js`:**
- `window.storage = firebase.storage();`

### **Comentados no `motorista/cadastro.html`:**
- Inputs de arquivo (CNH, CRLV, Foto do Veículo, Seguro)
- Função `handleFileUpload`
- Função `showFilePreview`
- Função `removeFile`
- Função `clearFilePreviews`
- Validações de documentos obrigatórios
- Upload de documentos para Firebase Storage
- Drag and drop

### **Comentados no `passageiro/perfil.html`:**
- Input de avatar
- Função `uploadAvatar`
- Upload para Firebase Storage

### **Scripts do Firebase Storage comentados em todas as páginas:**
- `<script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-storage-compat.js"></script>`

## ✅ **Teste Após Reativação**

1. **Reinicie seu servidor local**
2. **Teste o cadastro de motorista** com upload de documentos
3. **Teste o upload de avatar** no perfil do passageiro
4. **Verifique o console** para confirmar que não há erros de CORS

## 🚀 **Alternativas para Desenvolvimento**

### **Opção A: Usar Firebase Hosting**
```bash
firebase init hosting
firebase deploy
```

### **Opção B: Configurar domínio local**
- Adicione `127.0.0.1` e `localhost` às origens permitidas no CORS

### **Opção C: Usar HTTPS local**
- Configure um certificado SSL local para desenvolvimento

## 📞 **Suporte**

Se continuar com problemas após configurar o CORS:
1. Verifique se o bucket está correto
2. Confirme se as regras CORS foram aplicadas
3. Teste com diferentes origens
4. Verifique os logs do Firebase Console

---

**⚠️ Importante:** As funcionalidades de upload são essenciais para o cadastro de motoristas e perfil de usuários. Configure o CORS assim que possível para ter a aplicação funcionando completamente.
