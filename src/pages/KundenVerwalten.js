import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from './config';

function KundenVerwalten() {
  const navigate = useNavigate();
  const [suchbegriff, setSuchbegriff] = useState('');
  const [kunden, setKunden] = useState([]);
  const [gefilterteKunden, setGefilterteKunden] = useState([]);

  useEffect(() => {
    const fetchKunden = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!user) {
          console.error('❌ Kein Benutzer eingeloggt.');
          return;
        }
  
        const res = await fetch(`${API_BASE}/api/kunden/${user.email}`);
        if (!res.ok) throw new Error('Fehler beim Laden der Kunden.');
  
        const kundenVomBackend = await res.json();
        setKunden(kundenVomBackend);
        setGefilterteKunden(kundenVomBackend);
      } catch (error) {
        console.error('❌ Fehler beim Abrufen der Kunden:', error);
      }
    };
  
    fetchKunden();
  }, []);
  

  const sucheKunden = (e) => {
    const begriff = e.target.value;
    setSuchbegriff(begriff);
    setGefilterteKunden(
      kunden.filter((kunde) =>
        `${kunde.vorname} ${kunde.nachname}`
          .toLowerCase()
          .includes(begriff.toLowerCase())
      )
    );
  };

  const waehleKunde = (kunde) => {
    localStorage.setItem('ausgewaehlterKunde', JSON.stringify(kunde));
    navigate('/beratung-starten');
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

      {/* HEADER: Logo zentriert */}
      <header className="relative z-10 flex items-center justify-center px-6 py-6">
        <img
          src="/logo.svg"
          alt="JB Finanz Logo"
          className="h-[400px] object-contain"
        />
      </header>

      {/* MAIN CONTENT: Weniger vertikaler Abstand oben => Suchleiste sitzt höher */}
      <main className="relative z-10 flex-grow flex flex-col items-center px-4 pb-10">
        {/* Glas-Container */}
        <div className="
          w-full
          max-w-2xl
          bg-white/15
          backdrop-blur-md
          border border-white/20
          rounded-2xl
          shadow-xl
          p-8
          mt-2
        ">
          {/* Titel */}
          <h2 className="
            text-3xl
            sm:text-4xl
            font-playfair
            font-bold
            text-[#4B2E2B]
            mb-4
            text-center
          ">
            📁 Kunden verwalten
          </h2>

          {/* Suchleiste (weiter oben: geringere mb) */}
          <input
            type="text"
            placeholder="Kunden suchen..."
            value={suchbegriff}
            onChange={sucheKunden}
            className="
              w-full
              px-4
              py-3
              rounded-full
              border border-gray-300
              shadow-sm
              focus:outline-none
              focus:ring-2
              focus:ring-[#8C3B4A]
              transition
              mb-4
            "
          />

          {/* Kundenliste */}
          <div className="max-h-72 overflow-auto space-y-3 mb-4">
            {gefilterteKunden.length === 0 ? (
              <p className="text-[#7E6B64] text-center">
                Keine Kunden gefunden.
              </p>
            ) : (
              gefilterteKunden.map((kunde, index) => (
                <div
                  key={index}
                  onClick={() => waehleKunde(kunde)}
                  className="
                    cursor-pointer
                    bg-white/10
                    border border-white/20
                    shadow
                    rounded-lg
                    px-4
                    py-3
                    flex
                    items-center
                    justify-between
                    hover:bg-white/20
                    hover:scale-[1.01]
                    transition
                  "
                >
                  <span className="text-[#4B2E2B] font-semibold">
                    {kunde.vorname} {kunde.nachname}
                  </span>
                  <span className="text-[#4B2E2B] text-lg">➜</span>
                </div>
              ))
            )}
          </div>

          {/* Zurück-Button */}
          <button
            type="button"
            onClick={() => navigate("/BeraterDashboard")}
            className="
              text-sm
              text-[#4B2E2B]
              border
              border-[#4B2E2B]
              rounded-full
              px-6
              py-2
              font-medium
              transition
              hover:bg-[#4B2E2B]
              hover:text-white
              duration-300
            "
          >
            ← Zurück zum Dashboard
          </button>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="
        relative
        z-10
        flex
        justify-center
        items-center
        py-6
        bg-white/10
        backdrop-blur-sm
      ">
        <p className="text-xs text-gray-700 tracking-wide">
          © 2025 JB Finanz AG. Alle Rechte vorbehalten.
        </p>
      </footer>
    </div>
  );
}

export default KundenVerwalten;
