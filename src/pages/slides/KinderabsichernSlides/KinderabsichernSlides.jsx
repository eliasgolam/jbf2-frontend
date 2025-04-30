import React, { useEffect, useState, useCallback } from 'react';
import { ReactComponent as Slide1SVG } from './Kinderabsichernslide1.svg';
import { ReactComponent as Slide2SVG } from './Kinderabsichernslide2.svg';
import { ReactComponent as Slide3SVG } from './Kinderabsichernslide3.svg';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';


const slideData = [
  {
    title: 'Invalidität bei Kindern',
    SVG: Slide1SVG,
    maxSteps: 4,
    groups: ['Gruppe1', 'Gruppe2', 'Gruppe3', 'Gruppe4']
  },
  {
    title: 'Invalidität bei Kindern',
    SVG: Slide2SVG,
    maxSteps: 8,
    groups: ['Gruppe1', 'Gruppe2', 'Gruppe3', 'Gruppe4', 'Gruppe5', 'Gruppe6', 'Gruppe7', 'Gruppe8']
  },
  {
    title: 'Kindersparplan',
    SVG: Slide3SVG,
    maxSteps: 7,
    groups: ['Gruppe1', 'Gruppe2', 'Gruppe3', 'Gruppe4', 'Gruppe5', 'Gruppe6', 'Gruppe7']
  },
];

const KinderabsichernSlides = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const navigate = useNavigate();
  const { bereich } = useParams();
  const { title, SVG, maxSteps, groups } = slideData[slideIndex];

  const redirectToTool = () => {
    navigate(`/tools/${bereich}/kinderabsichern`);

  };

  const redirectToBeratung = () => {
    navigate('/beratung-starten');
  };

  const nextStep = useCallback(() => {
    if (slideIndex === 2 && step >= maxSteps - 1) {
      console.log('Weiterleitung zu Kinderabsichern!');
      navigate(`/tools/${bereich}/kinderabsichern`);
      return;
    }
  
    if (step < maxSteps - 1) {
      setStep(prev => prev + 1);
    } else if (slideIndex < slideData.length - 1) {
      setSlideIndex(prev => prev + 1);
      setStep(slideIndex + 1 === 2 ? -1 : 0);
    }
  }, [step, slideIndex, maxSteps]);
  
  

  const prevStep = useCallback(() => {
    if (slideIndex === 0 && step <= 0) {
      console.log('Zurück zur Kinderabsichern!');
      navigate(`/tools/${bereich}/kinderabsichern`);
      return;
    }
  
    if (step > 0 || (slideIndex === 2 && step > -1)) {
      setStep(prev => prev - 1);
    } else if (slideIndex > 0) {
      const prevSlide = slideData[slideIndex - 1];
      setSlideIndex(prev => prev - 1);
      setStep(prevSlide.maxSteps - 1);
    }
  }, [step, slideIndex]);
  

  const skipSlide = () => {
    if (slideIndex < slideData.length - 1) {
      setSlideIndex(prev => prev + 1);
      setStep(slideIndex + 1 === 2 ? -1 : 0);
    } else {
      redirectToTool();
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
    <div className="flex flex-col min-h-screen justify-between bg-cover bg-center text-[#4B2E2B]" style={{ backgroundImage: "url('/wave-bg.jpg')" }}>
      {!isZoomed && (
        <header className="relative z-10 bg-gradient-to-b from-white via-white/90 to-transparent">
          <div className="h-[160px] flex items-center justify-end" style={{ transform: 'translateY(30%)' }}>
            <div className="w-full max-w-7xl mx-auto px-6 flex justify-end">
              <div className="flex items-center gap-4">
                <button onClick={redirectToBeratung} className="hover:opacity-80">
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
        <div className={`transition-all duration-500 ${isZoomed ? 'fixed inset-0 z-[100] bg-white rounded-none max-w-none h-full mt-0' : 'relative w-full max-w-7xl min-h-[65vh] mt-6 rounded-[2rem] bg-white/60'} backdrop-blur-md shadow-xl border-2 border-[#4B2E2B] overflow-visible`}>

          {isZoomed && (
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-[80]">
              <div className="bg-[#8C3B4A] text-white px-8 py-2 rounded-xl shadow-md">
                <h1 className="text-[20px] sm:text-[22px] font-semibold tracking-wider uppercase">
                  {title}
                </h1>
              </div>
            </div>
          )}

          <div className="absolute inset-0 overflow-hidden rounded-[2rem]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="flex items-center justify-center w-full h-full"
            >
              <div className="max-w-[90%] max-h-[90%] flex items-center justify-center">
                <SVG className="w-full h-auto object-contain" />
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
              {slideIndex === 2 && step >= maxSteps - 1 ? 'Zurück zur Kinderabsichern' : 'Weiter'}
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
  );
};

export default KinderabsichernSlides;
