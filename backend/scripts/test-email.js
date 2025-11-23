require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const nodemailer = require('nodemailer');

/**
 * Script de Teste de Email
 * Verifica se as configurações SMTP estão corretas e envia um email de teste
 */

async function testEmail() {
  console.log('\n' + '='.repeat(60));
  console.log('📧 TESTE DE CONFIGURAÇÃO SMTP - QUILOMBUS NETWORK');
  console.log('='.repeat(60) + '\n');

  // Exibir configurações (sem senha)
  console.log('⚙️  Configurações carregadas:');
  console.log(`   Host: ${process.env.SMTP_HOST}`);
  console.log(`   Port: ${process.env.SMTP_PORT}`);
  console.log(`   Secure: ${process.env.SMTP_SECURE}`);
  console.log(`   User: ${process.env.SMTP_USER}`);
  console.log(`   Pass: ${'*'.repeat(process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 0)}`);
  console.log(`   From: ${process.env.EMAIL_FROM} (${process.env.EMAIL_FROM_NAME})`);
  console.log(`   Notification Emails: ${process.env.NOTIFICATION_EMAILS}\n`);

  // Criar transporter
  console.log('🔌 Criando transporter...');
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    // Verificar conexão
    console.log('🔍 Verificando conexão SMTP...');
    await transporter.verify();
    console.log('✅ Conexão SMTP verificada com sucesso!\n');

    // Preparar email de teste
    console.log('📨 Enviando email de teste...');

    const testMailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to: process.env.NOTIFICATION_EMAILS.split(',')[0].trim(), // Envia para o primeiro email da lista
      subject: '✅ Teste de Email - Sistema Quilombus',
      html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Teste de Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">✅ Teste de Email</h1>
    <p style="color: #f0f0f0; margin: 10px 0 0 0;">Sistema Quilombus Network</p>
  </div>

  <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <h2 style="color: #667eea; margin-top: 0;">Configuração SMTP Funcionando! 🎉</h2>

    <div style="background: #e8f8f5; border-left: 4px solid #10b981; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0; font-size: 16px; color: #047857;">
        <strong>✓ Sucesso!</strong> Se você recebeu este email, significa que o serviço SMTP está configurado corretamente.
      </p>
    </div>

    <h3 style="color: #333; margin-top: 25px;">📋 Informações do Teste:</h3>

    <div style="background: #f9f9f9; padding: 15px; border-radius: 8px;">
      <p style="margin: 8px 0;"><strong>Servidor:</strong> ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}</p>
      <p style="margin: 8px 0;"><strong>Usuário:</strong> ${process.env.SMTP_USER}</p>
      <p style="margin: 8px 0;"><strong>Remetente:</strong> ${process.env.EMAIL_FROM_NAME} &lt;${process.env.EMAIL_FROM}&gt;</p>
      <p style="margin: 8px 0;"><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</p>
    </div>

    <div style="margin-top: 25px; padding: 20px; background: #fff3cd; border-radius: 8px;">
      <p style="margin: 0; color: #856404;">
        <strong>ℹ️ Próximos Passos:</strong>
      </p>
      <ul style="color: #856404; margin-top: 10px;">
        <li>O sistema de contato está pronto para uso</li>
        <li>Emails serão enviados para: ${process.env.NOTIFICATION_EMAILS}</li>
        <li>Configure o frontend para enviar requisições para a API</li>
      </ul>
    </div>
  </div>

  <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
    <p>© ${new Date().getFullYear()} Quilombus Network</p>
    <p style="margin-top: 5px;">Este é um email de teste do sistema</p>
  </div>
</body>
</html>
      `,
      text: `
TESTE DE EMAIL - QUILOMBUS NETWORK

✓ SUCESSO! Se você recebeu este email, significa que o serviço SMTP está configurado corretamente.

INFORMAÇÕES DO TESTE:
Servidor: ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}
Usuário: ${process.env.SMTP_USER}
Remetente: ${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>
Data/Hora: ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}

PRÓXIMOS PASSOS:
- O sistema de contato está pronto para uso
- Emails serão enviados para: ${process.env.NOTIFICATION_EMAILS}
- Configure o frontend para enviar requisições para a API

© ${new Date().getFullYear()} Quilombus Network
Este é um email de teste do sistema
      `,
    };

    const info = await transporter.sendMail(testMailOptions);

    console.log('✅ Email de teste enviado com sucesso!');
    console.log(`📬 Message ID: ${info.messageId}`);
    console.log(`📧 Destinatário: ${testMailOptions.to}\n`);

    console.log('='.repeat(60));
    console.log('🎉 TESTE CONCLUÍDO COM SUCESSO!');
    console.log('='.repeat(60));
    console.log('\n✓ Verifique a caixa de entrada do email:', testMailOptions.to);
    console.log('✓ Se não encontrar, verifique a pasta de spam/lixo eletrônico\n');

  } catch (error) {
    console.error('\n❌ ERRO NO TESTE:');
    console.error('='.repeat(60));
    console.error(`Tipo: ${error.name}`);
    console.error(`Mensagem: ${error.message}`);

    if (error.code) {
      console.error(`Código: ${error.code}`);
    }

    console.error('\n📚 Possíveis soluções:');

    if (error.message.includes('Invalid login') || error.message.includes('Authentication failed')) {
      console.error('   - Verifique se o SMTP_USER e SMTP_PASS estão corretos');
      console.error('   - Para Gmail, use uma "Senha de App" ao invés da senha normal');
      console.error('   - Acesse: https://myaccount.google.com/apppasswords');
    } else if (error.message.includes('ECONNREFUSED') || error.message.includes('ETIMEDOUT')) {
      console.error('   - Verifique se o SMTP_HOST está correto');
      console.error('   - Verifique se a porta está liberada no firewall');
      console.error('   - Tente alternar entre portas 465 (SSL) e 587 (TLS)');
    } else {
      console.error('   - Revise todas as variáveis no arquivo .env');
      console.error('   - Verifique sua conexão com a internet');
      console.error('   - Consulte a documentação do provedor de email');
    }

    console.error('\n' + '='.repeat(60) + '\n');
    process.exit(1);
  }
}

// Executar teste
testEmail();
