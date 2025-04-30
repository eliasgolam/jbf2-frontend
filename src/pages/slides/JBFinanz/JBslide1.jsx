import React, { useEffect, useState, useCallback } from 'react';
import { ReactComponent as SlideSVG } from './JBslide1.svg';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const beraterName = localStorage.getItem('beraterName') || 'Max Muster';
const profilbild = '/default-profile.png';

const JBslide1 = () => {
  const [step, setStep] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const navigate = useNavigate();

  const maxSteps = 7;
  const groupIDs = Array.from({ length: maxSteps }, (_, i) => `Gruppe${i + 1}`);

  const nextStep = useCallback(() => {
    setStep((prev) => (prev < maxSteps ? prev + 1 : prev));
  }, []);

  const prevStep = useCallback(() => {
    setStep((prev) => (prev > 1 ? prev - 1 : prev));
  }, []);

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'ArrowRight') nextStep();
    else if (event.key === 'ArrowLeft') prevStep();
    else if (event.key === 'Escape') setIsZoomed(false);
  }, [nextStep, prevStep]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    groupIDs.forEach((id, index) => {
      const el = document.getElementById(id);
      if (el) {
        el.style.opacity = index < step ? '1' : '0';
        el.style.transition = 'opacity 0.6s ease';
      }
    });
  }, [step]);

  useEffect(() => {
    document.body.style.overflow = isZoomed ? 'hidden' : '';
  }, [isZoomed]);

  return (
    <div className="flex flex-col min-h-screen justify-between bg-cover bg-center text-[#4B2E2B]" style={{ backgroundImage: "url('/wave-bg.jpg')" }}>
      
      {/* Header (ausgeblendet im Zoom-Modus) */}
      {!isZoomed && (
  <header className="relative z-10 bg-gradient-to-b from-white via-white/90 to-transparent">
    <div
      className="h-[160px] flex items-center justify-end"
      style={{ transform: 'translateY(30%)' }}
    >
      <div className="w-full max-w-7xl mx-auto px-6 flex justify-end">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/beratung-starten')} className="hover:opacity-80">
            <img src="/türe.png" alt="Türe Icon" className="h-10 w-10" />
          </button>
          <img src="/logotools.png" alt="Logo" className="h-[250px] object-contain max-w-[240px] mt-[35px]" />
        </div>
      </div>
    </div>
  </header>
)}
   {!isZoomed && (
  <div className="absolute top-[115px] left-1/2 transform -translate-x-1/2 z-[60] w-full px-4 pointer-events-none">
    <div className="max-w-7xl mx-auto flex justify-center">
      <div className="bg-[#8C3B4A]/95 px-10 py-2 rounded-xl shadow-lg backdrop-blur-md border border-white/20">
        <h1 className="text-white text-[22px] sm:text-[24px] font-semibold tracking-widest uppercase">
          Unsere Dienstleistung
        </h1>
      </div>
    </div>
  </div>
)}

      {/* Hauptbereich / Container */}
      <main className="flex justify-center items-center px-4">
        <div className={`transition-all duration-500 ${isZoomed 
          ? 'fixed inset-0 z-[100] bg-white rounded-none max-w-none h-full mt-0' 
          : 'relative w-full max-w-7xl min-h-[65vh] mt-6 rounded-[2rem] bg-white/60'
        } backdrop-blur-md shadow-xl border-2 border-[#4B2E2B] overflow-visible`}>


{isZoomed && (
  <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-[80]">
    <div className="bg-[#8C3B4A] text-white px-8 py-2 rounded-xl shadow-md">
      <h1 className="text-[20px] sm:text-[22px] font-semibold tracking-wider uppercase">
        Unsere Dienstleistung
      </h1>
    </div>
  </div>
)}

          {/* SVG mit Clip in Ecken */}
          <div className="absolute inset-0 overflow-hidden rounded-[2rem]">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="flex items-center justify-center w-full h-full"
            >
              <SlideSVG className="w-full h-full object-contain transition-all duration-300 ease-in-out" />
            </motion.div>
          </div>

          {/* Buttons */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 z-10">
            <button
              onClick={() => navigate('/BeratungsSeite')}
              className="px-6 py-2 bg-white/80 text-[#4B2E2B] rounded-full hover:bg-white shadow-md transition"
            >
              Zurück
            </button>

            <button
              onClick={() => navigate('/JBslide2')}
              className="px-6 py-2 bg-white/80 text-[#4B2E2B] rounded-full hover:bg-white shadow-md transition"
            >
              Überspringen
            </button>

            <button
              onClick={() => {
                if (step < maxSteps) {
                  setStep(step + 1);
                } else {
                  navigate('/JBslide2');
                }
              }}
              className="px-6 py-2 bg-[#8C3B4A] text-white rounded-full hover:bg-[#722f3a] transition shadow-md"
            >
              Weiter
            </button>

            <button
              onClick={() => setIsZoomed(z => !z)}
              title={isZoomed ? 'Zurücksetzen' : 'Vergrößern'}
              className="px-4 py-2 bg-white text-[#4B2E2B] rounded-full hover:bg-gray-100 shadow-lg transition relative z-50"
            >
              {isZoomed ? '🗕' : '⛶'}
            </button>
          </div>
        </div>
      </main>

      {/* Footer nur im normalen Modus */}
      {!isZoomed && (
        <footer className="py-6 text-center text-xs text-[#4B2E2B] bg-transparent">
          © 2025 JB Finanz AG. Alle Rechte vorbehalten.
        </footer>
      )}
    </div>
  );
};

export default JBslide1;
