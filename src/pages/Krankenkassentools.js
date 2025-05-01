import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Lottie from 'react-lottie-player';

import budgetAnimation from '../assets/Budget.json';
import franchisenAnimation from '../assets/Franchisenrechner.json';
import kkVergleichAnimation from '../assets/Krankenkassenvergleich.json';
import slideStartenAnimation from '../assets/SlideStarten.json';

const Krankenkassentools = () => {
  const navigate = useNavigate();
  const { bereich } = useParams(); // Dynamischer Bereich (z. B. 'vermoegen', 'gesundheit', etc.)
  const user = JSON.parse(localStorage.getItem("loggedInUser")) || {};
const beraterName = user.username || "Berater";
const profilbild = user.profilbild || "/default-profile.png";


  // Dynamische Tools basierend auf dem Bereich
  const tools = [
    {
      title: 'Budget',
      description: 'Einnahmen & Ausgaben erfassen',
      animation: budgetAnimation,
      path: `/tools/${bereich}/budget`, // Dynamischer Bereich
    },
    {
      title: 'Franchisen-Rechner',
      description: 'Kostendifferenz je Franchisehöhe',
      animation: franchisenAnimation,
      path: `/tools/${bereich}/franchise`, // Dynamischer Bereich
    },
    {
      title: 'Krankenkassenvergleich',
      description: '„Wer vergleicht, spart gesund.“',
      animation: kkVergleichAnimation,
      path: `/tools/${bereich}/krankenkassenvergleich`,
    },
  ];

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center text-[#4B2E2B] font-sans"
      style={{ backgroundImage: 'url(/wave-bg.jpg)' }}
    >
      {/* HEADER */}
      <header className="relative z-10 flex justify-between items-center px-8 py-6">
        <div className="w-1/3" />
        <div className="w-1/3 flex justify-center">
          <img src="/logo.svg" alt="JB Finanz Logo" className="h-80 object-contain" />
        </div>
        <div className="w-1/3 flex justify-end items-center gap-4 text-right">
          <div className="text-sm sm:text-base text-[#4B2E2B] font-semibold">
            {beraterName}
          </div>
          <img
            src={profilbild}
            alt="Profil"
            className="h-12 w-12 rounded-full object-cover border border-gray-300"
          />
        </div>
      </header>

      {/* INHALT */}
      <main className="flex-grow max-w-6xl mx-auto px-4 py-8 text-center flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-2">Gesundheit</h2>
        <p className="text-[#7E6B64] mb-8">
          Optimieren Sie Ihre Gesundheitskosten und vergleichen Sie smart
        </p>

        {/* Toolkarten */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 w-full">
          {tools.map((tool, index) => (
            <div
              key={index}
              onClick={() => navigate(tool.path)} // Dynamische Navigation basierend auf dem Bereich
              className="bg-white/50 backdrop-blur-md border border-[#8C3B4A]/30 p-5 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-[#8C3B4A]/20 transition-all cursor-pointer flex flex-col items-center"
            >
              <Lottie
                loop
                animationData={tool.animation}
                play
                className="w-24 h-24 mb-3"
              />
              <h3 className="text-lg font-semibold mb-1 text-[#4B2E2B]">{tool.title}</h3>
              <p className="text-sm text-[#7E6B64] text-center">{tool.description}</p>
            </div>
          ))}
        </div>

        {/* Präsentation starten */}
        <div
          className="flex flex-col items-center cursor-pointer hover:scale-110 transition-transform mb-8"
          onClick={() => navigate('/Krankenkasse/slides')}
        >
          <Lottie
            loop
            animationData={slideStartenAnimation}
            play
            className="w-28 h-28"
          />
          <p className="text-center font-semibold text-md mt-2">Präsentation starten</p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 w-full max-w-xl">
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

export default Krankenkassentools;
