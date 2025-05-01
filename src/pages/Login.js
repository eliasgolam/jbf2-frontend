import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { API_BASE } from '../config';
import { hashNavigate } from '../utils/navigation';

console.log("🔍 API_BASE =", API_BASE);


const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    console.log('🟢 Login-Funktion ausgelöst');
console.log('🔑 Google Credential:', credentialResponse);

    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const email = decoded.email;
      const name = decoded.name;
      const domain = email.split('@')[1];

      const erlaubteDomain = 'jbfinanz.ch';
      

      if (domain !== erlaubteDomain) {
        setError('Nur Nutzer mit @jbfinanz.ch-Adresse erlaubt.');
        return;
      }

      const role = 'mitarbeiter'; 
      const userData = { username: name, email, role };

      console.log('📡 Anfrage wird gesendet an:', `${API_BASE}/api/user`);
console.log('📤 Gesendete Nutzerdaten:', userData);


      // Backend-Aufruf (achte auf http://localhost:5000)
      const res = await fetch(`${API_BASE}/api/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      console.log('🌐 Antwort erhalten, Status:', res.status);


      let savedUser;

      try {
        console.log('⏳ Versuche Antwort als JSON zu lesen...');
        savedUser = await res.json();
        console.log('✅ Benutzer gespeichert:', savedUser);
      } catch (parseError) {
        const raw = await res.text();
        console.error('❌ Fehler beim Parsen der Antwort:', raw);
        throw new Error('Antwort ist kein gültiges JSON');
      }
      
      setUser(savedUser);
localStorage.setItem('loggedInUser', JSON.stringify(savedUser));

      
console.log('🎯 Weiterleitung zu /berater-auswahl');
navigate('/berater-auswahl');

    } catch (err) {
      console.error('❌ Login-Fehler:', err.message || err);
      setError('Login fehlgeschlagen. Bitte Backend prüfen.');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setError('');
    localStorage.removeItem('loggedInUser');
    navigate('/');
  };
  

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-cover bg-center text-[#4B2E2B] px-[4vw]"
      style={{ backgroundImage: "url('/wave-bg.jpg')" }}
    >
      <div className="bg-white/80 backdrop-blur-lg p-[2vw] rounded-3xl shadow-2xl w-[90vw] max-w-[800px] text-center">
      <img src="/Logo.png" alt="JB Finanz Logo" className="h-[20vh] mx-auto mb-[2vh]" />

        {user ? (
          <>
            <h1 className="text-[2vw] font-semibold mb-[1vh]">Eingeloggt als</h1>
            <p className="mb-[1vh] text-[1.5vw]">{user.username}</p>
            <p className="mb-[1vh] text-[1vw] text-gray-600">{user.email}</p>
            <p className="mb-[2vh] text-[1vw]">Rolle: <strong>{user.role}</strong></p>
            <button
  onClick={handleLogout}
  className="w-full p-[1.2vh] bg-[#8C3B4A] text-white rounded-xl hover:bg-[#722f3a] transition"
>
  Logout
</button>

<button
  onClick={() => navigate('/admin-auswahl')}
  className="w-full mt-[1vh] p-[1.2vh] bg-[#4B2E2B] text-white rounded-xl hover:bg-[#3b241f] transition"
>
  Zur Auswahl
</button>


          </>
        ) : (
          <>
            <h1 className="text-[2.5vw] font-bold mb-[1vh]">Willkommen bei JB Finanz</h1>
            <p className="mb-[2vh] text-[1.2vw]">Bitte melde dich mit deinem Geschäfts-Google-Konto an</p>


            <div className="flex justify-center mb-[2vh]">
            <GoogleLogin
  onSuccess={(credentialResponse) => {
    console.log('✅ GoogleLogin onSuccess ausgelöst');
    console.log('🔐 credentialResponse:', credentialResponse);
    handleGoogleLoginSuccess(credentialResponse);
  }}
  onError={() => {
    console.error('❌ Google Login fehlgeschlagen (onError)');
    setError('Google Login fehlgeschlagen.');
  }}
  useOneTap={false}
  text="signin_with"
  shape="pill"
  theme="filled_black"
/>


            </div>

            {error && <p className="mt-[2vh] text-red-600 text-[0.9vw]">{error}</p>}
          </>
        )}

<p className="mt-[2vh] text-[0.8vw] text-gray-500">© 2025 JB Finanz AG. Alle Rechte vorbehalten.</p>

      </div>
    </div>
  );
};

export default Login;
