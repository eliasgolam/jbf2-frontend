import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RenderVAG45PDF from './RenderVAG45PDF';

const VAGUnterzeichnen = () => {
  const navigate = useNavigate();
  const gespeicherteAntworten = JSON.parse(localStorage.getItem('antworten')) || {};
  const [antworten, setAntworten] = useState(gespeicherteAntworten);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showViewer, setShowViewer] = useState(false);

  const handleZuruecksetzen = () => {
    const kundenId = antworten?.kundendaten?.kundenId;
    
    // Nur wenn der Kunde gesetzt ist → neuen leeren Zustand setzen
    const leer = kundenId ? { kundendaten: { kundenId } } : {};
  
    localStorage.setItem('antworten', JSON.stringify(leer));
    setAntworten(leer);
    setPdfUrl(null);
    setShowViewer(true);
  };
  
  

  const handleDownload = () => {
    if (!pdfUrl) return;
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = `VAG45_${antworten?.kundendaten?.vorname || 'Kunde'}.pdf`;
    a.click();
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center px-6 text-[#4B2E2B] relative"
      style={{ backgroundImage: "url('/wave-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-[#00000060] z-0" />

      <div className="relative z-10 bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-4xl space-y-6">
        <h1 className="text-2xl font-bold text-center text-[#8C3B4A]">Browser-Unterschrift: VAG 45</h1>

        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          <button
            onClick={handleZuruecksetzen}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#4B2E2B] text-white rounded-xl shadow hover:bg-[#3a221f]"
          >
            🖊️ Formular zurücksetzen
          </button>

          <button
            onClick={() => setShowViewer(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-[#8C3B4A] text-[#8C3B4A] rounded-xl shadow hover:bg-[#fef1f3]"
          >
            <img src="/vollbild.png" alt="Vorschau öffnen" className="h-5 w-5" />
            Vorschau öffnen
          </button>

          <button
            onClick={handleDownload}
            disabled={!pdfUrl}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#fef1f3] text-[#4B2E2B] border border-[#8C3B4A] rounded-xl shadow hover:bg-[#fce8ec]"
          >
            <img src="/datei.png" alt="Download Icon" className="h-5 w-5" />
            PDF exportieren
          </button>

          <button
  onClick={async () => {
    const status = JSON.parse(localStorage.getItem('protokollStatus')) || {};
    status.vag45 = true;
    localStorage.setItem('protokollStatus', JSON.stringify(status));

    const kundenId = antworten?.kundendaten?.kundenId;

    if (kundenId) {
      try {
        await fetch(`https://jbf2-backend.onrender.com/api/kunden/${kundenId}/vag45`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(antworten)
        });
        
      } catch (err) {
        console.error('❌ Fehler beim Speichern im Backend:', err);
      }
    }

    navigate('/vag/start');
  }}
  className="px-6 py-3 bg-[#4B2E2B] text-white rounded-xl shadow hover:bg-[#3a221f]"
>
  Weiter & abschließen
</button>


        </div>

        {showViewer && (
          <div className="relative bg-white rounded-xl shadow-xl p-4 mt-6">
            <RenderVAG45PDF
              pdfDatei="/Vag45.pdf"
              antworten={antworten}
              setAntworten={(data) => {
                const updated = { ...antworten, ...data };
                setAntworten(updated);
                localStorage.setItem('antworten', JSON.stringify(updated));
              }}
              onClose={() => setShowViewer(false)}
              onPDFGenerated={(url) => setPdfUrl(url)}
            />
          </div>
        )}
      </div>

      <footer className="absolute bottom-4 text-center text-xs text-white z-10">
        <p>© 2025 JB Finanz AG. Alle Rechte vorbehalten.</p>
      </footer>
    </div>
  );
};

export default VAGUnterzeichnen;
