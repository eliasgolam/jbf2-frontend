import React, { useEffect, useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';

const VAGStart = () => {
  const [mode, setMode] = useState(null);
  const navigate = useNavigate();
  const token = useMemo(() => crypto.randomUUID(), []);
  const shareLink = `${window.location.origin}/vag/start?token=${token}`;



  const handleBrowser = () => {
    const status = JSON.parse(localStorage.getItem('protokollStatus')) || {};
    if (status.vag45 === true) {
      navigate('/vag/unterzeichnen');
    } else {
      navigate('/vag/flow');
    }
  };
  

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center px-6 text-[#4B2E2B] relative"
      style={{ backgroundImage: "url('/wave-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-[#00000070]" />

      <div className="relative z-10 bg-white/90 backdrop-blur-md p-12 rounded-3xl shadow-2xl w-full max-w-3xl">
        <div className="mb-6 text-center">
          <img src="/Logo.png" alt="JB Finanz Logo" className="h-28 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-[#8C3B4A]">VAG 45 ausfüllen</h1>
          <p className="text-sm text-gray-600 mt-1">Wie möchten Sie das Dokument ausfüllen?</p>
        </div>

        {!mode && (
          <div className="flex flex-col gap-4">
            <button
              onClick={handleBrowser}
              className="w-full py-3 bg-[#4B2E2B] text-white rounded-xl text-lg shadow hover:bg-[#3a221f]"
            >
              Direkt hier im Browser ausfüllen
            </button>
            <button
             onClick={() => {
              const status = JSON.parse(localStorage.getItem('protokollStatus')) || {};
              if (status.vag45 === true) {
                navigate('/vag/unterzeichnen');
              } else {
                setMode('qr');
              }
            }}
            
              className="w-full py-3 bg-white border border-[#8C3B4A] text-[#8C3B4A] rounded-xl text-lg shadow hover:bg-[#fef1f3]"
            >
              Per QR-Code senden
            </button>
            <button
             onClick={() => {
              const status = JSON.parse(localStorage.getItem('protokollStatus')) || {};
              if (status.vag45 === true) {
                navigate('/vag/unterzeichnen');
              } else {
                setMode('link');
              }
            }}
            
              className="w-full py-3 bg-gray-100 text-[#4B2E2B] rounded-xl text-lg shadow hover:bg-gray-200"
            >
              Link generieren
            </button>
          </div>
        )}

        {mode === 'qr' && (
          <div className="flex flex-col items-center gap-4 mt-6">
            <QRCodeSVG value={shareLink} size={180} fgColor="#4B2E2B" />
            <p className="text-sm text-center text-gray-700">
              Scannen Sie diesen Code, um das Formular im Browser zu öffnen
            </p>
            <button
              onClick={() => setMode(null)}
              className="text-sm underline text-[#4B2E2B] hover:text-[#8C3B4A]"
            >
              Zurück zur Auswahl
            </button>
          </div>
        )}

        {mode === 'link' && (
          <div className="flex flex-col items-center gap-4 mt-6">
            <input
              type="text"
              readOnly
              value={shareLink}
              className="w-full border px-3 py-2 rounded text-sm"
            />
            <p className="text-sm text-center text-gray-700">
              Diesen Link können Sie direkt an den Kunden senden
            </p>
            <button
              onClick={() => setMode(null)}
              className="text-sm underline text-[#4B2E2B] hover:text-[#8C3B4A]"
            >
              Zurück zur Auswahl
            </button>
          </div>
        )}
      </div>

      <footer className="absolute bottom-4 text-center text-xs text-white z-10">
        <p>© 2025 JB Finanz AG. Alle Rechte vorbehalten.</p>
      </footer>
    </div>
  );
};

export default VAGStart;
