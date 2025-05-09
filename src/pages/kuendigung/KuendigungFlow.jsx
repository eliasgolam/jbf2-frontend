import React, { useState } from 'react';
import KuendigungFormular from './KuendigungFormular';
import RenderKuendigungPDF from './RenderKuendigungPDF';
import { useNavigate } from 'react-router-dom';

const KuendigungFlow = () => {
  const [step, setStep] = useState(0);
  const [antworten, setAntworten] = useState(() => {
    // Lade gespeicherte Daten, falls vorhanden
    let gespeicherteAntworten = {};
try {
  const gespeichert = localStorage.getItem('antworten');
  gespeicherteAntworten = gespeichert ? JSON.parse(gespeichert) : {};
} catch (error) {
  console.warn('⚠️ Fehler beim Parsen von localStorage:', error);
}

return gespeicherteAntworten;

  });
  const [pdfUrl, setPdfUrl] = useState(null);
  const navigate = useNavigate();

  const weiter = () => setStep(step + 1);

  if (step === 0) {
    return (
      <KuendigungFormular
        antworten={antworten}
        setAntworten={(data) => {
          setAntworten(data);
          localStorage.setItem('antworten', JSON.stringify(data));
        }}
        onAbschliessen={weiter}
      />
    );
  }

  if (step === 1) {
    return (
      <RenderKuendigungPDF
        pdfDatei="/Kuendigung.pdf"
        antworten={antworten}
        setAntworten={(data) => {
          setAntworten(data);
          localStorage.setItem('antworten', JSON.stringify(data));
        }}
        onClose={() => navigate('/kuendigung/unterzeichnen')}
        onPDFGenerated={(url) => setPdfUrl(url)}
      />
    );
  }

  return null;
};

export default KuendigungFlow;
