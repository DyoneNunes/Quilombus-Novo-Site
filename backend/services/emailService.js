const nodemailer = require('nodemailer');

/**
 * Email Service para Quilombus Network
 * Gerencia envio de emails via SMTP do Gmail
 */

// Criar transporter do Nodemailer com configurações do Gmail
const createTransporter = () => {
  const config = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };

  console.log('📧 Email transporter configurado:', {
    host: config.host,
    port: config.port,
    secure: config.secure,
    user: config.auth.user,
  });

  return nodemailer.createTransport(config);
};

/**
 * Enviar notificação para a equipe Quilombus
 * @param {Object} formData - Dados do formulário de contato
 */
const sendNotificationEmail = async (formData) => {
  try {
    const transporter = createTransporter();
    const { name, email, company, phone, message } = formData;

    // Lista de emails que receberão notificação
    const notificationEmails = process.env.NOTIFICATION_EMAILS.split(',').map(e => e.trim());

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to: notificationEmails.join(', '),
      subject: `🔔 Novo Contato - ${name}`,
      html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Novo Contato - Quilombus Network</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Quilombus Network</h1>
    <p style="color: #f0f0f0; margin: 10px 0 0 0;">Novo Contato Recebido</p>
  </div>

  <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <h2 style="color: #667eea; margin-top: 0; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
      📬 Informações do Contato
    </h2>

    <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 10px 0;">
        <strong style="color: #667eea; display: inline-block; width: 120px;">Nome:</strong>
        <span style="color: #333;">${name}</span>
      </p>
      <p style="margin: 10px 0;">
        <strong style="color: #667eea; display: inline-block; width: 120px;">Email:</strong>
        <a href="mailto:${email}" style="color: #764ba2; text-decoration: none;">${email}</a>
      </p>
      ${company ? `
      <p style="margin: 10px 0;">
        <strong style="color: #667eea; display: inline-block; width: 120px;">Empresa:</strong>
        <span style="color: #333;">${company}</span>
      </p>
      ` : ''}
      ${phone ? `
      <p style="margin: 10px 0;">
        <strong style="color: #667eea; display: inline-block; width: 120px;">Telefone:</strong>
        <a href="tel:${phone}" style="color: #764ba2; text-decoration: none;">${phone}</a>
      </p>
      ` : ''}
    </div>

    <h3 style="color: #333; margin-top: 30px;">💬 Mensagem:</h3>
    <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
      <p style="margin: 0; white-space: pre-wrap; color: #333;">${message}</p>
    </div>

    <div style="margin-top: 30px; padding: 20px; background: #e8f4f8; border-radius: 8px; text-align: center;">
      <p style="margin: 0 0 15px 0; color: #666; font-size: 14px;">
        📅 Recebido em: ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
      </p>
      <a href="mailto:${email}" style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 5px;">
        Responder por Email
      </a>
      ${phone ? `
      <a href="tel:${phone}" style="display: inline-block; background: #25D366; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 5px;">
        Ligar
      </a>
      ` : ''}
    </div>
  </div>

  <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
    <p>© ${new Date().getFullYear()} Quilombus Network - Sistema de Gerenciamento de Contatos</p>
  </div>
</body>
</html>
      `,
      text: `
NOVO CONTATO - QUILOMBUS NETWORK

INFORMAÇÕES DO CONTATO:
Nome: ${name}
Email: ${email}
${company ? `Empresa: ${company}` : ''}
${phone ? `Telefone: ${phone}` : ''}

MENSAGEM:
${message}

---
Recebido em: ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}

Para responder: ${email}
${phone ? `Para ligar: ${phone}` : ''}

© ${new Date().getFullYear()} Quilombus Network
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Email de notificação enviado com sucesso:', {
      to: notificationEmails,
      messageId: info.messageId,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Erro ao enviar email de notificação:', {
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
};

/**
 * Enviar email de confirmação para o usuário
 * @param {Object} formData - Dados do formulário de contato
 */
const sendConfirmationEmail = async (formData) => {
  try {
    const transporter = createTransporter();
    const { name, email } = formData;

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Recebemos sua mensagem - Quilombus Network',
      html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmação de Contato</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Quilombus Network</h1>
    <p style="color: #f0f0f0; margin: 10px 0 0 0;">Transformando Ideias em Soluções</p>
  </div>

  <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <h2 style="color: #667eea; margin-top: 0;">Olá, ${name}! 👋</h2>

    <p style="font-size: 16px; color: #333;">
      Recebemos sua mensagem e agradecemos pelo contato!
    </p>

    <div style="background: linear-gradient(135deg, #e8f4f8 0%, #f0e8f8 100%); padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #667eea;">
      <p style="margin: 0; font-size: 18px; color: #333; font-weight: 500;">
        ✓ Sua mensagem foi recebida com sucesso!
      </p>
    </div>

    <p style="font-size: 15px; color: #555; line-height: 1.8;">
      Nossa equipe analisará suas informações e retornará em breve.
      Normalmente respondemos em até <strong>24 horas úteis</strong>.
    </p>

    <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 25px 0;">
      <h3 style="color: #667eea; margin-top: 0; font-size: 18px;">🚀 Enquanto isso...</h3>
      <p style="margin: 10px 0; color: #555;">
        Conheça mais sobre nossos serviços e cases de sucesso:
      </p>
      <ul style="color: #555; line-height: 1.8;">
        <li>Desenvolvimento de Soluções Personalizadas</li>
        <li>Consultoria em Transformação Digital</li>
        <li>Automação e Inteligência Artificial</li>
        <li>Integração de Sistemas</li>
      </ul>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.FRONTEND_URL}" style="display: inline-block; background: #667eea; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
        Visitar Nosso Site
      </a>
    </div>

    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
      <p style="color: #666; font-size: 14px; margin: 5px 0;">
        Tem alguma dúvida urgente? Entre em contato:
      </p>
      <p style="color: #666; font-size: 14px; margin: 5px 0;">
        📧 Email: <a href="mailto:${process.env.EMAIL_FROM}" style="color: #667eea; text-decoration: none;">${process.env.EMAIL_FROM}</a>
      </p>
      <p style="color: #999; font-size: 12px; margin: 15px 0 0 0;">
        Este é um email automático, mas você pode responder diretamente para falar conosco.
      </p>
    </div>
  </div>

  <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
    <p>© ${new Date().getFullYear()} Quilombus Network - Todos os direitos reservados</p>
    <p style="margin-top: 5px;">São Paulo, Brasil</p>
  </div>
</body>
</html>
      `,
      text: `
Olá, ${name}!

Recebemos sua mensagem e agradecemos pelo contato!

✓ SUA MENSAGEM FOI RECEBIDA COM SUCESSO!

Nossa equipe analisará suas informações e retornará em breve.
Normalmente respondemos em até 24 horas úteis.

ENQUANTO ISSO...
Conheça mais sobre nossos serviços:
- Desenvolvimento de Soluções Personalizadas
- Consultoria em Transformação Digital
- Automação e Inteligência Artificial
- Integração de Sistemas

Visite nosso site: ${process.env.FRONTEND_URL}

TEM ALGUMA DÚVIDA URGENTE?
Email: ${process.env.EMAIL_FROM}

Este é um email automático, mas você pode responder diretamente para falar conosco.

© ${new Date().getFullYear()} Quilombus Network - Todos os direitos reservados
São Paulo, Brasil
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Email de confirmação enviado com sucesso:', {
      to: email,
      messageId: info.messageId,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Erro ao enviar email de confirmação:', {
      error: error.message,
      stack: error.stack,
      to: formData.email,
    });
    throw error;
  }
};

/**
 * Processar envio de emails (notificação + confirmação)
 * @param {Object} formData - Dados do formulário de contato
 */
const processContactEmails = async (formData) => {
  try {
    console.log('📨 Processando envio de emails para:', formData.email);

    // Enviar ambos os emails em paralelo
    const [notificationResult, confirmationResult] = await Promise.all([
      sendNotificationEmail(formData),
      sendConfirmationEmail(formData),
    ]);

    console.log('✅ Todos os emails enviados com sucesso!');

    return {
      success: true,
      notification: notificationResult,
      confirmation: confirmationResult,
    };
  } catch (error) {
    console.error('❌ Erro ao processar emails:', error);
    throw error;
  }
};

module.exports = {
  processContactEmails,
  sendNotificationEmail,
  sendConfirmationEmail,
};
