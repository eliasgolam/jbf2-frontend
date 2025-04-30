import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import MandatPDFViewer from './MandatPDFViewer';

const Mandatsauswahl = () => {
  const location = useLocation();
  const vertraege = location.state?.vertraege || [];
  const [auswahl, setAuswahl] = useState([]);
  const [showQR, setShowQR] = useState(false);
  const [viewerStep, setViewerStep] = useState(null); // <== geändert
  const [signedPdfUrl, setSignedPdfUrl] = useState(null);
  const [handySignaturDaten, setHandySignaturDaten] = useState(null);
  const navigate = useNavigate();
  const [kunde, setKunde] = useState(null);

  


  const beraterName = JSON.parse(localStorage.getItem('loggedInUser'))?.username || 'Max Muster';
  const profilbild = '/default-profile.png';

  const toggleVertrag = (vertrag) => {
    setAuswahl((prev) =>
      prev.includes(vertrag)
        ? prev.filter((v) => v !== vertrag)
        : [...prev, vertrag]
    );
  };

  const handleBestätigen = () => {
    if (auswahl.length > 0) {
      setShowQR(true);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const daten = localStorage.getItem('mandatSignaturVomHandy');
      if (daten) {
        try {
          const parsed = JSON.parse(daten);
          if (parsed.signatureURL && parsed.ort && parsed.datum) {
            setHandySignaturDaten(parsed);
            clearInterval(interval);
          }
        } catch (e) {
          console.error('Fehler beim Parsen der Signaturdaten', e);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const kunde = JSON.parse(localStorage.getItem('ausgewaehlterKunde'));
    if (kunde?.id || kunde?.email) {
      const key = `mandat_pdf_${kunde.id || kunde.email}`;
      const gespeichertesBase64 = localStorage.getItem(key);
      if (gespeichertesBase64) {
        setSignedPdfUrl(gespeichertesBase64); // direkt als iframe anzeigen
      }
    }
  }, []);
  
  useEffect(() => {
    const fetchKunde = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!user) return;
  
        const res = await fetch(`/api/kunden/${user.email}`);
        const kundenListe = await res.json();
        if (kundenListe.length > 0) {
          setKunde(kundenListe[0]); // ersten Kunden übernehmen (später evtl. Auswahl)
        }
      } catch (error) {
        console.error('❌ Fehler beim Laden des Kunden:', error);
      }
    };
  
    fetchKunde();
  }, []);
  
  return (
    <div className="relative min-h-screen flex flex-col bg-[#F8F5F2]" style={{ backgroundImage: 'url("/wave-bg.jpg")', backgroundSize: 'cover', backgroundAttachment: 'fixed' }}>
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

      <main className="flex-grow px-4 sm:px-6 md:px-10 max-w-6xl mx-auto w-full -mt-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#4B2E2B] text-center mb-6">Welche Verträge möchtest du mandatieren?</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {vertraege.map((vertrag, i) => (
            <div
              key={i}
              onClick={() => toggleVertrag(vertrag)}
              className={`cursor-pointer border-2 rounded-lg px-4 py-3 transition text-sm hover:bg-[#f4eeee] ${
                auswahl.includes(vertrag) ? 'border-[#8C3B4A] bg-[#fdf2f4]' : 'border-gray-300 bg-white'
              }`}
            >
              <strong className="text-[#8C3B4A]">{vertrag.produkt}</strong><br />
              {vertrag.gesellschaft}<br />
              Pol.-Nr.: {vertrag.vertragsnummer}<br />
              Ablauf: {vertrag.ablauf}
            </div>
          ))}
        </div>

        {!showQR && auswahl.length > 0 && (
          <div className="flex justify-center">
            <button
              onClick={handleBestätigen}
              className="bg-[#8C3B4A] text-white px-6 py-3 rounded-xl hover:bg-[#722f3a] transition"
            >
              Bestätigen
            </button>
          </div>
        )}

{showQR && viewerStep === null && (
  <>
    <div className="mt-10 text-center">
      <h3 className="text-xl font-bold text-[#4B2E2B] mb-4">Mandat unterzeichnen</h3>
      <p className="mb-2 text-sm">
        Scanne den QR-Code mit deinem Handy oder unterzeichne direkt hier im Browser.
      </p>
      <QRCodeSVG
        value="http://localhost:3000/mandat/signieren"
        size={180}
        fgColor="#8C3B4A"
        bgColor="#ffffff"
        className="mx-auto mb-4 shadow-md"
      />
      <div>
        <button
          onClick={() => setViewerStep('viewer')} // direkt öffnen
          className="text-sm underline text-[#722f3a] hover:text-[#4B2E2B]"
        >
          Stattdessen hier im Browser unterzeichnen
        </button>
      </div>
    </div>

    {/* Zurück-Button bündig mit Vertragskarten-Container */}
    <div className="mt-6 px-4 sm:px-6 md:px-10 flex justify-between">
  <button
    onClick={() => navigate('/vertrag-erfassen')}
    className="bg-gray-200 text-[#4B2E2B] px-5 py-2 rounded-xl hover:bg-[#8C3B4A] hover:text-white text-sm transition"
  >
    ← Zurück
  </button>
  <button
    onClick={() => navigate('/beratungs-menue')}
    className="bg-[#8C3B4A] text-white px-5 py-2 rounded-xl hover:bg-[#722f3a] text-sm transition"
  >
    Abschließen →
  </button>
</div>

  </>
)}

  

{signedPdfUrl ? (
  <div className="mt-8 flex justify-center">
    <iframe
      src={signedPdfUrl}
      className="w-full h-[90vh] border rounded-xl shadow"
      title="Mandat PDF Vorschau"
    />
  </div>
) : viewerStep === 'viewer' && (
  <div className="mt-8">
    {
      (() => {
        const mappedVertraege = auswahl.map((v, i) => {

          const vertragsObjekt = {
            gesellschaft: v.gesellschaft || v.anbieter || '[FEHLT]',
            produkt: v.produkt || v.produktname || '[FEHLT]'
          };
          console.log(`Vertrag ${i + 1}:`, vertragsObjekt);
          return vertragsObjekt;
        });

        return (
          <MandatPDFViewer
            kunde={{ ...JSON.parse(localStorage.getItem('ausgewaehlterKunde')) }}
            vertraege={mappedVertraege}
            berater={{ name: beraterName }}
            onClose={() => setViewerStep(null)}
            onPDFGenerated={async (url) => {
              setSignedPdfUrl(url);

              const kunde = JSON.parse(localStorage.getItem('ausgewaehlterKunde'));
              if (kunde?.id || kunde?.email) {
                const key = `mandat_pdf_${kunde.id || kunde.email}`;
                const response = await fetch(url);
                const blob = await response.blob();
                const reader = new FileReader();
                reader.onloadend = () => {
                  const base64 = reader.result;
                  localStorage.setItem(key, base64);
                };
                reader.readAsDataURL(blob);
              }
            }}
          />
        );
      })()
    }
  </div>
)}


      </main>

      <footer className="w-full flex-shrink-0 flex justify-center items-center py-4 bg-white/10 backdrop-blur-sm mt-auto">
        <p className="text-xs text-gray-700 tracking-wide">© 2025 JB Finanz AG. Alle Rechte vorbehalten.</p>
      </footer>
    </div>
  );
};

export default Mandatsauswahl;
