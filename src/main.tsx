import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

try {
  const saved = localStorage.getItem('summer_dark_mode');
  if (saved && JSON.parse(saved) === true) {
    document.documentElement.classList.add('dark');
  }
} catch {
  // ignore invalid stored value
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
