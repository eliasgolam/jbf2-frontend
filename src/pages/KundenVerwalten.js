import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../config';

function KundenVerwalten() {
  const navigate = useNavigate();
  const [suchbegriff, setSuchbegriff] = useState('');
  const [kunden, setKunden] = useState([]);
  const [gefilterteKunden, setGefilterteKunden] = useState([]);
  const [aktiverKunde, setAktiverKunde] = useState(null);
const [showModal, setShowModal] = useState(false);


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
                  className="
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
                  <div className="flex items-center gap-4">
                    <span className="text-[#4B2E2B] font-semibold">
                      {kunde.vorname} {kunde.nachname}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <img
                      src="/stift.png"
                      alt="Bearbeiten"
                      className="h-5 w-5 cursor-pointer hover:scale-110 transition"
                      onClick={() => {
                        setAktiverKunde(kunde);
                        setShowModal(true);
                      }}
                    />
                    <span
                      className="text-[#4B2E2B] text-lg cursor-pointer"
                      onClick={() => waehleKunde(kunde)}
                    >
                      ➜
                    </span>
                  </div>
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
      {showModal && aktiverKunde && (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-xl max-w-xl w-full shadow-xl">
      <h2 className="text-xl font-bold mb-4 text-[#4B2E2B]">Kunde bearbeiten</h2>

      <input
        defaultValue={aktiverKunde.vorname}
        placeholder="Vorname"
        className="w-full mb-2 p-2 border rounded"
        onChange={(e) => setAktiverKunde({ ...aktiverKunde, vorname: e.target.value })}
      />
      <input
        defaultValue={aktiverKunde.nachname}
        placeholder="Nachname"
        className="w-full mb-2 p-2 border rounded"
        onChange={(e) => setAktiverKunde({ ...aktiverKunde, nachname: e.target.value })}
      />
      {/* Weitere Felder hier nach gleichem Prinzip wie oben */}

      <div className="flex justify-between mt-4">
        <button
          className="bg-[#8C3B4A] text-white px-4 py-2 rounded"
          onClick={async () => {
            const res = await fetch(`${API_BASE}/api/kunden/${aktiverKunde._id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(aktiverKunde)
            });
            if (res.ok) {
              alert('✅ Kunde aktualisiert');
              setShowModal(false);
              window.location.reload();
            } else {
              alert('❌ Fehler beim Aktualisieren');
            }
          }}
        >
          Speichern
        </button>

        <button
          className="text-red-600 hover:underline"
          onClick={async () => {
            const bestaetigt = window.confirm('Möchten Sie diesen Kunden wirklich löschen?');
            if (!bestaetigt) return;
            await fetch(`${API_BASE}/api/kunden/${aktiverKunde._id}`, {
              method: 'DELETE'
            });
            alert('🗑️ Kunde gelöscht');
            setShowModal(false);
            window.location.reload();
          }}
        >
          🗑️ Löschen
        </button>
      </div>

      <button
        onClick={() => setShowModal(false)}
        className="mt-4 text-sm text-gray-500 underline"
      >
        Abbrechen
      </button>
    </div>
  </div>
)}


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
