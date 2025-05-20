import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { ItemsProvider } from './context/ItemsContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ItemsProvider>
          <App />
        </ItemsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);