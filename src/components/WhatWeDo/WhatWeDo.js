// src/components/WhatWeDo/WhatWeDo.js
import React from 'react';
import styles from './WhatWeDo.module.css';

// Importar ícones da pasta assets/images
import MLOpsIcon from '../../assets/images/MLOpsIcon.png';
import LLMsIcon from '../../assets/images/LLMsSBg.png';
import CloudIcon from '../../assets/images/ArquitetureCloudIconSbg.png';
import DataEngIcon from '../../assets/images/dataEnggeenerSBg.png';
import AIConsultingIcon from '../../assets/images/AIConsultingSBg.png';
import DevOpsIcon from '../../assets/images/DevopsSBg.png';

const WhatWeDo = () => {
    const services = [
        {
            title: 'MLOps',
            description: 'Implementação de pipelines de Machine Learning em produção com monitoramento, versionamento e automação completa.',
            icon: MLOpsIcon
        },
        {
            title: 'LLMs',
            description: 'Desenvolvimento e integração de Large Language Models customizados para soluções específicas do seu negócio.',
            icon: LLMsIcon
        },
        {
            title: 'Cloud Architecture',
            description: 'Arquitetura cloud escalável e resiliente em AWS, Azure e GCP com foco em performance e custos otimizados.',
            icon: CloudIcon
        },
        {
            title: 'Data Engineering',
            description: 'Construção de data lakes, data warehouses e pipelines ETL/ELT para processamento de grandes volumes de dados.',
            icon: DataEngIcon
        },
        {
            title: 'AI Consulting',
            description: 'Consultoria estratégica em IA para identificar oportunidades e implementar soluções que geram valor real.',
            icon: AIConsultingIcon
        },
        {
            title: 'DevOps',
            description: 'Cultura DevOps com CI/CD, Infrastructure as Code e automação para entregas rápidas e confiáveis.',
            icon: DevOpsIcon
        }
    ];

    return (
        <section id="what-we-do" className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        O QUE <span className={styles.highlight}>FAZEMOS</span>
                    </h2>
                    <p className={styles.subtitle}>
                        Transformamos desafios complexos em soluções inteligentes com tecnologia de ponta
                    </p>
                </div>

                <div className={styles.servicesGrid}>
                    {services.map((service, index) => (
                        <div key={index} className={styles.serviceCard}>
                            <div className={styles.iconWrapper}>
                                <img
                                    src={service.icon}
                                    alt={`${service.title} icon`}
                                    className={styles.icon}
                                />
                            </div>
                            <h3 className={styles.serviceTitle}>{service.title}</h3>
                            <p className={styles.serviceDescription}>{service.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhatWeDo;
