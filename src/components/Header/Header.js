// src/components/Header/Header.js
import React from 'react';
import styles from './Header.module.css';

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <h1>QUILOMBUS NETWORK</h1>
                </div>

                <nav className={styles.nav}>
                    <ul className={styles.navList}>
                        <li><a href="#hero" className={styles.navLink}>Home</a></li>
                        <li><a href="#what-we-do" className={styles.navLink}>Serviços</a></li>
                        <li><a href="#projects" className={styles.navLink}>Projetos</a></li>
                        <li><a href="#contact" className={styles.navLink}>Contato</a></li>
                    </ul>
                </nav>

                <button className={styles.ctaButton}>
                    Fale Conosco
                </button>

                {/* Mobile Menu Toggle */}
                <button className={styles.mobileMenuToggle} aria-label="Menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </header>
    );
};

export default Header;
