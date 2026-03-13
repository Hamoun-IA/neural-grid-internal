import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './Css3dApp.tsx';
import './index.css';

// Suppress the THREE.Clock deprecation warning caused by React Three Fiber
const originalWarn = console.warn;
console.warn = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('Clock: This module has been deprecated')) {
    return;
  }
  originalWarn(...args);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
