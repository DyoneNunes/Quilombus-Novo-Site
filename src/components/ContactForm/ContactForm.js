// src/components/ContactForm/ContactForm.js
import React, { useState } from 'react';
import styles from './ContactForm.module.css';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        phone: '',
        message: ''
    });

    const [status, setStatus] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpar mensagens de erro ao digitar
        if (errorMessage) setErrorMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setStatus('sending');
        setErrorMessage('');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setStatus('success');

                // Reset form
                setFormData({
                    name: '',
                    email: '',
                    company: '',
                    phone: '',
                    message: ''
                });

                // Clear success message after 5 seconds
                setTimeout(() => setStatus(''), 5000);
            } else {
                // Tratar erros específicos
                setStatus('error');

                if (data.code === 'RATE_LIMIT_EXCEEDED') {
                    setErrorMessage('Muitas tentativas de envio. Por favor, aguarde alguns minutos.');
                } else if (data.code === 'VALIDATION_ERROR') {
                    const errorFields = data.details?.map(d => d.message).join(', ') || 'Verifique os dados preenchidos';
                    setErrorMessage(`Erro de validação: ${errorFields}`);
                } else {
                    setErrorMessage(data.error || 'Erro ao enviar mensagem. Tente novamente.');
                }

                // Clear error message after 8 seconds
                setTimeout(() => {
                    setStatus('');
                    setErrorMessage('');
                }, 8000);
            }
        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
            setStatus('error');
            setErrorMessage('Erro de conexão. Verifique sua internet e tente novamente.');

            // Clear error message after 8 seconds
            setTimeout(() => {
                setStatus('');
                setErrorMessage('');
            }, 8000);
        }
    };

    return (
        <section id="contact" className={styles.section}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.infoBlock}>
                        <h2 className={styles.title}>
                            VAMOS <span className={styles.highlight}>CONVERSAR?</span>
                        </h2>
                        <p className={styles.description}>
                            Estamos prontos para transformar suas ideias em soluções reais.
                            Entre em contato e descubra como podemos acelerar a inovação na sua empresa.
                        </p>

                        <div className={styles.contactInfo}>
                            <div className={styles.contactItem}>
                                <span className={styles.icon}>📧</span>
                                <div>
                                    <h4>Email</h4>
                                    <p>andre.nicacio@quilombusnetwork.com</p>
                                    <p>roberto.moura@quilombusnetwork.com</p>
                                </div>
                            </div>

                            <div className={styles.contactItem}>
                                <span className={styles.icon}>📱</span>
                                <div>
                                    <h4>Telefone</h4>
                                    <p>+55 (16) 98178-8655</p>
                                </div>
                            </div>

                            <div className={styles.contactItem}>
                                <span className={styles.icon}>📍</span>
                                <div>
                                    <h4>Localização</h4>
                                    <p>São Paulo, Brasil</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.formBlock}>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor="name" className={styles.label}>Nome *</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className={styles.input}
                                    placeholder="Seu nome completo"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="email" className={styles.label}>Email *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className={styles.input}
                                    placeholder="seu@email.com"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="company" className={styles.label}>Empresa</label>
                                <input
                                    type="text"
                                    id="company"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    className={styles.input}
                                    placeholder="Nome da sua empresa"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="phone" className={styles.label}>Telefone</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={styles.input}
                                    placeholder="(11) 99999-9999"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="message" className={styles.label}>Mensagem *</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="5"
                                    className={styles.textarea}
                                    placeholder="Conte-nos sobre seu projeto ou desafio..."
                                />
                            </div>

                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={status === 'sending'}
                            >
                                {status === 'sending' ? 'Enviando...' : 'Enviar Mensagem'}
                            </button>

                            {status === 'success' && (
                                <div className={styles.successMessage}>
                                    ✓ Mensagem enviada com sucesso! Entraremos em contato em breve.
                                </div>
                            )}

                            {status === 'error' && errorMessage && (
                                <div className={styles.errorMessage}>
                                    ✗ {errorMessage}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>

            <footer className={styles.footer}>
                <p>© 2025 Quilombus Network. Todos os direitos reservados.</p>
            </footer>
        </section>
    );
};

export default ContactForm;
