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
    <div className="w-screen h-screen flex items-center justify-center bg-white">
      <div className="max-w-[1720px] w-full h-full overflow-auto px-4 py-4 flex flex-col relative">
        {/* HEADER */}
        <div className="flex justify-end items-center gap-4 h-20">
          <button onClick={() => navigate('/beratung-starten')}>
            <img src="/türe.png" alt="Türe Icon" className="h-10 w-10" />
          </button>
          <img src="/logotools.png" alt="Logo" className="h-20 object-contain" />
        </div>

        {/* TITLE ZENTRIERT */}
        <div className="absolute top-[90px] left-1/2 transform -translate-x-1/2 z-50">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-widest text-[#4B2E2B]">
            {title}
          </h1>
        </div>

        {/* SLIDE CONTAINER */}
        <div className={`flex-grow flex items-center justify-center transition-all duration-300 ${isZoomed ? 'fixed inset-0 bg-white z-[100] p-4' : ''}`}>
          <div className="w-full max-w-6xl h-[800px] flex flex-col justify-between bg-white/60 backdrop-blur-md border-2 border-[#4B2E2B] rounded-3xl shadow-xl p-6">

            {intro && (
              <div className="text-center text-base text-[#4B2E2B] font-medium px-4 max-w-3xl mx-auto">
                {intro}
              </div>
            )}

            <div className="flex-1 flex items-center justify-center">
              <SVG className="w-full h-auto object-contain" />
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <button onClick={prevStep} className="px-6 py-2 bg-white/80 text-[#4B2E2B] rounded-full hover:bg-white shadow-md">
                Zurück
              </button>
              <button onClick={skipSlide} className="px-6 py-2 bg-white/80 text-[#4B2E2B] rounded-full hover:bg-white shadow-md">
                Überspringen
              </button>
              <button onClick={nextStep} className="px-6 py-2 bg-[#8C3B4A] text-white rounded-full hover:bg-[#722f3a] shadow-md">
                {slideIndex === slideData.length - 1 && step >= maxSteps - 1 ? 'Zurück zur Startseite' : 'Weiter'}
              </button>
              <button
                onClick={() => setIsZoomed(z => !z)}
                title={isZoomed ? 'Zurücksetzen' : 'Vergrößern'}
                className="px-4 py-2 bg-white text-[#4B2E2B] rounded-full hover:bg-gray-100 shadow-lg"
              >
                {isZoomed ? '🗕' : '⛶'}
              </button>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        {!isZoomed && (
          <footer className="text-center text-xs text-[#4B2E2B] mt-4">
            © 2025 JB Finanz AG. Alle Rechte vorbehalten.
          </footer>
        )}
      </div>
    </div>
  );
};

export default JBSlides;
