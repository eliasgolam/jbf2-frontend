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

  // Simulierter Route für den zuletzt bearbeiteten Kunden
  // (Später DB-Anbindung)
  useEffect(() => {
    // Nur Beispiel: "Zuletzt bearbeiteter Kunde" -> "/beratungsseite"
    // Du kannst das in Zukunft anpassen
    localStorage.setItem('lastCustomerRoute', '/beratungsseite');

    const fullName = localStorage.getItem('beraterName');
    if (fullName) {
      const splitted = fullName.split(' ');
      setFirstName(splitted[0]);
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
          </div>

          {/* Dashboard-Inhalt */}
          {showDashboard && (
            <div className="mt-4 text-left">
              {/* "Zuletzt bearbeiteter Kunde" mit Icon (Lottie) + klickbar */}
              <div className="
                flex 
                flex-col 
                sm:flex-row 
                items-center 
                gap-4 
                border 
                border-white/20 
                rounded-lg 
                p-4 
                mb-6
                bg-white/10
              ">
                <div className="flex-shrink-0">
                  <Lottie
                    loop
                    animationData={handshakeAnimation}
                    play
                    style={{ width: 80, height: 80 }}
                  />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-xl font-playfair text-[#4B2E2B] mb-1">
                    Zuletzt bearbeiteter Kunde:
                  </h2>
                  <p 
                    onClick={handleLastCustomerClick}
                    className="
                      text-[#7E6B64] 
                      mb-2 
                      cursor-pointer 
                      hover:underline
                    "
                    title="Beratungsseite öffnen"
                  >
                    Max Mustermann (Platzhalter – später DB)
                  </p>
                  <small className="text-sm text-gray-500">
                    Klick auf den Kundennamen, um direkt seine Beratungsseite zu öffnen
                  </small>
                </div>
              </div>

              {/* Schnellzugriff-Buttons */}
              <div className="border border-white/20 rounded-lg p-4 bg-white/10">
                <h2 className="text-xl font-playfair text-[#4B2E2B] mb-4">
                  Schnellzugriff
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    onClick={() => navigate('/sparrechner')}
                    className="
                      bg-[#8C3B4A]
                      text-white
                      hover:bg-[#7A3340]
                      px-4
                      py-3
                      rounded-lg
                      font-medium
                      shadow
                      transition
                      duration-300
                    "
                  >
                    Sparrechner
                  </button>
                  <button
                    onClick={() => navigate('/starten-oder-warten')}
                    className="
                      bg-[#8C3B4A]
                      text-white
                      hover:bg-[#7A3340]
                      px-4
                      py-3
                      rounded-lg
                      font-medium
                      shadow
                      transition
                      duration-300
                    "
                  >
                    Starten oder Warten
                  </button>
                  <button
                    onClick={() => navigate('/krankenkassenvergleich')}
                    className="
                      bg-[#8C3B4A]
                      text-white
                      hover:bg-[#7A3340]
                      px-4
                      py-3
                      rounded-lg
                      font-medium
                      shadow
                      transition
                      duration-300
                    "
                  >
                    Krankenkassenvergleich
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

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
