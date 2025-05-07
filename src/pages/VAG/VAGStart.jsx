import React, { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { FileText, Pencil, PenTool } from 'lucide-react';

const VAGStart = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const kundenId = localStorage.getItem('aktiveKundenId');
    if (!kundenId) return;
  
    fetch(`https://jbf2-backend.onrender.com/api/kunden/${kundenId}/vag45`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          // Ergänze Kundendaten-ID, falls nicht im Backend gespeichert
          const antwortenMitId = {
            ...data,
            kundendaten: {
              ...(data.kundendaten || {}),
              kundenId
            }
          };
  
          localStorage.setItem('antworten', JSON.stringify(antwortenMitId));
          navigate('/vag/unterzeichnen');
        }
      })
      .catch(() => {});
  }, []);
  
  

  const handleStart = () => {
    navigate('/vag/flow');
  };
  

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center px-6 text-[#4B2E2B] relative"
      style={{ backgroundImage: "url('/wave-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-[#00000070]" />

      <div className="relative z-10 bg-white/90 backdrop-blur-md p-10 sm:p-12 rounded-3xl shadow-2xl w-full max-w-3xl">
        <div className="mb-6 text-center">
          <img src="/Logo.png" alt="JB Finanz Logo" className="h-28 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-[#8C3B4A]">VAG 45 ausfüllen</h1>
          <p className="text-sm text-gray-600 mt-1">Bitte wählen Sie eine Option zum Ausfüllen des Dokuments.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button
            onClick={handleStart}
            className="flex items-center gap-3 px-6 py-4 bg-[#4B2E2B] text-white rounded-xl shadow hover:bg-[#3a221f]"
          >
            <FileText className="w-5 h-5" />
            <span>Dokument direkt ausfüllen</span>
          </button>

          <button
            onClick={handleStart}
            className="flex items-center gap-3 px-6 py-4 bg-white border border-[#8C3B4A] text-[#8C3B4A] rounded-xl shadow hover:bg-[#fef1f3]"
          >
            <Pencil className="w-5 h-5" />
            <span>Browser-Unterzeichnung</span>
          </button>

          <button
            onClick={handleStart}
            className="flex items-center gap-3 px-6 py-4 bg-[#fef1f3] text-[#4B2E2B] border border-[#8C3B4A] rounded-xl shadow hover:bg-[#fce8ec]"
          >
            <PenTool className="w-5 h-5" />
            <span>Via Link / QR starten</span>
          </button>
        </div>
      </div>

      <footer className="absolute bottom-4 text-center text-xs text-white z-10">
        <p>© 2025 JB Finanz AG. Alle Rechte vorbehalten.</p>
      </footer>
    </div>
  );
};

export default VAGStart;
