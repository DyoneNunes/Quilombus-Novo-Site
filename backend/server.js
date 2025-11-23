require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { processContactEmails } = require('./services/emailService');
const { contactLimiter } = require('./middleware/rateLimiter');
const { validateContactMiddleware } = require('./utils/validation');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares globais
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Log de requisições em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.path}`, {
      ip: req.ip,
      timestamp: new Date().toISOString(),
    });
    next();
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Quilombus Backend API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Endpoint de contato (POST /api/contact)
app.post(
  '/api/contact',
  contactLimiter, // Rate limiting
  validateContactMiddleware, // Validação e sanitização
  async (req, res) => {
    const startTime = Date.now();

    try {
      console.log('📨 Processando contato:', {
        name: req.body.name,
        email: req.body.email,
        company: req.body.company || 'N/A',
        phone: req.body.phone || 'N/A',
        ip: req.ip,
      });

      // Processar envio de emails
      const result = await processContactEmails(req.body);

      const duration = Date.now() - startTime;

      console.log(`✅ Contato processado com sucesso em ${duration}ms`);

      res.status(200).json({
        success: true,
        message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
        code: 'EMAIL_SENT',
        data: {
          notificationSent: result.notification.success,
          confirmationSent: result.confirmation.success,
        },
      });
    } catch (error) {
      const duration = Date.now() - startTime;

      console.error(`❌ Erro ao processar contato (${duration}ms):`, {
        error: error.message,
        stack: error.stack,
        body: req.body,
      });

      // Verificar se é erro de autenticação SMTP
      if (error.message.includes('Invalid login') || error.message.includes('Authentication failed')) {
        return res.status(500).json({
          success: false,
          error: 'Erro de configuração do servidor de email. Por favor, tente novamente mais tarde.',
          code: 'SMTP_AUTH_ERROR',
        });
      }

      // Verificar se é erro de conexão
      if (error.message.includes('ECONNREFUSED') || error.message.includes('ETIMEDOUT')) {
        return res.status(500).json({
          success: false,
          error: 'Não foi possível conectar ao servidor de email. Por favor, tente novamente mais tarde.',
          code: 'SMTP_CONNECTION_ERROR',
        });
      }

      // Erro genérico
      res.status(500).json({
        success: false,
        error: 'Erro ao enviar mensagem. Por favor, tente novamente mais tarde.',
        code: 'INTERNAL_ERROR',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
);

// Rota 404 - Not Found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint não encontrado',
    code: 'NOT_FOUND',
    path: req.path,
  });
});

// Error handler global
app.use((err, req, res, next) => {
  console.error('❌ Erro não tratado:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
  });

  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor',
    code: 'INTERNAL_ERROR',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 SERVIDOR QUILOMBUS BACKEND INICIADO');
  console.log('='.repeat(60));
  console.log(`📍 Porta: ${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📧 SMTP: ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}`);
  console.log(`🔗 Frontend: ${process.env.FRONTEND_URL}`);
  console.log(`🛡️  Rate Limit: ${process.env.RATE_LIMIT_MAX} requisições / ${process.env.RATE_LIMIT_WINDOW} minutos`);
  console.log('='.repeat(60));
  console.log('\n📋 Endpoints disponíveis:');
  console.log(`   GET  http://localhost:${PORT}/api/health`);
  console.log(`   POST http://localhost:${PORT}/api/contact`);
  console.log('\n✨ Servidor pronto para receber requisições!\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n🛑 Recebido SIGTERM. Encerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Recebido SIGINT. Encerrando servidor...');
  process.exit(0);
});

module.exports = app;
