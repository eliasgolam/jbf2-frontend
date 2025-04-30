import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const themen = [
  'Gesundheit',
  'Pension vorsorgen',
  'Lebensstandard beibehalten',
  'Sachversicherungen',
  'Kinder absichern',
  'Vermögen aufbauen',
  'Immobilien'
];

const optionen = [
  'Sofort starten',
  'Beim nächsten Termin',
  'Zu einem späteren Zeitpunkt'
];

const AnalyseAbschliessen = () => {
  const navigate = useNavigate();
  const [ausgewaehlt, setAusgewaehlt] = useState([]);
  const [zeitpunkt, setZeitpunkt] = useState(null);

  const toggleThema = (thema) => {
    setAusgewaehlt((prev) =>
      prev.includes(thema) ? prev.filter((t) => t !== thema) : [...prev, thema]
    );
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center text-[#4B2E2B] px-4 py-12 flex items-center justify-center relative"
      style={{ backgroundImage: "url('/wave-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-[#00000070]" />

      <div className="relative z-10 p-10 sm:p-12 rounded-3xl shadow-2xl w-full max-w-4xl bg-white/80 backdrop-blur-lg">
        <h1 className="text-3xl font-bold text-center text-[#8C3B4A] mb-8">Analyse abschließen</h1>

        <div className="mb-6">
          <h2 className="text-md font-semibold mb-4">Abgeschlossene Themen:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {themen.map((thema) => (
              <label
                key={thema}
                className="flex items-center gap-3 cursor-pointer text-sm font-medium"
              >
<input
  type="checkbox"
  checked={ausgewaehlt.includes(thema)}
  onChange={() => toggleThema(thema)}
  className="w-5 h-5 rounded border-2 border-[#8C3B4A] text-[#8C3B4A] focus:ring-[#8C3B4A] focus:ring-offset-0"
  style={{ accentColor: '#8C3B4A' }} // 💥 entscheidend für modernes CSS
/>


                <span>{thema}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-10">
          <p className="text-sm font-medium mb-3">Wann möchten Sie die offenen Themen besprechen?</p>
          <div className="flex flex-col sm:flex-row gap-4">
            {optionen.map((opt) => (
              <button
                key={opt}
                onClick={() => setZeitpunkt(opt)}
                className={`flex-1 text-center px-4 py-2 rounded border font-semibold shadow-sm transition-all text-sm ${
                  zeitpunkt === opt
                    ? 'bg-[#8C3B4A] text-white border-[#8C3B4A]'
                    : 'bg-white text-[#4B2E2B] border-gray-300 hover:bg-gray-100'
                }`}
              >
                {opt.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate('/beratung-abschliessen')}
            className="px-6 py-3 bg-white text-[#4B2E2B] border border-[#4B2E2B] rounded-xl text-sm font-medium shadow hover:bg-gray-50"
          >
            Zurück
          </button>

          <button
            onClick={() => alert('Zusammenfassung wird generiert...')}
            className="px-6 py-3 bg-[#4B2E2B] text-white rounded-xl text-sm font-medium shadow hover:bg-[#3a221f]"
          >
            Zusammenfassung generieren
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyseAbschliessen;
