import React from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'react-lottie-player';
import { useParams } from 'react-router-dom';

import budgetAnimation from '../assets/Budget.json';
import sparAnimation from '../assets/Sparrechner.json';
import zinsAnimation from '../assets/Zinsvergleich.json';
import startenAnimation from '../assets/Startenoderwarten.json';
import slideStartenAnimation from '../assets/SlideStarten.json';



const VermoegenTools = () => {
  const navigate = useNavigate();
  const beraterName = localStorage.getItem('beraterName') || 'Berater';
  const profilbild = '/default-profile.png';
  const { bereich } = useParams(); // z. B. 'vermoegen' oder 'gesundheit'

const tools = [
  {
    title: 'Budget',
    description: 'Erfasse deine Einnahmen und Ausgaben schnell & einfach.',
    path: `/tools/${bereich}/budget`, // 👈 dynamisch
    animation: budgetAnimation,
  },
  {
    title: 'Sparrechner',
    description: 'Berechne, wie sich dein Vermögen über die Zeit entwickelt.',
    path: `/tools/${bereich}/sparrechner`,
    animation: sparAnimation,
  },
  {
    title: 'Zinsvergleich',
    description: 'Vergleiche verschiedene Zinssätze und ihre Wirkung.',
    path: `/tools/${bereich}/zinsvergleich`,
    animation: zinsAnimation,
  },
  {
    title: 'Starten oder Warten',
    description: 'Was bringt mehr? Jetzt investieren oder später?',
    path: `/tools/${bereich}/starten-oder-warten`,
    animation: startenAnimation,
  },
];



  return (
    <div className="min-h-screen flex flex-col bg-cover bg-center text-[#4B2E2B] font-sans" style={{ backgroundImage: 'url(/wave-bg.jpg)' }}>

      {/* HEADER im Markenstil */}
      <header className="relative z-10 flex justify-between items-center px-8 py-6">
        <div className="w-1/3" />

        <div className="w-1/3 flex justify-center">
          <img src="/logo.svg" alt="JB Finanz Logo" className="h-80 object-contain" />
        </div>

        <div className="w-1/3 flex justify-end items-center gap-4 text-right">
          <div className="text-sm sm:text-base text-[#4B2E2B] font-semibold">
            {beraterName}
          </div>
          <img src={profilbild} alt="Profil" className="h-12 w-12 rounded-full object-cover border border-gray-300" />
        </div>
      </header>

      {/* INHALT */}
      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 text-center flex flex-col items-center">

        <h2 className="text-3xl font-bold mb-2">Vermögensaufbau</h2>
        <p className="text-[#7E6B64] mb-10">Individuelle Analyse deines finanziellen Potenzials</p>

        {/* Tool-Karten mit CI-Rahmen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 w-full">
          {tools.map((tool, index) => (
            <div
              key={index}
              className="bg-white/50 backdrop-blur-md border border-[#8C3B4A]/30 p-6 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-[#8C3B4A]/20 transition-all cursor-pointer flex flex-col items-center"
              onClick={() => navigate(tool.path)}
            >
              <Lottie
                loop
                animationData={tool.animation}
                play
                className="w-28 h-28 mb-4"
              />
              <h3 className="text-lg font-semibold mb-2 text-[#4B2E2B]">{tool.title}</h3>
              <p className="text-sm text-[#7E6B64]">{tool.description}</p>
            </div>
          ))}
        </div>

        {/* Präsentation starten */}
        <div
  className="flex flex-col items-center cursor-pointer hover:scale-110 transition-transform mb-10"
  onClick={() => navigate('/vermoegen')} // ← angepasst
>
  <Lottie loop animationData={slideStartenAnimation} play className="w-28 h-28" />
  <p className="text-center font-semibold text-md mt-2">Präsentation starten</p>
</div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full max-w-xl">
          <button
            onClick={() => navigate('/beratung-starten')}
            className="bg-[#E7E2DD] hover:bg-[#d5cec7] text-[#4B2E2B] px-6 py-2 rounded-xl text-sm font-medium shadow"
          >
            ← Zurück
          </button>
          <button
            onClick={() => navigate('/beratung-starten')}
            className="bg-[#8C3B4A] hover:bg-[#7A3340] text-white px-6 py-2 rounded-xl text-sm font-semibold shadow"
          >
            Themenfeld abschliessen →
          </button>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="py-6 text-center text-xs text-gray-700 bg-white/20 backdrop-blur-sm">
        © 2025 JB Finanz AG. Alle Rechte vorbehalten.
      </footer>
    </div>
  );
};

export default VermoegenTools;
