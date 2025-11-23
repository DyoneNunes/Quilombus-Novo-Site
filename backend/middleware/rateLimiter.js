const rateLimit = require('express-rate-limit');

/**
 * Rate Limiter Middleware
 * Protege contra spam e abuso no endpoint de contato
 */

// Configuração do rate limiter
const contactLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // Janela de tempo em minutos
  max: parseInt(process.env.RATE_LIMIT_MAX || 5), // Máximo de requisições por janela
  message: {
    success: false,
    error: 'Muitas tentativas de envio. Por favor, aguarde alguns minutos e tente novamente.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
  standardHeaders: true, // Retorna informações de rate limit nos headers `RateLimit-*`
  legacyHeaders: false, // Desabilita headers `X-RateLimit-*`
  handler: (req, res) => {
    console.log('⚠️  Rate limit excedido:', {
      ip: req.ip,
      path: req.path,
      timestamp: new Date().toISOString(),
    });

    res.status(429).json({
      success: false,
      error: 'Muitas tentativas de envio. Por favor, aguarde alguns minutos e tente novamente.',
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000), // Tempo em segundos até poder tentar novamente
    });
  },
  skip: (req) => {
    // Em desenvolvimento, pode desabilitar rate limit para teste
    if (process.env.NODE_ENV === 'test') {
      return true;
    }
    return false;
  },
});

// Log quando rate limiter está ativo
console.log('🛡️  Rate Limiter configurado:', {
  windowMinutes: process.env.RATE_LIMIT_WINDOW || 15,
  maxRequests: process.env.RATE_LIMIT_MAX || 5,
});

module.exports = {
  contactLimiter,
};
