import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ShieldCheck, XCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const dokumente = [
  {
    id: 'beratungsprotokoll',
    title: 'Beratungsprotokoll',
    description: 'Übersicht der besprochenen Themen, Empfehlungen und Ihrer Entscheidungen',
    icon: FileText
  },
  {
    id: 'vag45',
    title: 'VAG 45',
    description: 'Informationen über Vermittler, Produkte und allfällige Interessenbindungen vor Vertragsabschluss.',
    icon: ShieldCheck
  },
  {
    id: 'kk-kuendigung',
    title: 'Kündigung Krankenkasse',
    description: 'Schriftliche Beendigung Ihrer aktuellen Krankenkasse gemäss gesetzlichen Fristen.',
    icon: XCircle
  }
];

const ProtokollAuswahl = () => {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();
  const gespeicherterStatus = JSON.parse(localStorage.getItem('protokollStatus')) || {};

  const handleÖffnen = (id) => {
    if (id === 'beratungsprotokoll') {
      navigate('/beratung/start');
    } else if (id === 'kk-kuendigung') {
      navigate('/kuendigung-start');
    } else if (id === 'vag45') {
      // Bei Auswahl von VAG 45 immer zu VAG Start weiterleiten
      localStorage.setItem('autoRedirect', 'true'); 
      navigate('/vag/start');
    } else {
      navigate(`/protokoll/${id}`);
    }
  };
  

  const handleZurueck = () => {
    navigate('/beratungs-menue');
  };

  const handleWeiter = () => {
    navigate('/beratung-fertig');
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center px-4 text-[#4B2E2B] relative"
      style={{ backgroundImage: "url('/wave-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-[#00000070]" />

      <div className="relative z-10 bg-white/90 backdrop-blur-md p-10 sm:p-12 rounded-3xl shadow-2xl w-full max-w-3xl">
        <div className="mb-6 text-center">
          <img src="/Logo.png" alt="JB Finanz Logo" className="h-28 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-[#8C3B4A]">Protokolle auswählen</h1>
          <p className="text-sm text-gray-600 mt-1">Bitte wählen Sie ein Dokument zur abschließenden Bearbeitung.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {dokumente.map(({ id, title, description, icon: Icon }) => {
            const isSelected = selected === id;
            const isCompleted = gespeicherterStatus[id];

            return (
              <motion.div
                key={id}
                onClick={() => setSelected(id)}
                whileHover={{ scale: 1.02 }}
                className={`relative cursor-pointer border rounded-xl p-5 shadow-sm transition-all duration-300 ${
                  isSelected
                    ? 'border-[#8C3B4A] bg-[#fdf6f6]'
                    : isCompleted
                      ? 'border-green-500/50 bg-green-50/60'
                      : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div
                    className={`p-3 rounded-full ${
                      isSelected ? 'bg-[#8C3B4A] text-white' : 'bg-gray-100 text-[#4B2E2B]'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-lg font-semibold">{title}</h2>
                </div>
                <p className="text-sm text-gray-700 leading-snug">{description}</p>

                {isSelected && (
                  <>
                    <CheckCircle2 className="absolute top-4 right-4 text-[#8C3B4A] w-6 h-6" />
                    <button
                      onClick={() => handleÖffnen(id)}
                      className="mt-4 px-4 py-2 bg-white text-[#8C3B4A] border border-[#8C3B4A] rounded-xl text-sm font-medium shadow hover:bg-gray-50"
                    >
                      Öffnen
                    </button>
                  </>
                )}
                {isCompleted && !isSelected && (
                  <CheckCircle2 className="absolute top-4 right-4 text-green-500 w-6 h-6" />
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 flex justify-between items-center">
          <button
            onClick={handleZurueck}
            className="px-6 py-3 rounded-xl text-lg font-semibold shadow transition-all border bg-white/80 text-[#8C3B4A] border-[#8C3B4A] hover:bg-white hover:shadow-md"
          >
            Zurück
          </button>

          <button
            onClick={handleWeiter}
            className="px-6 py-3 bg-[#4B2E2B] text-white rounded-xl text-lg font-semibold shadow hover:bg-[#3a221f]"
          >
            Weiter
          </button>
        </div>
      </div>

      <footer className="absolute bottom-4 text-center text-xs text-white z-10">
        <p>© 2025 JB Finanz AG. Alle Rechte vorbehalten.</p>
      </footer>
    </div>
  );
};

export default ProtokollAuswahl;
