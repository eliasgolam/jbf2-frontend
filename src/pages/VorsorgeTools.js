import React from 'react';
import Lottie from 'react-lottie-player';
import { useNavigate, useParams } from 'react-router-dom';

import budgetAnimation from '../assets/Budget.json';
import sparAnimation from '../assets/Sparrechner.json';
import zinsAnimation from '../assets/Zinsvergleich.json';
import startenAnimation from '../assets/Startenoderwarten.json';
import rentenAnimation from '../assets/Rentenrechner.json';
import vorsorgeAnimation from '../assets/Vorsorgerechner.json';
import slideStartenAnimation from '../assets/SlideStarten.json';

const VorsorgeTools = () => {
  const navigate = useNavigate();
  const { bereich } = useParams(); // Dynamischer Bereich
  const user = JSON.parse(localStorage.getItem("loggedInUser")) || {};
const beraterName = user.username || "Berater";
const profilbild = user.profilbild || "/default-profile.png";


  const tools = [
    { title: 'Budget', description: 'Einnahmen & Ausgaben erfassen', animation: budgetAnimation, path: `/tools/${bereich}/budget` },
    { title: 'Sparrechner', description: 'Vermögensentwicklung berechnen', animation: sparAnimation, path: `/tools/${bereich}/sparrechner` },
    { title: 'Zinsvergleich', description: 'Zinssätze im Vergleich', animation: zinsAnimation, path: `/tools/${bereich}/zinsvergleich` },
    { title: 'Starten oder Warten', description: 'Ertragsvergleich mit/ohne Wartezeit', animation: startenAnimation, path: `/tools/${bereich}/starten-oder-warten` },
    { title: 'Altersrentenrechner', description: 'Berechnung der Altersrente und der Lücke', animation: rentenAnimation, path: '/tools/:bereich/altersrenten-rechner' },
    { title: 'Vorsorgerechner', description: 'Kapitalbedarf & Vorsorgeziel berechnen', animation: vorsorgeAnimation, path: '/vorsorge/vorsorgerechner' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-cover bg-center text-[#4B2E2B] font-sans" style={{ backgroundImage: 'url(/wave-bg.jpg)' }}>
      <header className="relative z-10 flex justify-between items-center px-8 py-6">
        <div className="w-1/3" />
        <div className="w-1/3 flex justify-center">
          <img src="/logo.svg" alt="JB Finanz Logo" className="h-80 object-contain" />
        </div>
        <div className="w-1/3 flex justify-end items-center gap-4 text-right">
          <div className="text-sm sm:text-base text-[#4B2E2B] font-semibold">{beraterName}</div>
          <img src={profilbild} alt="Profil" className="h-12 w-12 rounded-full object-cover border border-gray-300" />
        </div>
      </header>

      {/* Inhalt */}
      <main className="flex-grow max-w-6xl mx-auto px-6 py-8 flex flex-col items-center text-center">
        <h2 className="text-3xl font-semibold mb-2">Altersvorsorge</h2>
        <p className="text-[#7E6B64] mb-8 text-md">Strukturierte Planung deiner Altersvorsorge</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 w-full">
          {tools.map((tool, idx) => (
            <div
              key={idx}
              onClick={() => navigate(tool.path)} // Dynamische Navigation
              className="bg-white/50 backdrop-blur-md border border-[#8C3B4A]/30 p-5 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-[#8C3B4A]/20 transition-all cursor-pointer flex flex-col items-center"
            >
              <Lottie loop animationData={tool.animation} play className="w-28 h-28 mb-3" />
              <h3 className="text-lg font-semibold mb-1">{tool.title}</h3>
              <p className="text-[#7E6B64] text-center text-sm">{tool.description}</p>
            </div>
          ))}
        </div>

        {/* Lottie unten mit zentriertem Text */}
        <div className="flex flex-col items-center cursor-pointer hover:scale-110 transition-transform mb-10" onClick={() => navigate('/vorsorge/slides')}
        >
          <Lottie loop animationData={slideStartenAnimation} play className="w-28 h-28" />
          <p className="text-center font-semibold text-md mt-2">Präsentation starten</p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between w-full px-4 max-w-xl">
          <button
            onClick={() => navigate('/beratung-starten')}
            className="bg-[#E7E2DD] hover:bg-[#d5cec7] text-[#4B2E2B] px-5 py-2 rounded-xl shadow"
          >
            ← Zurück
          </button>
          <button
            onClick={() => navigate('/beratung-starten')}
            className="bg-[#8C3B4A] hover:bg-[#7A3340] text-white px-5 py-2 rounded-xl font-semibold shadow"
          >
            Themenfeld abschliessen →
          </button>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="py-3 text-center text-sm text-gray-400 bg-white/30 backdrop-blur-sm mt-12">
        © 2025 JB Finanz AG. Alle Rechte vorbehalten.
      </footer>
    </div>
  );
};

export default VorsorgeTools;
