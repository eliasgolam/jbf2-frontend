import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'react-lottie-player';
import handshakeAnimation from '../assets/handshake.json';

function BeraterAuswahl() {
  const navigate = useNavigate();

  // Fade-In
  const [fadeIn, setFadeIn] = useState(false);

  // Vorname aus localStorage
  const [firstName, setFirstName] = useState('');
  // Dashboard anzeigen?
  const [showDashboard, setShowDashboard] = useState(false);
  const [showAdminPopup, setShowAdminPopup] = useState(false);
const [adminPassword, setAdminPassword] = useState('');
const [showTools, setShowTools] = useState(false);
const [showProtokolle, setShowProtokolle] = useState(false);


const handleAdminLogin = () => {
  if (adminPassword === 'JBAdmin2025!') {
    navigate('/admin-dashboard');
  } else {
    alert('Falsches Passwort');
  }
};

  // Simulierter Route für den zuletzt bearbeiteten Kunden
  // (Später DB-Anbindung)
  useEffect(() => {
    // Nur Beispiel: "Zuletzt bearbeiteter Kunde" -> "/beratungsseite"
    // Du kannst das in Zukunft anpassen
    localStorage.setItem('lastCustomerRoute', '/beratungsseite');

    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed.email) {
        const vorname = parsed.email.split('@')[0].split('.')[0];
        const capitalized = vorname.charAt(0).toUpperCase() + vorname.slice(1);
        setFirstName(capitalized);
      }
    }
    

    // Fade-In nach 100ms
    const timer = setTimeout(() => setFadeIn(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const greetingText = firstName
    ? `Willkommen zurück, ${firstName}!`
    : 'Willkommen zurück!';

  // Button -> Weiterleitung /BeraterDashboard
  const handleStartTool = () => {
    navigate('/BeraterDashboard');
  };

  // Dashboard auf/zu
  const handleToggleDashboard = () => {
    setShowDashboard(prev => !prev);
  };

  // Klick auf "Zuletzt bearbeiteter Kunde"
  const handleLastCustomerClick = () => {
    // Hol die Beispiel-Route aus localStorage
    const route = localStorage.getItem('lastCustomerRoute');
    // Falls nichts drin ist, nimm z. B. /beratungsseite
    navigate(route || '/beratungsseite');
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col font-sans">
      {/* Hintergrundbild */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url("/wave-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#F8F5F2]/40" />

      <main
        className={`
          relative z-10 flex-grow flex flex-col items-center justify-center
          px-4 py-10
          transition-all duration-700 ease-out
          ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
        `}
      >
        {/* Logo – sehr groß (500px) */}
        <img
          src="/logo.svg"
          alt="JB Finanz Logo"
          className="h-[500px] object-contain mb-8"
        />

        {/* Container: breiter, mittig, "mx-auto" sorgt für Zentrierung */}
        <div className="
          w-full
          max-w-3xl
          mx-auto
          bg-white/15
          backdrop-blur-md
          border border-white/20
          rounded-2xl
          shadow-xl
          p-10
          text-center
        ">
          <h1 className="
            text-5xl
            sm:text-6xl
            font-playfair
            font-bold
            text-[#4B2E2B]
            mb-6
            tracking-tight
          ">
            {greetingText}
          </h1>

          {/* Slogan / Intro */}
          <p className="
            font-sans
            text-[#7E6B64]
            text-lg
            sm:text-xl
            leading-relaxed
            max-w-2xl
            mx-auto
            mb-8
          ">
            „Willkommen in deinem persönlichen Beraterbereich – 
             unser Tool unterstützt dich Schritt für Schritt auf dem Weg 
             zu einer vertrauensvollen und erfolgreichen Kundenberatung.“
          </p>

          {/* Buttons nebeneinander */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            {/* Button -> Beratungstool */}
            <button
              onClick={handleStartTool}
              className="
                bg-[#8C3B4A]
                text-white
                hover:bg-[#7A3340]
                hover:scale-105
                transition-transform
                px-6
                py-3
                rounded-full
                font-semibold
                shadow
                duration-300
                text-lg
              "
            >
              Beratungstool starten
            </button>

            {/* Button -> Dashboard Toggle */}
            <button
              onClick={handleToggleDashboard}
              className="
                text-[#4B2E2B]
                border
                border-[#4B2E2B]
                rounded-full
                px-6
                py-3
                font-semibold
                transition
                hover:bg-[#4B2E2B]
                hover:text-white
                duration-300
                text-lg
              "
            >
              {showDashboard ? 'Dashboard schließen' : 'Dashboard öffnen'}
            </button>

            <div className="flex flex-col justify-between ml-2 gap-2">
  <button
    onClick={() => setShowAdminPopup(true)}
    className="flex items-center gap-2 bg-white/70 backdrop-blur-sm text-[#4B2E2B] border border-[#4B2E2B] hover:bg-white transition px-4 py-2 rounded-xl text-sm font-medium shadow-sm"
  >
    <img
      src="/schlussel.png"
      alt="Admin Icon"
      className="w-4 h-4 object-contain"
    />
    Admin-Bereich öffnen
  </button>
  <button
    onClick={() => alert('Zugang Innendienst kommt bald!')}
    className="flex items-center gap-2 bg-white/70 backdrop-blur-sm text-[#4B2E2B] border border-[#4B2E2B] hover:bg-white transition px-4 py-2 rounded-xl text-sm font-medium shadow-sm"
  >
    <img
      src="/ordner.png"
      alt="Ordner Icon"
      className="w-4 h-4 object-contain"
    />
    Innendienst-Portal starten
  </button>
</div>



          </div>

          {showDashboard && (
  <div className="mt-4 text-left space-y-6">

    {/* Tools & Rechner Section */}
    <div className="border border-white/20 rounded-lg p-4 bg-white/10">
      <button
        onClick={() => setShowTools(prev => !prev)}
        className="text-lg font-semibold text-[#4B2E2B] mb-2 underline"
      >
        Rechner & Tools
      </button>
      {showTools && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <button onClick={() => navigate('/sparrechner')} className="bg-[#8C3B4A] text-white px-4 py-3 rounded-lg font-medium shadow hover:bg-[#7A3340]">
            Sparrechner
          </button>
          <button onClick={() => navigate('/krankenkassenvergleich')} className="bg-[#8C3B4A] text-white px-4 py-3 rounded-lg font-medium shadow hover:bg-[#7A3340]">
            Krankenkassenvergleich
          </button>
          {/* weitere Tools hier einfügbar */}
        </div>
      )}
    </div>

    {/* Protokolle & Mandate Section */}
    <div className="border border-white/20 rounded-lg p-4 bg-white/10">
      <button
        onClick={() => setShowProtokolle(prev => !prev)}
        className="text-lg font-semibold text-[#4B2E2B] mb-2 underline"
      >
        Protokolle & Mandate
      </button>
      {showProtokolle && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <button onClick={() => navigate('/mandat-auswahl')} className="bg-[#8C3B4A] text-white px-4 py-3 rounded-lg font-medium shadow hover:bg-[#7A3340]">
            Mandat aufnehmen
          </button>
          <button onClick={() => navigate('/empfehlung')} className="bg-[#8C3B4A] text-white px-4 py-3 rounded-lg font-medium shadow hover:bg-[#7A3340]">
            Empfehlungen erfassen
          </button>
          <button onClick={() => navigate('/beratung-abschliessen')} className="bg-[#8C3B4A] text-white px-4 py-3 rounded-lg font-medium shadow hover:bg-[#7A3340]">
            Protokolle
          </button>
        </div>
      )}
    </div>
  </div>
)}

        </div>
      </main>
      {showAdminPopup && (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
    <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-xl text-center">
      <h2 className="text-xl font-semibold mb-4">🔐 Admin-Zugang</h2>
      <input
        type="password"
        placeholder="Admin-Passwort"
        value={adminPassword}
        onChange={(e) => setAdminPassword(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      <button
        onClick={handleAdminLogin}
        className="w-full bg-[#8C3B4A] text-white py-2 rounded hover:bg-[#722f3a]"
      >
        Weiter zum Admin-Dashboard
      </button>
      <button
        onClick={() => setShowAdminPopup(false)}
        className="mt-2 text-sm text-gray-600 underline"
      >
        Abbrechen
      </button>
    </div>
  </div>
)}


      {/* Footer */}
      <footer className="relative z-10 flex justify-center items-center py-8 bg-white/10 backdrop-blur-sm">
        <p className="text-sm text-gray-700 tracking-wide">
          © 2025 JB Finanz AG. Alle Rechte vorbehalten.
        </p>
      </footer>
    </div>
  );
}

export default BeraterAuswahl;
