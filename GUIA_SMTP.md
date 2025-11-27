# 📧 Guia de Início Rápido - Integração SMTP

Este guia mostra como executar o sistema completo com a integração SMTP do Gmail.

## ✅ Status da Integração

A integração SMTP foi implementada com sucesso! O sistema está pronto para uso.

### Funcionalidades Implementadas

- ✅ Backend Node.js/Express
- ✅ Envio de emails via SMTP do Gmail
- ✅ Email de notificação para equipe Quilombus (dyone.andrade@quilombusnetwork.com.br, najufrrs@gmail.com)
- ✅ Email de confirmação para cliente
- ✅ Validação robusta de formulário
- ✅ Proteção contra spam (rate limiting)
- ✅ Frontend integrado com backend
- ✅ Testado e funcionando

---

## 🚀 Como Executar

### 1. Backend (Terminal 1)

```bash
# Navegar para pasta backend
cd backend

# Instalar dependências (apenas primeira vez)
npm install

# Iniciar servidor backend
npm start
```

**Você verá:**
```
============================================================
🚀 SERVIDOR QUILOMBUS BACKEND INICIADO
============================================================
📍 Porta: 5001
🌍 Ambiente: development
📧 SMTP: smtp.gmail.com:465
🔗 Frontend: http://localhost:3000
🛡️  Rate Limit: 5 requisições / 15 minutos
============================================================
✨ Servidor pronto para receber requisições!
```

### 2. Frontend (Terminal 2)

```bash
# Na raiz do projeto
npm start
```

O navegador abrirá automaticamente em `http://localhost:3000`

---

## 🧪 Testar SMTP

### Teste 1: Verificar configuração SMTP

```bash
cd backend
npm run test-email
```

Este comando envia um email de teste para verificar se as credenciais estão corretas.

### Teste 2: Testar via curl

```bash
curl -X POST http://localhost:5001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste",
    "email": "seu-email@exemplo.com",
    "message": "Mensagem de teste"
  }'
```

### Teste 3: Testar via navegador

1. Abra `http://localhost:3000`
2. Role até o formulário de contato
3. Preencha o formulário
4. Clique em "Enviar Mensagem"
5. Você receberá uma confirmação na tela
6. Verifique os emails:
   - **dyone.andrade@quilombusnetwork.com.br** receberá notificação
   - **najufrrs@gmail.com** receberá notificação
   - **Email do cliente** receberá confirmação

---

## 📂 Estrutura de Arquivos

```
quilombus-landing-page/
├── backend/                           # Backend Node.js/Express
│   ├── server.js                      # Servidor principal
│   ├── services/
│   │   └── emailService.js            # Serviço de envio de emails
│   ├── middleware/
│   │   └── rateLimiter.js             # Rate limiting
│   ├── utils/
│   │   └── validation.js              # Validação de dados
│   ├── scripts/
│   │   └── test-email.js              # Script de teste SMTP
│   ├── .env                           # Variáveis de ambiente (CONFIGURADO)
│   ├── package.json                   # Dependências backend
│   └── README.md                      # Documentação completa
│
├── src/
│   ├── components/
│   │   └── ContactForm/
│   │       ├── ContactForm.js         # Formulário (ATUALIZADO)
│   │       └── ContactForm.module.css # Estilos
│   └── ...
│
├── package.json                       # Dependências frontend (proxy configurado)
└── GUIA_SMTP.md                       # Este arquivo
```

---

## ⚙️ Configurações

### Credenciais SMTP (backend/.env)

As credenciais já estão configuradas:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=dyone.andrade@quilombusnetwork.com.br
SMTP_PASS=peja juil vnsv mddj  # Senha de App do Gmail
```

### Destinatários de Notificação

```env
NOTIFICATION_EMAILS=dyone.andrade@quilombusnetwork.com.br,najufrrs@gmail.com
```

### Rate Limiting

- **5 requisições** por IP a cada **15 minutos**
- Configurável em `backend/.env`

---

## 📧 Emails Enviados

### 1. Email de Notificação (para Quilombus)

**Destinatários:** dyone.andrade@quilombusnetwork.com.br, najufrrs@gmail.com

**Contém:**
- Nome do cliente
- Email do cliente
- Empresa (se informado)
- Telefone (se informado)
- Mensagem completa
- Data/hora de recebimento
- Botões de ação (responder, ligar)

### 2. Email de Confirmação (para Cliente)

**Destinatário:** Email do cliente que preencheu o formulário

**Contém:**
- Confirmação de recebimento
- Prazo de resposta (24h úteis)
- Informações sobre serviços Quilombus
- Link para o site

---

## 🔒 Segurança Implementada

### Validações
- ✅ Email em formato válido
- ✅ Nome com 2-100 caracteres
- ✅ Mensagem com 10-5000 caracteres
- ✅ Telefone no formato brasileiro (opcional)
- ✅ Detecção de spam

### Proteções
- ✅ Rate limiting (5 req/15min por IP)
- ✅ Sanitização de inputs
- ✅ CORS configurado
- ✅ Credenciais protegidas no backend

---

## 🐛 Troubleshooting

### Backend não inicia

**Problema:** Porta 5001 já está em uso

**Solução:**
```bash
# Verificar processo usando a porta
lsof -i:5001

# Matar processo
lsof -ti:5001 | xargs kill -9

# Ou mudar porta em backend/.env
PORT=5002
```

### Frontend não conecta ao backend

**Problema:** Proxy não está funcionando

**Solução:**
1. Verifique se o backend está rodando
2. Reinicie o frontend após configurar proxy
3. Verifique `package.json`: deve ter `"proxy": "http://localhost:5001"`

### Emails não chegam

**Problema:** Credenciais SMTP incorretas

**Solução:**
1. Execute `npm run test-email` no backend
2. Verifique se a senha de app está correta
3. Verifique pasta de spam nos emails

### Rate limit atingido

**Problema:** Muitas tentativas de envio

**Solução:**
- Aguarde 15 minutos
- Ou ajuste `RATE_LIMIT_MAX` e `RATE_LIMIT_WINDOW` em `.env`

---

## 📊 Logs do Sistema

O backend exibe logs detalhados:

### Sucesso
```
📨 Processando contato: { name: 'João', email: 'joao@...', ... }
✅ Email de notificação enviado com sucesso
✅ Email de confirmação enviado com sucesso
✅ Contato processado com sucesso em 3101ms
```

### Erro
```
❌ Erro ao processar contato (1234ms): { error: '...', stack: '...', body: {...} }
```

---

## 📝 Checklist de Teste

Use esta lista para validar a integração:

- [x] Backend instalado e rodando
- [x] Frontend rodando e conectando ao backend
- [x] Script de teste SMTP funcionando
- [x] Email de notificação chegando para dyone.andrade@quilombusnetwork.com.br
- [x] Email de notificação chegando para najufrrs@gmail.com
- [x] Email de confirmação chegando para o cliente
- [x] Validação de campos funcionando
- [x] Rate limiting protegendo contra spam
- [x] Mensagens de erro exibidas corretamente no frontend

---

## 🎯 Próximos Passos (Opcional)

### Melhorias Futuras

1. **Produção:**
   - Deploy do backend (Heroku, Railway, Vercel Serverless)
   - Variáveis de ambiente seguras
   - Domínio próprio para emails

2. **Funcionalidades:**
   - Google reCAPTCHA no formulário
   - Webhook para Slack/Discord
   - Dashboard de mensagens recebidas
   - Analytics de conversão

3. **Emails:**
   - Templates customizáveis
   - Anexos de arquivos
   - Agendamento de follow-up

---

## 📞 Suporte

Para dúvidas ou problemas:

- **Email:** dyone.andrade@quilombusnetwork.com.br
- **Logs:** Verifique o terminal do backend
- **Teste:** Execute `npm run test-email` no backend
- **Documentação Completa:** `backend/README.md`

---

## ✨ Resumo de Comandos

```bash
# Testar SMTP
cd backend && npm run test-email

# Iniciar backend
cd backend && npm start

# Iniciar frontend (outro terminal)
npm start

# Testar via curl
curl -X POST http://localhost:5001/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"teste@exemplo.com","message":"Mensagem teste"}'
```

---

**© 2024 Quilombus Network - Sistema de Contato com SMTP integrado ✅**

**Status:** ✅ PRONTO PARA USO
