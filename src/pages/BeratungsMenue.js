import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, FileText, Users } from 'lucide-react';

const BeratungsMenue = () => {
  const navigate = useNavigate();
  const [showNextStep, setShowNextStep] = useState(false);

  const containerBase = "relative z-10 p-10 sm:p-12 rounded-3xl shadow-2xl w-full max-w-xl text-center transition-all duration-300";
  const containerStyle = showNextStep
    ? `${containerBase} bg-[#fef8f6] backdrop-blur-md border border-[#8C3B4A]/20`
    : `${containerBase} bg-white/80 backdrop-blur-lg`;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center text-[#4B2E2B] px-4 relative"
      style={{ backgroundImage: "url('/wave-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-[#00000070]" />

      <div className={containerStyle}>
        {/* Logo */}
        <div className="mb-6">
          <img src="/logo.png" alt="JB Finanz Logo" className="h-32 mx-auto" />
        </div>

        {/* Titel */}
        <h1 className="text-2xl sm:text-3xl font-bold text-[#8C3B4A] mb-8">
          {showNextStep ? 'Abschluss der Beratung' : 'Wählen Sie Ihre nächste Aktion'}
        </h1>

        {/* Button Groups */}
        <AnimatePresence mode="wait">
          {!showNextStep ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-5"
            >
              <button
                onClick={() => navigate('/vertrag-erfassen')}
                className="w-full flex items-center justify-center gap-2 p-4 bg-[#4B2E2B] text-white text-lg rounded-xl shadow-md hover:bg-[#3a221f] transition"
              >
                <FileText className="w-5 h-5" /> Mandat Aufnehmen
              </button>

              <button
                onClick={() => navigate('/empfehlung')}
                className="w-full flex items-center justify-center gap-2 p-4 bg-[#8C3B4A] text-white text-lg rounded-xl shadow-md hover:bg-[#722f3a] transition"
              >
                <Users className="w-5 h-5" /> Empfehlungen erfassen
              </button>

              <button
                onClick={() => setShowNextStep(true)}
                className="w-full flex items-center justify-center gap-2 p-4 bg-white border border-gray-300 text-[#4B2E2B] text-lg rounded-xl shadow hover:bg-gray-100 transition"
              >
                Weiter <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-5"
            >
              <button
                onClick={() => navigate('/analyse-abschliessen')}
                className="w-full p-4 bg-[#4B2E2B] text-white text-lg rounded-xl shadow-md hover:bg-[#3a221f] transition"
              >
                Analyse abschließen
              </button>

              <button
                onClick={() => navigate('/beratung-abschliessen')}
                className="w-full p-4 bg-[#8C3B4A] text-white text-lg rounded-xl shadow-md hover:bg-[#722f3a] transition"
              >
                Beratung abschließen
              </button>

              <button
                onClick={() => setShowNextStep(false)}
                className="w-full flex items-center justify-center gap-2 p-4 bg-white border border-gray-300 text-[#4B2E2B] text-lg rounded-xl shadow hover:bg-gray-100 transition"
              >
                <ArrowLeft className="w-5 h-5" /> Zurück
              </button>



            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {!showNextStep && (
  <button
    onClick={() => navigate('/beratung-starten')}
    className="mt-6 fixed bottom-20 left-1/2 -translate-x-1/2 px-6 py-3 bg-white/90 text-[#4B2E2B] border border-[#4B2E2B] rounded-xl text-sm font-medium shadow-md hover:bg-white"
  >
    Zurück zur Startseite
  </button>
)}

<footer className="absolute bottom-4 text-center text-xs text-white bg-transparent z-10">
  <p>© 2025 JB Finanz AG. Alle Rechte vorbehalten.</p>
</footer>


      {/* Footer */}
      <footer className="absolute bottom-4 text-center text-xs text-white bg-transparent z-10">
        <p>© 2025 JB Finanz AG. Alle Rechte vorbehalten.</p>
      </footer>
    </div>
  );
};

export default BeratungsMenue;
