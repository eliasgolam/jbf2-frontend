import React, { useState, useMemo, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

const KuendigungStart = () => {
  const [mode, setMode] = useState(null);
  const token = useMemo(() => uuidv4(), []);
  const shareLink = `${window.location.origin}/kuendigung/formular?token=${token}`;
  const navigate = useNavigate();

  useEffect(() => {
    const autoRedirect = localStorage.getItem('autoRedirect') === 'true';
    const justSaved = sessionStorage.getItem('justSaved') === 'true';
    const status = JSON.parse(localStorage.getItem('protokollStatus')) || {};
    const kunde = JSON.parse(localStorage.getItem('ausgewaehlterKunde'));
    const kundeId = kunde?.email || 'default';
    const abgeschlossen = localStorage.getItem(`kuendigungAbgeschlossen_${kundeId}`) === 'true';
  
    if (abgeschlossen && autoRedirect && !justSaved) {
      navigate('/kuendigung-unterzeichnen');
    }
  }, []);
  
  
  useEffect(() => {
    localStorage.removeItem('autoRedirect');
    sessionStorage.removeItem('justSaved');
  }, []);

  const handleNext = () => {
    const kunde = JSON.parse(localStorage.getItem('ausgewaehlterKunde'));
    const kundeId = kunde?.email || 'default';
    const abgeschlossen = localStorage.getItem(`kuendigungAbgeschlossen_${kundeId}`) === 'true';

    if (abgeschlossen) {
      navigate('/kuendigung-unterzeichnen');
    } else {
      navigate('/kuendigung/formular');
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
          <h1 className="text-3xl font-bold text-[#8C3B4A]">Krankenkasse kündigen</h1>
          <p className="text-sm text-gray-600 mt-1">Wie möchten Sie kündigen?</p>
        </div>

        {/* Auswahlbereich */}
        {!mode && (
          <div className="flex flex-col gap-4">
            <button
              onClick={handleNext}
              className="w-full py-3 bg-[#4B2E2B] text-white rounded-xl text-lg shadow hover:bg-[#3a221f]"
            >
              Direkt hier im Browser ausfüllen
            </button>
            <button
              onClick={handleNext}
              className="w-full py-3 bg-white border border-[#8C3B4A] text-[#8C3B4A] rounded-xl text-lg shadow hover:bg-[#fef1f3]"
            >
              Per QR-Code senden
            </button>
            <button
              onClick={handleNext}
              className="w-full py-3 bg-gray-100 text-[#4B2E2B] rounded-xl text-lg shadow hover:bg-gray-200"
            >
              Link generieren
            </button>
          </div>
        )}

        {/* QR-Code Ansicht */}
        {mode === 'qr' && (
          <div className="flex flex-col items-center gap-4 mt-6">
            <QRCodeSVG value={shareLink} size={180} fgColor="#4B2E2B" />
            <p className="text-sm text-center text-gray-700">
              Scannen Sie diesen Code, um das Kündigungsformular auszufüllen
            </p>
            <button
              onClick={() => setMode(null)}
              className="text-sm underline text-[#4B2E2B] hover:text-[#8C3B4A]"
            >
              Zurück zur Auswahl
            </button>
          </div>
        )}

        {/* Link Ansicht */}
        {mode === 'link' && (
          <div className="flex flex-col items-center gap-4 mt-6">
            <input
              type="text"
              readOnly
              value={shareLink}
              className="w-full border px-3 py-2 rounded text-sm"
            />
            <p className="text-sm text-center text-gray-700">
              Kopieren Sie den Link und senden Sie ihn dem Kunden
            </p>
            <button
              onClick={() => setMode(null)}
              className="text-sm underline text-[#4B2E2B] hover:text-[#8C3B4A]"
            >
              Zurück zur Auswahl
            </button>
          </div>
        )}

        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate('/beratung-abschliessen')}
            className="px-6 py-2 text-sm rounded-full bg-white border border-[#8C3B4A] text-[#8C3B4A] hover:bg-[#fdf1f3] shadow"
          >
            ← Zurück zur Protokoll-Auswahl
          </button>
        </div>
      </div>

      <footer className="absolute bottom-4 text-center text-xs text-white z-10">
        <p>© 2025 JB Finanz AG. Alle Rechte vorbehalten.</p>
      </footer>
    </div>
  );
};

export default KuendigungStart;
