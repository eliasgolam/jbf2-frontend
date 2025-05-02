import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'react-lottie-player';

// Chart-Animation (bitte chart.json in src/assets/ legen)
import chartAnimation from '../assets/chart.json';

function BeraterDashboard() {
  const navigate = useNavigate();

  // Fade-in Effekt
  const [fadeIn, setFadeIn] = useState(false);

  // Hier nur Platzhalter-Zahlen
  // Später holst du echte Daten (Kalender, Datenbank etc.)
  const [todayAppointments, setTodayAppointments] = useState(2);
  const [weekAppointments, setWeekAppointments] = useState(7);
  const [completedAppointments, setCompletedAppointments] = useState(4);

  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col font-sans">
      {/* 1) Hintergrundbild */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url("/wave-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      />
      {/* 2) Overlay */}
      <div className="absolute inset-0 bg-[#F8F5F2]/40" />

      {/* 3) Hauptinhalt mit Fade-in */}
      <main
        className={`
          relative z-10 flex-grow flex flex-col items-center justify-center
          px-4 py-10
          transition-all duration-700 ease-out
          ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
        `}
      >
        {/* LOGO */}
        <img
          src="/logo.svg"
          alt="JB Finanz Logo"
          className="h-[500px] object-contain mb-8"
        />

        {/* GLAS-CONTAINER */}
        <div className="
          w-full
          max-w-3xl
          mx-auto
          bg-white/15
          backdrop-blur-md
          border border-white/20
          rounded-2xl
          shadow-xl
          p-8
          text-center
        ">
          {/* Überschrift */}
          <h1 className="
            text-4xl
            sm:text-5xl
            font-playfair
            font-bold
            text-[#4B2E2B]
            mb-6
            tracking-tight
          ">
            Dein Berater-Dashboard
          </h1>

          <p className="
            font-sans
            text-[#7E6B64]
            text-lg
            sm:text-xl
            leading-relaxed
            max-w-2xl
            mx-auto
            mb-8
          ">
            Hier kannst du neue Kunden anlegen, bestehende Kunden verwalten 
            oder zur Startseite zurückkehren. Unten siehst du zudem 
            eine Übersicht deiner Termine für heute und diese Woche.
          </p>

          {/* BUTTON-GRUPPE */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-4 mb-10">
            {/* NEUER KUNDE */}
            <button
              onClick={() => navigate('/neuer-kunde')}
              className="
                bg-[#8C3B4A]
                text-white
                hover:bg-[#7A3340]
                hover:scale-105
                transition-transform
                px-8
                py-4
                rounded-full
                font-semibold
                shadow
                duration-300
                text-lg
              "
            >
              ➕ Neuer Kunde erfassen
            </button>

            {/* KUNDEN VERWALTEN */}
            <button
              onClick={() => navigate('/kunden-verwalten')}
              className="
                bg-[#8C3B4A]
                text-white
                hover:bg-[#7A3340]
                hover:scale-105
                transition-transform
                px-8
                py-4
                rounded-full
                font-semibold
                shadow
                duration-300
                text-lg
              "
            >
              📁 Kunden verwalten
            </button>
          </div>

          {/* MINI-KARTE: Termine */}
          <div className="
            w-full
            bg-white/10
            rounded-xl
            border border-white/20
            shadow
            px-6
            py-6
            flex flex-col-reverse sm:flex-row
            items-center
            justify-center
            gap-6
          ">
            {/* Text-Spalte */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="
                text-2xl 
                font-playfair 
                text-[#4B2E2B] 
                mb-3
              ">
                Deine Termine
              </h2>
              <p className="text-[#7E6B64] text-base sm:text-lg mb-1">
                Heute: <span className="font-semibold text-gray-800">{todayAppointments}</span>
              </p>
              <p className="text-[#7E6B64] text-base sm:text-lg mb-1">
                Diese Woche: <span className="font-semibold text-gray-800">{weekAppointments}</span>
              </p>
              <p className="text-[#7E6B64] text-base sm:text-lg">
                Bereits durchgeführt: <span className="font-semibold text-gray-800">{completedAppointments}</span>
              </p>
              {/* Später binden wir hier echte Daten an dein Kalendersystem an. */}
            </div>

            {/* Chart-Animation */}
            <div className="flex-shrink-0">
              <Lottie
                loop
                animationData={chartAnimation}
                play
                style={{ width: 140, height: 140 }}
              />
            </div>
          </div>

          {/* ZURÜCK-Link */}
          <div className="mt-8">
            <button
              onClick={() => navigate('/berater-auswahl')}
              className="
                text-sm
                text-[#4B2E2B]
                border
                border-[#4B2E2B]
                rounded-full
                px-6
                py-2
                font-medium
                transition
                hover:bg-[#4B2E2B]
                hover:text-white
                duration-300
              "
            >
              ← Zurück zur Berater-Auswahl
            </button>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="
        relative
        z-10
        flex
        justify-center
        items-center
        py-6
        bg-white/10
        backdrop-blur-sm
      ">
        <p className="text-sm text-gray-700 tracking-wide">
          © 2025 JB Finanz AG. Alle Rechte vorbehalten.
        </p>
      </footer>
    </div>
  );
}

export default BeraterDashboard;
