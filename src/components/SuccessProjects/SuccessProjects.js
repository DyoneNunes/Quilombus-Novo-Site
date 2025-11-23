// src/components/SuccessProjects/SuccessProjects.js
import React from 'react';
import styles from './SuccessProjects.module.css';

// Importar logos dos parceiros
import OracleLogo from '../../assets/images/OracleSB.png';
import CognitivoLogo from '../../assets/images/CognitivoSB.png';
import BiofyLogo from '../../assets/images/BiofySB.png';

const SuccessProjects = () => {
    const projects = [
        {
            title: 'Oracle Cloud Ops',
            client: 'Oracle',
            logo: OracleLogo,
            description: 'Mapeamento, configuração e operações em nuvem (Cloud Ops) da Oracle Station, assegurando segurança, disponibilidade e escalabilidade para soluções corporativas de IA.',
            technologies: ['Oracle Cloud', 'Terraform', 'Kubernetes', 'Security'],
            results: [
                'Alta disponibilidade',
                'Escalabilidade garantida',
                'Segurança corporativa'
            ]
        },
        {
            title: 'Ecossistema de Multiagentes IA',
            client: 'COGNITIVO.AI',
            logo: CognitivoLogo,
            description: 'Liderança técnica em desenvolvimento de ecossistema de multiagentes de IA, para gerenciamento de fábricas, processos e estruturas industriais, utilizando treinamento especializado em linguagem natural com LLMs.',
            technologies: ['Python', 'LLMs', 'Multi-Agent Systems', 'NLP'],
            results: [
                'Automação industrial',
                'Gestão inteligente',
                'Processos otimizados'
            ]
        },
        {
            title: 'Sistema Jurídico Inteligente',
            client: 'BIOFY TECHNOLOGIES',
            logo: BiofyLogo,
            description: 'Sistema jurídico inteligente que reduziu em 30% o tempo operacional de escritórios. Participação no time de infraestrutura de testes da Biofy para projetos de genômica.',
            technologies: ['AI/ML', 'Genomics', 'Cloud Infrastructure', 'Testing'],
            results: [
                '-30% tempo operacional',
                'Infraestrutura genômica',
                'Testes automatizados'
            ]
        }
    ];

    return (
        <section id="projects" className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        PROJETOS DE <span className={styles.highlight}>SUCESSO</span>
                    </h2>
                    <p className={styles.subtitle}>
                        Cases reais de transformação digital com resultados mensuráveis
                    </p>
                </div>

                <div className={styles.projectsGrid}>
                    {projects.map((project, index) => (
                        <div key={index} className={styles.projectCard}>
                            <div className={styles.cardHeader}>
                                <span className={styles.projectNumber}>0{index + 1}</span>
                                <div className={styles.logoWrapper}>
                                    <img
                                        src={project.logo}
                                        alt={`${project.client} logo`}
                                        className={styles.partnerLogo}
                                    />
                                </div>
                            </div>

                            <h3 className={styles.projectTitle}>{project.title}</h3>
                            <p className={styles.projectDescription}>{project.description}</p>

                            <div className={styles.technologies}>
                                {project.technologies.map((tech, idx) => (
                                    <span key={idx} className={styles.techBadge}>{tech}</span>
                                ))}
                            </div>

                            <div className={styles.results}>
                                <h4 className={styles.resultsTitle}>Resultados:</h4>
                                <ul className={styles.resultsList}>
                                    {project.results.map((result, idx) => (
                                        <li key={idx} className={styles.resultItem}>{result}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SuccessProjects;
