// src/components/Hero/Hero.js
import React from 'react';
import styles from './Hero.module.css'; // CSS Modules para este componente
// Importar a logo se já estiver na pasta assets/images
// import Logo from '../../assets/images/logo-quilombus.png'; 

const Hero = () => {
    return (
        <section className={styles.heroSection}>
            <div className={styles.header}>
                {/* Aqui você pode incluir o componente Header ou a Logo */}
                <h1 className={styles.logo}>QUILOMBUS NETWORK</h1>
            </div>
            
            <div className={styles.content}>
                {/* A imagem abstrata (o splash roxo/prateado) deve ser um background ou um elemento flutuante */}
                <div className={styles.abstractImage}>
                    {/*  */}
                </div>

                <div className={styles.textBlock}>
                    <p className={styles.smallText}>
                        A **QUILOMBUS NETWORK** UNE MENTES BRILHANTES, TECNOLOGIA DE PONTA E ENGENHARIA QUE ENTREGA RESULTADO.
                    </p>

                    <h2 className={styles.mainTitle}>
                        ACELERE O FUTURO DA <span className={styles.highlight}>IA</span> NA SUA EMPRESA COM NOSSOS ESPECIALISTAS EM 
                        <span className={styles.highlight}> MLOPS, LLMS E CLOUD ARCHITECTURE.</span>
                    </h2>

                    {/* Seta para baixo, indicando scroll */}
                    <div className={styles.scrollIndicator}>
                        {/* Ícone de seta para baixo */}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;