/**
 * Utilitários de Validação
 * Valida e sanitiza dados do formulário de contato
 */

/**
 * Valida formato de email
 * @param {string} email - Email a ser validado
 * @returns {boolean}
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida formato de telefone brasileiro
 * @param {string} phone - Telefone a ser validado
 * @returns {boolean}
 */
const isValidPhone = (phone) => {
  if (!phone) return true; // Telefone é opcional

  // Remove caracteres não numéricos
  const cleanPhone = phone.replace(/\D/g, '');

  // Aceita telefones com 10 ou 11 dígitos (com DDD)
  return cleanPhone.length >= 10 && cleanPhone.length <= 11;
};

/**
 * Sanitiza string removendo caracteres perigosos
 * @param {string} str - String a ser sanitizada
 * @returns {string}
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';

  return str
    .trim()
    .replace(/[<>]/g, '') // Remove < e > para prevenir XSS
    .substring(0, 5000); // Limita tamanho máximo
};

/**
 * Valida dados do formulário de contato
 * @param {Object} formData - Dados do formulário
 * @returns {Object} - { valid: boolean, errors: Array, sanitized: Object }
 */
const validateContactForm = (formData) => {
  const errors = [];
  const sanitized = {};

  // Validar e sanitizar nome
  if (!formData.name || formData.name.trim() === '') {
    errors.push({ field: 'name', message: 'Nome é obrigatório' });
  } else if (formData.name.length < 2) {
    errors.push({ field: 'name', message: 'Nome deve ter pelo menos 2 caracteres' });
  } else if (formData.name.length > 100) {
    errors.push({ field: 'name', message: 'Nome muito longo (máximo 100 caracteres)' });
  } else {
    sanitized.name = sanitizeString(formData.name);
  }

  // Validar e sanitizar email
  if (!formData.email || formData.email.trim() === '') {
    errors.push({ field: 'email', message: 'Email é obrigatório' });
  } else if (!isValidEmail(formData.email)) {
    errors.push({ field: 'email', message: 'Email inválido' });
  } else if (formData.email.length > 200) {
    errors.push({ field: 'email', message: 'Email muito longo' });
  } else {
    sanitized.email = sanitizeString(formData.email.toLowerCase());
  }

  // Validar e sanitizar empresa (opcional)
  if (formData.company) {
    if (formData.company.length > 200) {
      errors.push({ field: 'company', message: 'Nome da empresa muito longo (máximo 200 caracteres)' });
    } else {
      sanitized.company = sanitizeString(formData.company);
    }
  } else {
    sanitized.company = '';
  }

  // Validar e sanitizar telefone (opcional)
  if (formData.phone) {
    if (!isValidPhone(formData.phone)) {
      errors.push({ field: 'phone', message: 'Telefone inválido (deve ter DDD + número)' });
    } else if (formData.phone.length > 20) {
      errors.push({ field: 'phone', message: 'Telefone muito longo' });
    } else {
      sanitized.phone = sanitizeString(formData.phone);
    }
  } else {
    sanitized.phone = '';
  }

  // Validar e sanitizar mensagem
  if (!formData.message || formData.message.trim() === '') {
    errors.push({ field: 'message', message: 'Mensagem é obrigatória' });
  } else if (formData.message.length < 10) {
    errors.push({ field: 'message', message: 'Mensagem muito curta (mínimo 10 caracteres)' });
  } else if (formData.message.length > 5000) {
    errors.push({ field: 'message', message: 'Mensagem muito longa (máximo 5000 caracteres)' });
  } else {
    sanitized.message = sanitizeString(formData.message);
  }

  // Verificar se há spam comum
  const spamKeywords = ['viagra', 'cialis', 'casino', 'lottery', 'prize'];
  const messageText = formData.message ? formData.message.toLowerCase() : '';

  const hasSpam = spamKeywords.some(keyword => messageText.includes(keyword));
  if (hasSpam) {
    errors.push({ field: 'message', message: 'Mensagem contém conteúdo suspeito' });
  }

  return {
    valid: errors.length === 0,
    errors,
    sanitized: errors.length === 0 ? sanitized : null,
  };
};

/**
 * Middleware Express para validação
 */
const validateContactMiddleware = (req, res, next) => {
  const validation = validateContactForm(req.body);

  if (!validation.valid) {
    console.log('⚠️  Validação falhou:', {
      errors: validation.errors,
      ip: req.ip,
    });

    return res.status(400).json({
      success: false,
      error: 'Dados do formulário inválidos',
      code: 'VALIDATION_ERROR',
      details: validation.errors,
    });
  }

  // Substitui req.body pelos dados sanitizados
  req.body = validation.sanitized;
  next();
};

module.exports = {
  isValidEmail,
  isValidPhone,
  sanitizeString,
  validateContactForm,
  validateContactMiddleware,
};
