// VAGFlow.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RenderVAG45PDF from './RenderVAG45PDF';

const VAGFlow = () => {
  const navigate = useNavigate();
  const gespeicherteAntworten = JSON.parse(localStorage.getItem('antworten')) || {};
  const [antworten, setAntworten] = useState(gespeicherteAntworten);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [step, setStep] = useState(0);

  const weiter = () => setStep(prev => prev + 1);

  if (step === 0) {
    return (
      <RenderVAG45PDF
        pdfDatei="/Vag45.pdf"
        antworten={antworten}
        setAntworten={(data) => {
          const updated = { ...antworten, ...data };
          setAntworten(updated);
          localStorage.setItem('antworten', JSON.stringify(updated));
        }}
        onClose={() => navigate('/vag-unterzeichnen')}
        onPDFGenerated={(url) => setPdfUrl(url)}
      />
    );
  }

  return null;
};

export default VAGFlow;
