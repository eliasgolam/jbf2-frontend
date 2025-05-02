import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as VermoegenSVG } from './vermoegen.svg';
import { motion } from 'framer-motion';

const slideData = [
  {
    title: 'Der Weg des Geldes',
    SVG: VermoegenSVG,
    containerText: '',
    steps: [
      ['Gruppe1'], ['Gruppe2'], ['Gruppe3'], ['Gruppe4'], ['Gruppe5'],
      ['Gruppe6'], ['Gruppe7'], ['Gruppe8'], ['Gruppe9']
    ],
    allIDs: [
      'Gruppe1', 'Gruppe2', 'Gruppe3', 'Gruppe4', 'Gruppe5',
      'Gruppe6', 'Gruppe7', 'Gruppe8', 'Gruppe9'
    ]
  }
];

const VermoegenSlide1 = () => {
  const [step, setStep] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const navigate = useNavigate();
  const currentSlide = slideData[0];
  const { SVG, title, containerText } = currentSlide;
  

 


  const nextStep = () => {
    if (step < currentSlide.steps.length - 1) {
      setStep(prev => prev + 1);
    } else {
      navigate('/beratung-starten');
    }
  };

  const prevStep = () => {
    if (step === 0) {
      navigate('/tools/vermoegen/vermoegen'); 
   
    } else {
      setStep(prev => prev - 1);
    }
  };
  

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
    const visible = new Set();
    for (let i = 0; i <= step; i++) {
      currentSlide.steps[i]?.forEach(id => visible.add(id));
    }
    currentSlide.allIDs.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.style.opacity = visible.has(id) ? '1' : '0';
        el.style.transition = 'opacity 0.5s ease';
      }
    });
  }, [step, currentSlide]);

  useEffect(() => {
    document.body.style.overflow = isZoomed ? 'hidden' : '';
  }, [isZoomed]);



  return (
    <div className="flex flex-col min-h-screen justify-between bg-cover bg-center text-[#4B2E2B]" style={{ backgroundImage: "url('/wave-bg.jpg')" }}>
      <header className="relative z-10 bg-gradient-to-b from-white via-white/90 to-transparent">
        <div className="h-[160px] flex items-center justify-end" style={{ transform: 'translateY(30%)' }}>
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

      <div className="absolute top-[92px] left-1/2 transform -translate-x-1/2 z-[120] w-full px-4 pointer-events-none">
        <div className="max-w-7xl mx-auto flex justify-center">
          <div className="bg-[#8C3B4A]/95 px-10 py-2 rounded-xl shadow-lg backdrop-blur-md border border-white/20 pointer-events-auto">
            <h1 className="text-white text-[22px] sm:text-[24px] font-semibold tracking-widest uppercase text-center">
              {title}
            </h1>
          </div>
        </div>

        {containerText && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
            className="text-center text-base text-[#4B2E2B] font-medium pt-[240px] px-6 max-w-[90%] mx-auto"
          >
            {containerText}
          </motion.div>
        )}
      </div>

      <main className="flex justify-center items-center px-4">
        <div className={`transition-all duration-500 ${isZoomed ? 'fixed inset-0 z-[100] bg-white rounded-none max-w-none h-full mt-0' : 'relative w-full max-w-7xl min-h-[65vh] mt-6 rounded-[2rem] bg-white/60'} backdrop-blur-md shadow-xl border-2 border-[#4B2E2B] overflow-visible`}>
          <div className="absolute inset-0 overflow-hidden rounded-[2rem]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="flex items-center justify-center w-full h-full"
            >
<div className="w-full h-full px-4 max-w-6xl flex flex-col items-center justify-center">
  <SVG className={`${isZoomed ? 'w-[85%] max-h-[80vh]' : 'w-[80%] max-h-[55vh]'} h-auto mx-auto my-auto object-contain transition-all duration-300 ease-in-out`} />
</div>



            </motion.div>
          </div>

          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 z-10">
            <button onClick={prevStep} className="px-6 py-2 bg-white/80 text-[#4B2E2B] rounded-full hover:bg-white shadow-md transition">
              Zurück
            </button>
            <button onClick={nextStep} className={`px-6 py-2 rounded-full transition shadow-md ${step >= currentSlide.steps.length - 1 ? 'bg-[#4B2E2B] text-white hover:bg-[#3a2321]' : 'bg-[#8C3B4A] text-white hover:bg-[#722f3a]'}`}>
              {step >= currentSlide.steps.length - 1 ? 'Zurück zur Beratung' : 'Weiter'}
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

      <footer className="py-6 text-center text-xs text-[#4B2E2B] bg-transparent">
        © 2025 JB Finanz AG. Alle Rechte vorbehalten.
      </footer>
    </div>
  );
};

export default VermoegenSlide1;
