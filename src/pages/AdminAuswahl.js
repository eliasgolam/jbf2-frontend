import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminAuswahl = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('loggedInUser'));

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/'); // Nur Admins erlaubt
    }
  }, [user, navigate]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center text-[#4B2E2B]"
      style={{ backgroundImage: "url('/wave-bg.jpg')" }}
    >
      <div className="bg-white/80 backdrop-blur-lg p-10 rounded-3xl shadow-2xl max-w-md w-full text-center">

        <img src="/Logo.png" alt="JB Finanz Logo" className="h-80 mx-auto mb-6" />

        <h1 className="text-2xl font-bold mb-2">Hallo, {user?.username}</h1>
        <p className="text-sm mb-8">Was möchtest du als Nächstes tun?</p>

        <button
          onClick={() => navigate('/admin-dashboard')}
          className="w-full mb-4 py-3 px-6 bg-[#8C3B4A] text-white rounded-xl text-base font-semibold hover:bg-[#722f3a] transition"
        >
          Admin-Dashboard öffnen
        </button>

        <button
          onClick={() => navigate('/berater-auswahl')}
          className="w-full py-3 px-6 bg-[#4B2E2B] text-white rounded-xl text-base font-semibold hover:bg-[#3a221f] transition"
        >
          Zurück zur Beraterauswahl
        </button>
      </div>
    </div>
  );
};

export default AdminAuswahl;
