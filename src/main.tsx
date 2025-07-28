// Refatoração completa do main.tsx para robustez, diagnóstico e boas práticas
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from "react-router-dom";

function renderApp() {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    // Diagnóstico explícito se o elemento root não existe
    console.error('Elemento #root não encontrado no index.html!');
    const fallback = document.createElement('div');
    fallback.innerText = 'Erro crítico: elemento #root não encontrado.';
    document.body.appendChild(fallback);
    return;
  }
  try {
    createRoot(rootElement).render(
      <React.StrictMode>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    );
    console.log('App renderizado com sucesso!');
  } catch (e) {
    // Log detalhado do erro
    console.error('ERRO AO INICIAR APP:', e);
    rootElement.innerHTML = '<div style="color:red;font-size:1.2em">Erro crítico ao renderizar o sistema. Veja o console para detalhes.</div>';
  }
}

console.log('INICIANDO SISTEMA EQUIDADE...');
renderApp();
