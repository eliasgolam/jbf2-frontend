import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as Slide1SVG } from './Krankenkassenslide1.svg';
import { ReactComponent as Slide2SVG } from './Krankenkassenslide2.svg';
import { ReactComponent as Slide3SVG } from './Krankenkassenslide3.svg';
import { ReactComponent as Slide4SVG } from './Krankenkassenslide4.svg';
import { motion } from 'framer-motion';

const slideData = [
  {
    title: 'Grundversicherungsmodelle',
    SVG: Slide1SVG,
    containerText: '',
    steps: [
      ['Gruppe1'], ['Gruppe2'], ['Gruppe3'], ['Gruppe4'],
      ['Gruppe5'], ['Gruppe6'], ['Gruppe7'], ['Gruppe8']
    ],
    allIDs: ['Gruppe1', 'Gruppe2', 'Gruppe3', 'Gruppe4', 'Gruppe5', 'Gruppe6', 'Gruppe7', 'Gruppe8'],
    svgClass: 'w-[85%] h-auto max-h-[60vh] mx-auto my-auto object-contain',
    zoomSvgClass: 'w-[90%] h-auto max-h-[85vh] mx-auto my-auto object-contain',

  },
  {
    title: 'Franchise',
    SVG: Slide2SVG,
    containerText: '',
    steps: [
      ['Text1'],
      ['Linie1'],
      ['Text2'],
      ['Text3'],
      ['Text4'],
      ['Bild1'],
      ['Preis1'],
      ['Linie2'],
      ['Preis2']
    ],
    allIDs: [
      'Text1', 
      'Linie1', 
      'Text2', 
      'Text3', 
      'Text4', 
      'Bild1', 
      'Preis1', 
      'Linie2', 
      'Preis2'
    ],
    svgClass: 'w-[80%] h-auto max-h-[55vh] mx-auto my-auto object-contain',
    zoomSvgClass: 'w-[80%] h-auto max-h-[80vh] mx-auto my-auto object-contain',

  },
  {
    title: 'Zusatzversicherungen',
    SVG: Slide3SVG,
    containerText: '',
    steps: [
      ['klick1'], ['klick2'], ['klick3'], ['klick4'],
      ['klick5'], ['klick6'], ['klick7'], ['klick8']
    ],
    allIDs: ['klick1', 'klick2', 'klick3', 'klick4', 'klick5', 'klick6', 'klick7', 'klick8'],
    svgClass: 'w-[80%] h-auto max-h-[55vh] mx-auto my-auto object-contain',
    zoomSvgClass: 'w-[85%] h-auto max-h-[80vh] mx-auto my-auto object-contain',
  },
  {
    title: 'Spitalabteilung',
    SVG: Slide4SVG,
    containerText: '',
    steps: [
      ['Gruppe1'], ['Gruppe2'], ['Gruppe3'], ['Gruppe4'], ['Gruppe5']
    ],
    allIDs: ['Gruppe1', 'Gruppe2', 'Gruppe3', 'Gruppe4', 'Gruppe5'],
    svgClass: 'w-[80%] h-auto max-h-[55vh] mx-auto my-auto object-contain',
    zoomSvgClass: 'w-[85%] h-auto max-h-[80vh] mx-auto my-auto object-contain',
  }
];

const Krankenkassenslides = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const navigate = useNavigate();
  const currentSlide = slideData[slideIndex];
  const { SVG, title, containerText, svgClass, zoomSvgClass } = currentSlide;


  const nextStep = useCallback(() => {
    if (slideIndex === slideData.length - 1 && step >= currentSlide.steps.length - 1) {
      navigate('/beratung-starten');
      return;
    }
    if (step < currentSlide.steps.length - 1) {
      setStep(prev => prev + 1);
    } else if (slideIndex < slideData.length - 1) {
      setSlideIndex(prev => prev + 1);
      setStep(0);
    }
  }, [step, slideIndex, currentSlide]);

  const prevStep = useCallback(() => {
    if (step > 0) {
      setStep(prev => prev - 1);
    } else if (slideIndex > 0) {
      const prevSlide = slideData[slideIndex - 1];
      setSlideIndex(prev => prev - 1);
      setStep(prevSlide.steps.length - 1);
    } else {
      // Wenn keine Steps und keine Slides mehr zurückgehen: Zurück zur Krankenkasse-Tools-Seite
      navigate('/tools/krankenkasse/krankenkasse');
    }
  }, [step, slideIndex, navigate]);

  const skipSlide = () => {
    if (slideIndex < slideData.length - 1) {
      setSlideIndex(prev => prev + 1);
      setStep(0);
    } else {
      navigate('/beratung-starten');
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
      {!isZoomed && (
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
      )}

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

      <main className="flex flex-col justify-start items-center px-4">
      <div className={`transition-all duration-500 flex flex-col items-center justify-center 
  ${isZoomed 
    ? 'fixed inset-0 z-[100] bg-white rounded-none max-w-none h-full mt-0' 
    : 'relative w-full max-w-7xl h-[680px] sm:h-[600px] md:h-[680px] lg:h-[720px] mt-6 rounded-[2rem] bg-white/60'} 
  backdrop-blur-md shadow-xl border-2 border-[#4B2E2B] overflow-hidden`}>

        <div className="relative overflow-hidden rounded-[2rem] z-10">

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="flex items-center justify-center w-full h-full"
            >
             <div className="w-full h-full px-4 max-w-6xl flex flex-col items-center justify-center">
  <SVG className={`${isZoomed ? zoomSvgClass : svgClass} transition-all duration-300 ease-in-out`} />
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
            <button onClick={nextStep} className={`px-6 py-2 rounded-full transition shadow-md ${slideIndex === slideData.length - 1 && step >= currentSlide.steps.length - 1 ? 'bg-[#4B2E2B] text-white hover:bg-[#3a2321]' : 'bg-[#8C3B4A] text-white hover:bg-[#722f3a]'}`}>
              {slideIndex === slideData.length - 1 && step >= currentSlide.steps.length - 1 ? 'Zurück zur Beratung' : 'Weiter'}
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

export default Krankenkassenslides;