import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RenderBeratungsprotokoll from './RenderBeratungsprotokoll';

const BrowserUnterzeichnen = () => {
  const navigate = useNavigate();

  const [antworten, setAntworten] = useState({});
  const [ortDatum, setOrtDatum] = useState('');
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showViewer, setShowViewer] = useState(false);

  const handleZuruecksetzen = () => {
    localStorage.removeItem('antworten');
    navigate('/beratung');
  };

  const handleDownload = () => {
    if (!pdfUrl) return;
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = `Beratungsprotokoll_${antworten?.kundendaten?.vorname || 'Kunde'}.pdf`;
    a.click();
  };

  const handleWeiter = () => {
    navigate('/beratung-abschliessen');
  };

  useEffect(() => {
    const fetchAntworten = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!user) return;
  
        const res = await fetch(`/api/antworten/${user.email}`);
        if (!res.ok) throw new Error('Fehler beim Laden der Antworten.');
  
        const gespeicherteAntworten = await res.json();
        setAntworten(gespeicherteAntworten);
      } catch (error) {
        console.error('❌ Fehler beim Abrufen der Antworten:', error);
      }
    };
  
    fetchAntworten();
  }, []);
  

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center px-6 text-[#4B2E2B] relative"
      style={{ backgroundImage: "url('/wave-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-[#00000060] z-0" />

      <div className="relative z-10 bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-4xl space-y-6">
        <h1 className="text-2xl font-bold text-center text-[#8C3B4A]">Browser-Unterschrift & Kontrolle</h1>

  <div className="grid sm:grid-cols-2 gap-4 mt-6">
  {/* Fragen zurücksetzen */}
  <button
    onClick={handleZuruecksetzen}
    className="flex items-center justify-center gap-2 px-6 py-3 bg-[#4B2E2B] text-white rounded-xl shadow hover:bg-[#3a221f]"
  >
    🖊️ Fragen neu beantworten
  </button>

  {/* Vorschau öffnen */}
  <button
    onClick={() => setShowViewer(true)}
    className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-[#8C3B4A] text-[#8C3B4A] rounded-xl shadow hover:bg-[#fef1f3]"
  >
    <img src="/vollbild.png" alt="Vorschau öffnen" className="h-5 w-5" />
    Vorschau öffnen
  </button>

  {/* Download Button */}
  <button
    onClick={handleDownload}
    disabled={!pdfUrl}
    className="flex items-center justify-center gap-2 px-6 py-3 bg-[#fef1f3] text-[#4B2E2B] border border-[#8C3B4A] rounded-xl shadow hover:bg-[#fce8ec]"
  >
    <img src="/datei.png" alt="Download Icon" className="h-5 w-5" />
    PDF exportieren
  </button>

  <div className="flex justify-end mt-6">
  <button
  onClick={() => {
    const status = JSON.parse(localStorage.getItem('protokollStatus')) || {};
    status.beratungsprotokoll = true;
    localStorage.setItem('protokollStatus', JSON.stringify(status));
    localStorage.setItem('prozessAbgeschlossen', 'true');
    navigate('/beratung-abschliessen');
  }}
  className="px-6 py-3 bg-[#4B2E2B] text-white rounded-xl shadow hover:bg-[#3a221f]"
>
  Weiter & abschließen
</button>

</div>
</div>



        {showViewer && (
          <div className="relative bg-white rounded-xl shadow-xl p-4 mt-6">
        <RenderBeratungsprotokoll
  pdfDatei="/JBFBP.pdf"
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

export default BrowserUnterzeichnen;

