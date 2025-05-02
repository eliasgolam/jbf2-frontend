import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as Slide1SVG } from './Vorsorgeslide1.svg';
import { ReactComponent as Slide2SVG } from './Vorsorgeslide2.svg';
import { ReactComponent as Slide3SVG } from './Vorsorgeslide3.svg';
import { ReactComponent as Slide4SVG } from './Vorsorgeslide4.svg';
import { ReactComponent as Slide5SVG } from './Vorsorgeslide5.svg';
import { ReactComponent as Slide6SVG } from './Vorsorgeslide6.svg';
import { motion } from 'framer-motion';

const slideData = [
  {
    title: '3. Säulen Prinzip',
    SVG: Slide1SVG,
    containerText: '',
    steps: [
      ['Bild1'],
      ['Bild2', 'Text1', 'Text1.1', 'Text1.2', 'Text1.3', 'Text1.4', 'Text1.5'],
      ['Bild3', 'Text2', 'Text2.2', 'Text2.3', 'Text2.4', 'Text2.5'],
      ['Bild4', 'Text3', 'Text3.1', 'Text3.2', 'Text3.3', 'Text3.4']
    ],
    allIDs: [
      'Bild1', 'Bild2', 'Text1', 'Text1.1', 'Text1.2', 'Text1.3', 'Text1.4', 'Text1.5',
      'Bild3', 'Text2', 'Text2.2', 'Text2.3', 'Text2.4', 'Text2.5',
      'Bild4', 'Text3', 'Text3.1', 'Text3.2', 'Text3.3', 'Text3.4'
    ]
  },
  {
    title: 'Einkommenslücke im Alter',
    SVG: Slide2SVG,
    containerText: '',
    steps: [
      ['Klick1'], ['Klick2'], ['Klick3'], ['Klick4'], ['Klick5'], ['Klick6']
    ],
    allIDs: ['Klick1', 'Klick2', 'Klick3', 'Klick4', 'Klick5', 'Klick6']
  },
  {
    title: 'Einkommenslücke im Alter',
    SVG: Slide3SVG,
    containerText: 'Beispiel: ⌀ Einkommen von CHF 5000.– pro Monat',
    steps: [
      ['Bild1', 'Text1.1', 'Text1.2'],
      ['Bild2', 'Text2.2', 'Text2.1', 'Bild2.1'],
      ['Bild3', 'Bild3.1', 'Text3.1', 'Text3.2']
    ],
    allIDs: [
      'Bild1', 'Text1.1', 'Text1.2', 'Bild2', 'Text2.2', 'Text2.1', 'Bild2.1',
      'Bild3', 'Bild3.1', 'Text3.1', 'Text3.2'
    ]
  },
  {
    title: 'Einkommenslücke bei Invalidität',
    SVG: Slide4SVG,
    containerText: 'Beispiel: Einkommen von CHF 5500.– pro Monat',
    steps: [
      ['Klick1'], ['Klick2'], ['Klick3'], ['Klick1', 'Klick2', 'Klick5'],
      ['Klick6'], ['Klick7'], ['Klick8'], ['Klick9'], ['Klick10'], ['Klick11'], ['Klick12']
    ],
    allIDs: ['Klick1', 'Klick2', 'Klick3', 'Klick5', 'Klick6', 'Klick7', 'Klick8', 'Klick9', 'Klick10', 'Klick11', 'Klick12']
  },
  {
    title: 'Vorsorge\nKombination der Risiken',
    SVG: Slide5SVG,
    containerText: '',
    steps: [
      ['Gruppe1', 'Gruppe1.1'], ['Gruppe2'], ['Gruppe3'], ['Gruppe4'], ['Gruppe5'],
      ['Gruppe6'], ['Gruppe7'], ['Gruppe8'], [], ['Gruppe9'], ['Gruppe10'], ['Gruppe11'],
      ['Gruppe12'], ['Gruppe13'], ['Gruppe14'], ['Gruppe15'], ['Gruppe16'], ['Gruppe17'],
      ['Gruppe18'], ['Gruppe19'], ['Gruppe20']
    ],
    allIDs: [
      'Gruppe1', 'Gruppe1.1', 'Gruppe2', 'Gruppe3', 'Gruppe4', 'Gruppe5', 'Gruppe6',
      'Gruppe7', 'Gruppe8', 'Gruppe9', 'Gruppe10', 'Gruppe11', 'Gruppe12', 'Gruppe13',
      'Gruppe14', 'Gruppe15', 'Gruppe16', 'Gruppe17', 'Gruppe18', 'Gruppe19', 'Gruppe20'
    ]
  },
  {
    title: 'Versicherung oder Bank?',
    SVG: Slide6SVG,
    containerText: '',
    steps: [
      [], ['Gruppe2'], ['Gruppe3'], ['Gruppe4'], ['Gruppe5'], ['Gruppe6'], ['Gruppe7'],
      ['Gruppe8'], ['Gruppe9'], ['Gruppe10']
    ],
    allIDs: [
      'Gruppe1', 'Gruppe2', 'Gruppe3', 'Gruppe4', 'Gruppe5',
      'Gruppe6', 'Gruppe7', 'Gruppe8', 'Gruppe9', 'Gruppe10'
    ],
    alwaysVisible: ['Gruppe1']
  }
  
  
];

const LebenstandardSlides = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const navigate = useNavigate();
  const currentSlide = slideData[slideIndex];
  const { SVG, title, containerText } = currentSlide;
  


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
      navigate("/tools/vorsorge/vorsorge");
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
    const visible = new Set(currentSlide.alwaysVisible || []);

    if (currentSlide.title.includes('Invalidität')) {
      if (step === 2) visible.add('Klick3');
      else if (step === 3) ['Klick1', 'Klick2', 'Klick5'].forEach(id => visible.add(id));
      else {
        for (let i = 0; i <= step; i++) {
          currentSlide.steps[i]?.forEach(id => id !== 'Klick3' && visible.add(id));
        }
      }
    } else if (currentSlide.title.includes('Kombination')) {
      for (let i = 0; i <= step; i++) {
        currentSlide.steps[i]?.forEach(id => visible.add(id));
      }
      if (step >= 8) ['Gruppe5', 'Gruppe6', 'Gruppe7'].forEach(id => visible.delete(id));
      if (step >= 15) visible.delete('Gruppe1.1');
    } else {
      for (let i = 0; i <= step; i++) {
        currentSlide.steps[i]?.forEach(id => visible.add(id));
      }
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
  <div className="relative z-20 px-6 pt-10 sm:pt-16 md:pt-20 max-w-4xl mx-auto">
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
      className="text-center text-base text-[#4B2E2B] font-medium"
    >
      {containerText}
    </motion.div>
  </div>
)}

      </div>

   
      <main className="flex flex-col justify-start items-center px-4">
        <div className={`transition-all duration-500 ${isZoomed ? 'fixed inset-0 z-[100] bg-white rounded-none max-w-none h-full mt-0' : 'relative w-full max-w-7xl min-h-[65vh] mt-6 rounded-[2rem] bg-white/60'} backdrop-blur-md shadow-xl border-2 border-[#4B2E2B] overflow-visible`}>

        <div className="relative overflow-hidden rounded-[2rem] z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="flex items-center justify-center w-full h-full"
            >
              <div className="max-w-[90%] max-h-[90%] flex items-center justify-center">
              <SVG className="w-full max-h-[65vh] h-auto object-contain" />
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

export default LebenstandardSlides;
