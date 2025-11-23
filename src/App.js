// src/App.js
import React, { lazy, Suspense } from 'react';
import styles from './styles/Global.module.css';

// Importação imediata apenas do Header e Hero (above the fold)
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';

// Lazy loading dos componentes abaixo da dobra
const WhatWeDo = lazy(() => import('./components/WhatWeDo/WhatWeDo'));
const SuccessProjects = lazy(() => import('./components/SuccessProjects/SuccessProjects'));
const ContactForm = lazy(() => import('./components/ContactForm/ContactForm'));

// Loading fallback simples e leve
const LoadingFallback = () => (
  <div style={{
    minHeight: '50vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6e6e73'
  }}>
    <div>Carregando...</div>
  </div>
);

function App() {
  return (
    <div className={styles.appContainer}>
      <Header />
      <main>
        <Hero />
        <Suspense fallback={<LoadingFallback />}>
          <WhatWeDo />
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
          <SuccessProjects />
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
          <ContactForm />
        </Suspense>
      </main>
    </div>
  );
}

export default App;