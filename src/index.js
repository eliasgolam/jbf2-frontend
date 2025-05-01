import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'; // ✅ neu
import App from './App';
import './index.css';

// 🔑 Deine Google Client-ID hier einfügen
const clientId = '266823257683-dvl5f8ml58olao574kdhk8mccfdsvg60.apps.googleusercontent.com';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId={clientId}>
    <HashRouter>
      <App />
    </HashRouter>
  </GoogleOAuthProvider>
);

function scaleApp() {
  const scaleX = window.innerWidth / 1720;
  const scaleY = window.innerHeight / 1440;
  const scale = Math.min(scaleX, scaleY);
  const wrapper = document.getElementById('app-wrapper');
  if (wrapper) {
    wrapper.style.transform = `scale(${scale})`;
  }
}

window.addEventListener('resize', scaleApp);
window.addEventListener('load', scaleApp);

