import React, { useEffect, useState, useCallback } from 'react';
import { ReactComponent as Slide1SVG } from './JBslide1.svg';
import { ReactComponent as Slide2SVG } from './JBslide2.svg';
import { ReactComponent as Slide3SVG } from './JBslide3.svg';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const slideData = [
  {
    title: 'Unsere Dienstleistung',
    SVG: Slide1SVG,
    maxSteps: 7,
    startStep: 1,
    groups: ['Gruppe1', 'Gruppe2', 'Gruppe3', 'Gruppe4', 'Gruppe5', 'Gruppe6', 'Gruppe7'],
    intro: null,
  },
  {
    title: 'Der Schweizer Finanzmarkt',
    SVG: Slide2SVG,
    maxSteps: 4,
    startStep: 0,
    groups: ['Gruppe1', 'Gruppe2', 'Gruppe3', 'Gruppe4', 'Gruppe5'],
    intro: 'Ein Auszug aus dem Schweizer Finanzmarkt – über 1400 Finanzdienstleister im Überblick.',
  },
  {
    title: 'Unsere Philosophie',
    SVG: Slide3SVG,
    maxSteps: 5,
    startStep: -1,
    groups: ['Gruppe1', 'Gruppe2', 'Gruppe3', 'Gruppe4', 'Gruppe5'],
    intro: 'Unsere Beratung basiert auf einem strukturierten, klaren und persönlichen Prozess – abgestimmt auf deine Lebenssituation und Ziele.',
  },
];

const JBSlides = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [step, setStep] = useState(slideData[0].startStep);
  const [isZoomed, setIsZoomed] = useState(false);
  const navigate = useNavigate();
  const { title, SVG, maxSteps, groups, intro } = slideData[slideIndex];

  const nextStep = useCallback(() => {
    if (step < maxSteps - 1) {
      setStep(prev => prev + 1);
    } else if (slideIndex < slideData.length - 1) {
      const next = slideData[slideIndex + 1];
      setSlideIndex(prev => prev + 1);
      setStep(next.startStep);
    } else {
      navigate('/beratung-starten');
    }
  }, [step, slideIndex, maxSteps]);

  const prevStep = useCallback(() => {
    if (step > (slideIndex === 2 ? -1 : 0)) {
      setStep(prev => prev - 1);
    } else if (slideIndex > 0) {
      const prev = slideData[slideIndex - 1];
      setSlideIndex(prevIndex => prevIndex - 1);
      setStep(prev.maxSteps - 1);
    } else {
      navigate('/beratung-starten');
    }
  }, [step, slideIndex]);

  const skipSlide = () => {
    if (slideIndex < slideData.length - 1) {
      const next = slideData[slideIndex + 1];
      setSlideIndex(prev => prev + 1);
      setStep(next.startStep);
    } else {
      navigate('/beratung-starten');
    }
  };

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'ArrowRight') {
      nextStep();
    } else if (event.key === 'ArrowLeft') {
      prevStep();
    } else if (event.key === 'Escape') {
      setIsZoomed(false);
    }
  }, [nextStep, prevStep]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  
  
  useEffect(() => {
    groups.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.style.opacity = '0';
        el.style.transition = 'opacity 0.6s ease';
      }
    });
    for (let i = 0; i <= step; i++) {
      const id = groups[i];
      const el = document.getElementById(id);
      if (el) {
        el.style.opacity = '1';
      }
    }
  }, [step, groups]);

  useEffect(() => {
    document.body.style.overflow = isZoomed ? 'hidden' : '';
  }, [isZoomed]);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-white">
      <div className="max-w-[1720px] w-full h-full overflow-auto flex flex-col justify-between bg-cover bg-center text-[#4B2E2B]" style={{ backgroundImage: "url('/wave-bg.jpg')" }}>
  
      {!isZoomed && (
        <header className="relative z-10 bg-gradient-to-b from-white via-white/90 to-transparent">
          <div className="h-32 sm:h-40 flex items-center justify-end transform translate-y-[30%]">
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
        <div className="absolute top-[92px] left-1/2 transform -translate-x-1/2 z-[60] w-full px-4 pointer-events-none">
          <div className="max-w-7xl mx-auto flex justify-center">
            <div className="bg-[#8C3B4A]/95 px-10 py-2 rounded-xl shadow-lg backdrop-blur-md border border-white/20">
              <h1 className="text-white text-[22px] sm:text-[24px] font-semibold tracking-widest uppercase">
                {title}
              </h1>
            </div>
          </div>
        </div>
      )}

      <main className="flex justify-center items-center px-4">
      <div className={`transition-all duration-500 flex flex-col items-center ${isZoomed ? 'fixed inset-0 z-[100] bg-white rounded-none max-w-none h-full mt-0' : 'relative w-full max-w-7xl min-h-[65vh] mt-6 rounded-[2rem] bg-white/60'} backdrop-blur-md shadow-xl border-2 border-[#4B2E2B] overflow-visible`}>

          {isZoomed && (
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-[80]">
              <div className="bg-[#8C3B4A] text-white px-8 py-2 rounded-xl shadow-md">
                <h1 className="text-[20px] sm:text-[22px] font-semibold tracking-wider uppercase">
                  {title}
                </h1>
              </div>
            </div>
          )}

      {/* MOVE DIESEN BLOCK AUSSERHALB des SVG-Bereichs */}
<div className="relative z-20 px-6 pt-10 sm:pt-16 md:pt-20">
  {intro && (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
      className="text-center text-base text-[#4B2E2B] font-medium max-w-4xl mx-auto"
    >
      {intro}
    </motion.div>
  )}
</div>


<div className="relative overflow-hidden rounded-[2rem] z-10">

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full h-full flex justify-center items-center"
            >
              <div className="w-full px-4 max-w-6xl">
              <SVG className="w-full max-h-[65vh] object-contain transition-all duration-300 ease-in-out" />
              </div>
            </motion.div>
          </div>

          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 z-10">
            <button onClick={prevStep} className="px-6 py-2 bg-white/80 text-[#4B2E2B] rounded-full hover:bg-white shadow-md transition">
              Zurück
            </button>
            <button onClick={skipSlide} className="px-6 py-2 bg-white/80 text-[#4B2E2B] rounded-full hover:bg-white shadow-md transition">
              Überspringen
            </button>
            <button onClick={nextStep} className="px-6 py-2 bg-[#8C3B4A] text-white rounded-full hover:bg-[#722f3a] transition shadow-md">
              {slideIndex === slideData.length - 1 && step >= maxSteps - 1 ? 'Zurück zur Startseite' : 'Weiter'}
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

      {!isZoomed && (
        <footer className="py-6 text-center text-xs text-[#4B2E2B] bg-transparent">
          © 2025 JB Finanz AG. Alle Rechte vorbehalten.
        </footer>
      )}
    </div>
    </div>

  );
};

export default JBSlides;