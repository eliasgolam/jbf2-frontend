import React, { useRef, useState } from 'react';
import SignaturePad from 'react-signature-canvas';
import { useNavigate } from 'react-router-dom';

const SignaturSeite = () => {
  const signPadRef = useRef();
  const [ort, setOrt] = useState('');
  const [datum, setDatum] = useState('');
  const navigate = useNavigate();

  const handleSpeichern = () => {
    try {
      const signatureURL = signPadRef.current
        ? signPadRef.current.getTrimmedCanvas().toDataURL('image/png')
        : null;

      const signaturDaten = {
        ort,
        datum,
        signatureURL,
      };

      localStorage.setItem('mandatSignaturVomHandy', JSON.stringify(signaturDaten));
      alert('Signatur & Daten gespeichert ✅');
      navigate('/');
    } catch (error) {
      console.error('Fehler beim Speichern der Signatur:', error);
      alert('Unterschrift konnte nicht gespeichert werden. Bitte erneut versuchen.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-[#F8F5F2]">
      <h1 className="text-2xl font-bold text-[#4B2E2B] mb-6">📱 Mandat unterzeichnen</h1>

      <div className="bg-white rounded-xl shadow p-6 w-full max-w-md">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Ort</label>
          <input
            type="text"
            value={ort}
            onChange={(e) => setOrt(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Ort eingeben"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Datum</label>
          <input
            type="date"
            value={datum}
            onChange={(e) => setDatum(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Unterschrift (Finger/Touch)</label>
          <SignaturePad
            ref={signPadRef}
            canvasProps={{ width: 300, height: 150, className: 'border rounded' }}
          />
          <button
            onClick={() => signPadRef.current.clear()}
            className="text-sm text-red-600 mt-2 hover:underline"
          >
            Löschen
          </button>
        </div>

        <button
          onClick={handleSpeichern}
          className="w-full bg-[#8C3B4A] text-white py-2 px-4 rounded hover:bg-[#722f3a]"
        >
          Speichern & Zurück
        </button>
      </div>
    </div>
  );
};

export default SignaturSeite;
