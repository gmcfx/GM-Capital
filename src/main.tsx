import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './contexts/AuthContext'; // ✅ make sure path is correct

// Clear any existing content in the root element
const rootElement = document.getElementById('root');
if (rootElement) {
  rootElement.innerHTML = '';
}

// Create a new root
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <AuthProvider> {/* wrap your app */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
