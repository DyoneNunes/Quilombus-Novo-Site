# Backend API - Quilombus Network

API backend para gerenciamento de contatos e envio de emails via SMTP do Gmail.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Endpoints](#endpoints)
- [Testes](#testes)
- [Segurança](#segurança)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

Este backend gerencia o formulário de contato da landing page Quilombus Network, processando envios de mensagens e enviando emails automáticos via SMTP do Gmail.

### Funcionalidades

- ✅ Envio de emails via SMTP do Gmail
- ✅ Email de notificação para a equipe Quilombus
- ✅ Email de confirmação para o cliente
- ✅ Validação robusta de dados
- ✅ Proteção contra spam com rate limiting
- ✅ Sanitização de inputs
- ✅ CORS configurado
- ✅ Error handling completo

---

## 🛠 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Nodemailer** - Envio de emails SMTP
- **express-rate-limit** - Rate limiting
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Gerenciamento de variáveis de ambiente

---

## 📦 Instalação

### 1. Instalar dependências

```bash
cd backend
npm install
```

### 2. Estrutura de arquivos criada

```
backend/
├── server.js                 # Servidor Express principal
├── services/
│   └── emailService.js       # Serviço de envio de emails
├── middleware/
│   └── rateLimiter.js        # Proteção contra spam
├── utils/
│   └── validation.js         # Validação e sanitização
├── scripts/
│   └── test-email.js         # Script de teste SMTP
├── .env                      # Variáveis de ambiente (não commitado)
├── .gitignore               # Arquivos ignorados pelo Git
├── package.json             # Dependências e scripts
└── README.md                # Este arquivo
```

---

## ⚙️ Configuração

### 1. Arquivo `.env`

O arquivo `.env` já está configurado com as credenciais do Gmail:

```env
# Servidor
PORT=5000
NODE_ENV=development

# SMTP Gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=dyone.andrade@quilombusnetwork.com.br
SMTP_PASS=peja juil vnsv mddj

# Email
EMAIL_FROM=dyone.andrade@quilombusnetwork.com.br
EMAIL_FROM_NAME=Quilombus Network
NOTIFICATION_EMAILS=dyone.andrade@quilombusnetwork.com.br,najufrrs@gmail.com

# Frontend
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_MAX=5
RATE_LIMIT_WINDOW=15
```

### 2. Senha de App do Gmail

A senha configurada (`peja juil vnsv mddj`) é uma **Senha de App** do Gmail, não a senha normal da conta.

**⚠️ IMPORTANTE:** Nunca compartilhe estas credenciais publicamente!

---

## 🚀 Uso

### 1. Iniciar o servidor

```bash
cd backend
npm start
```

Você verá:

```
============================================================
🚀 SERVIDOR QUILOMBUS BACKEND INICIADO
============================================================
📍 Porta: 5000
🌍 Ambiente: development
📧 SMTP: smtp.gmail.com:465
🔗 Frontend: http://localhost:3000
🛡️  Rate Limit: 5 requisições / 15 minutos
============================================================

📋 Endpoints disponíveis:
   GET  http://localhost:5000/api/health
   POST http://localhost:5000/api/contact

✨ Servidor pronto para receber requisições!
```

### 2. Modo desenvolvimento (com auto-reload)

```bash
npm run dev
```

---

## 📡 Endpoints

### GET `/api/health`

Verifica se o servidor está funcionando.

**Resposta:**

```json
{
  "success": true,
  "message": "Quilombus Backend API is running",
  "timestamp": "2024-11-23T15:30:00.000Z",
  "environment": "development"
}
```

### POST `/api/contact`

Processa formulário de contato e envia emails.

**Request Body:**

```json
{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "company": "Empresa X",
  "phone": "(11) 99999-9999",
  "message": "Gostaria de saber mais sobre os serviços..."
}
```

**Campos obrigatórios:** `name`, `email`, `message`

**Resposta de Sucesso (200):**

```json
{
  "success": true,
  "message": "Mensagem enviada com sucesso! Entraremos em contato em breve.",
  "code": "EMAIL_SENT",
  "data": {
    "notificationSent": true,
    "confirmationSent": true
  }
}
```

**Resposta de Erro (400 - Validação):**

```json
{
  "success": false,
  "error": "Dados do formulário inválidos",
  "code": "VALIDATION_ERROR",
  "details": [
    {
      "field": "email",
      "message": "Email inválido"
    }
  ]
}
```

**Resposta de Erro (429 - Rate Limit):**

```json
{
  "success": false,
  "error": "Muitas tentativas de envio. Por favor, aguarde alguns minutos e tente novamente.",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 900
}
```

---

## 🧪 Testes

### Testar configuração SMTP

```bash
cd backend
npm run test-email
```

Este script:
1. Verifica a conexão com o servidor SMTP
2. Envia um email de teste para o primeiro email da lista de notificações
3. Exibe informações detalhadas sobre o resultado

**Saída esperada:**

```
============================================================
📧 TESTE DE CONFIGURAÇÃO SMTP - QUILOMBUS NETWORK
============================================================

⚙️  Configurações carregadas:
   Host: smtp.gmail.com
   Port: 465
   ...

🔌 Criando transporter...
🔍 Verificando conexão SMTP...
✅ Conexão SMTP verificada com sucesso!

📨 Enviando email de teste...
✅ Email de teste enviado com sucesso!
📬 Message ID: ...

============================================================
🎉 TESTE CONCLUÍDO COM SUCESSO!
============================================================
```

---

## 🔒 Segurança

### Rate Limiting

Protege contra spam limitando requisições:
- **5 requisições por IP** a cada **15 minutos**
- Configurável via `.env`

### Validação de Dados

- Email no formato válido
- Nome com 2-100 caracteres
- Mensagem com 10-5000 caracteres
- Telefone no formato brasileiro (opcional)
- Detecção de palavras-chave de spam

### Sanitização

- Remove caracteres perigosos (`<`, `>`)
- Limita tamanho máximo dos campos
- Trim em todos os campos

### CORS

- Aceita requisições apenas do frontend configurado
- Default: `http://localhost:3000`

---

## 🐛 Troubleshooting

### Erro: "Invalid login" ou "Authentication failed"

**Causa:** Credenciais SMTP incorretas

**Solução:**
1. Verifique `SMTP_USER` e `SMTP_PASS` no `.env`
2. Certifique-se de usar uma **Senha de App**, não a senha normal
3. Gere uma nova senha de app em: https://myaccount.google.com/apppasswords

### Erro: "ECONNREFUSED" ou "ETIMEDOUT"

**Causa:** Não consegue conectar ao servidor SMTP

**Solução:**
1. Verifique se `SMTP_HOST` está correto
2. Verifique se a porta está liberada no firewall
3. Tente alternar entre portas 465 (SSL) e 587 (TLS)

### Emails caem no spam

**Solução:**
1. Configure registros SPF, DKIM e DMARC no seu domínio
2. Use um email remetente do mesmo domínio do servidor SMTP
3. Evite palavras suspeitas no assunto e corpo do email

### Frontend não consegue conectar ao backend

**Causa:** Proxy não configurado ou backend não está rodando

**Solução:**
1. Verifique se o backend está rodando na porta 5000
2. Verifique se o `proxy` está configurado no `package.json` do frontend
3. Reinicie o frontend após adicionar o proxy

---

## 📝 Logs

O servidor exibe logs detalhados:

```
📥 POST /api/contact { ip: '::1', timestamp: '...' }
📨 Processando contato: { name: 'João', email: 'joao@...', ... }
✅ Contato processado com sucesso em 1234ms
```

Em caso de erro:

```
❌ Erro ao processar contato (1234ms): { error: '...', stack: '...', body: {...} }
```

---

## 📧 Emails Enviados

### 1. Email de Notificação (para Quilombus)

Enviado para: `dyone.andrade@quilombusnetwork.com.br`, `najufrrs@gmail.com`

Contém:
- Dados completos do formulário
- Data/hora de recebimento
- Botões de ação (responder, ligar)

### 2. Email de Confirmação (para Cliente)

Enviado para: email do cliente que preencheu o formulário

Contém:
- Confirmação de recebimento
- Informações sobre prazo de resposta (24h)
- Informações sobre serviços Quilombus
- Link para o site

---

## 🔄 Fluxo Completo

1. **Cliente** preenche formulário no frontend
2. **Frontend** envia POST para `/api/contact`
3. **Backend** valida dados (middleware)
4. **Backend** verifica rate limit (middleware)
5. **Backend** sanitiza dados
6. **Backend** envia 2 emails em paralelo:
   - Notificação para Quilombus
   - Confirmação para cliente
7. **Backend** retorna resposta de sucesso
8. **Frontend** exibe mensagem de confirmação

---

## 📞 Suporte

Para dúvidas ou problemas:
- Email: dyone.andrade@quilombusnetwork.com.br
- Verifique os logs do servidor
- Execute o script de teste: `npm run test-email`

---

**© 2024 Quilombus Network - Todos os direitos reservados**
