import React, { useState } from 'react';
import ThemenContainer from './ThemenContainer';
import RenderBeratungsprotokoll from './RenderBeratungsprotokoll';
import { useNavigate } from 'react-router-dom';





const BeratungsFlow = () => {
  const [step, setStep] = useState(0);
  const [antworten, setAntworten] = useState({});
  const [showPDF, setShowPDF] = useState(false);
  const [ortDatum, setOrtDatum] = useState('');
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);


  const weiter = () => {
    if (step >= 3) {
      setShowPDF(true);
    } else {
      setStep(s => s + 1);
    }
  };  
  const zurueck = () => {
    if (step > 0) setStep(step - 1);
  };
  
  const skip = () => {
    if (step < 3) setStep(step + 1);
  };
  

  if (showPDF) {
    return (
      <>
        <RenderBeratungsprotokoll
          pdfDatei="/JBFBP.pdf"
          antworten={antworten}
          setAntworten={setAntworten}
          onClose={() => navigate('/browserunterzeichnen')}
          onPDFGenerated={(url) => console.log('PDF generiert:', url)}
          isFullscreen={isFullscreen}
        />
      </>
    );
  }
  
  
  

  return (
    <ThemenContainer
      antworten={antworten}
      setAntworten={setAntworten}
      onNext={weiter}
      onBack={zurueck}
      onSkip={skip}
    />
  );
};

export default BeratungsFlow;
