import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'react-lottie-player';
import underlineAnimation from '../assets/underline.json';

function BeratungsSeite() {
  const navigate = useNavigate();
  const [pageVisible, setPageVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setPageVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const kunde = JSON.parse(localStorage.getItem('ausgewaehlterKunde')) || {
    vorname: 'Kunde',
    nachname: '',
  };
  const beraterName = localStorage.getItem('beraterName') || 'Max Muster';
  const profilbild = '/default-profile.png';

  const themen = [
    {
      id: 'lebenstandard',
      title: 'Lebensstandard beibehalten',
      img: '/themen/Lebensstandard.png',
      route: '/tools/lebenstandard/lebenstandard',  // Dynamischer Bereich
      tint: '#d7c4b2',
    },
    {
      id: 'vermoegen',
      title: 'Vermögen aufbauen',
      img: '/themen/Vermoegen.png',
      route: '/tools/vermoegen/vermoegen',  // Dynamischer Bereich
      tint: '#e4d6cb',
    },
    {
      id: 'pension',
      title: 'Pension vorsorgen',
      img: '/themen/Vorsorge.png',
      route: '/tools/vorsorge/vorsorge',  // Dynamischer Bereich
      tint: '#e3cbd1',
    },
    {
      id: 'gesundheit',
      title: 'Gesundheit',
      img: '/themen/Gesundheit.png',
      route: '/tools/krankenkasse/krankenkasse',  // Dynamischer Bereich
      tint: '#d9dfe6',
    },
    {
      id: 'immobilien',
      title: 'Immobilien',
      img: '/themen/Immobilien.png',
      route: '/tools/immobilien/immobilien',  // Dynamischer Bereich
      tint: '#f0e1c7',
    },
    {
      id: 'kinder',
      title: 'Kinder absichern',
      img: '/themen/Kinder.png',
      route: '/tools/kinderabsichern/kinderabsichern',  // Dynamischer Bereich
      tint: '#f5e3dc',
    },
  ];
  

  return (
    <div className="relative min-h-screen w-full font-sans">
      <div className="absolute inset-0 bg-cover bg-center bg-fixed" style={{ backgroundImage: 'url("/wave-bg.jpg")' }} />
      <div className="absolute inset-0 bg-[#F8F5F2]/60 backdrop-blur-sm" />

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
          <img src={profilbild} alt="Profil" className="h-12 w-12 rounded-full object-cover border border-gray-300" />
        </div>
      </header>

      {/* WELCOME */}
      <section className="relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-8 animate-fade-in-up">
        <div
          onClick={() => navigate('/wuensche-und-ziele')}
          className="bg-[#8C3B4A] rounded-3xl shadow-2xl px-10 py-8 text-white text-center cursor-pointer hover:bg-[#7A3340] transition"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-2 font-serif tracking-tight">Willkommen, {kunde.vorname} {kunde.nachname}</h1>
          <p className="text-lg sm:text-xl">Deine Wünsche & Ziele</p>
        </div>

        {/* Neuer Button JB Finanz AG */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate('/jbslides')}
            className="bg-[#7E6B64] rounded-3xl shadow-xl px-6 py-3 text-white text-lg font-semibold hover:bg-[#6D5B55] transition"
            style={{ minWidth: '220px' }}
          >
            JB Finanz AG
          </button>
        </div>
      </section>

      {/* THEMEN */}
      <main className={`relative z-10 px-4 sm:px-8 lg:px-16 py-12 transition-opacity duration-700 ${pageVisible ? 'opacity-100' : 'opacity-0'}`}>
        <h2 className="text-3xl font-bold text-[#4B2E2B] mb-10 text-center tracking-tight">Wähle ein Themenfeld</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {themen.map((item, index) => (
            <div
              key={item.id}
              className="group relative rounded-3xl overflow-hidden shadow-xl cursor-pointer transition-transform hover:scale-[1.03] hover:shadow-2xl"
              onClick={() => navigate(item.route)} // Dynamische Navigation
              style={{ transitionDelay: `${index * 0.1}s`, height: '240px', backgroundColor: item.tint }}
            >
              <div className="relative w-full h-full">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover object-center opacity-80 transition duration-300 group-hover:opacity-90"
                />
                <div className="absolute bottom-0 left-0 right-0 px-4 transition-all duration-500 ease-in-out group-hover:pb-6">
                  <div className="bg-white/75 backdrop-blur-md rounded-t-2xl px-4 py-1 text-center shadow-md border-t border-white/40 transition-all duration-500 ease-in-out group-hover:py-3">
                    <span className="text-[#4B2E2B] font-semibold text-base tracking-wide">
                      {item.title}
                    </span>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-3 relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(item.route); // Dynamische Navigation
                        }}
                        className="bg-white/90 backdrop-blur-md text-[#4B2E2B] font-medium px-5 py-2 rounded-full shadow hover:scale-105 transition text-sm border border-[#4B2E2B]/20 relative"
                      >
                        Beratung starten
                        <div className="absolute left-0 right-0 -bottom-3 flex justify-center">
                          <Lottie
                            loop
                            play
                            animationData={underlineAnimation}
                            style={{ width: 80, height: 20 }}
                          />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Abschließen Button */}
        <div className="flex justify-end items-end mt-12 w-full">
          <button
            onClick={() => navigate('/beratungs-menue')}  
            className="bg-[#4B2E2B] text-white px-6 py-3 rounded-xl hover:bg-[#3a221f] transition"
          >
            Beratung abschließen
          </button>
        </div>

        {/* Zurück Button */}
        <button onClick={() => navigate("/kunden-verwalten")} className="mt-12 block mx-auto text-sm text-gray-500 hover:text-gray-800 transition">
          ← Zurück
        </button>
      </main>

      <footer className="relative z-10 py-6 text-center text-xs text-gray-700 bg-white/10 backdrop-blur-sm">
        © 2025 JB Finanz AG. Alle Rechte vorbehalten.
      </footer>
    </div>
  );
}

export default BeratungsSeite;
