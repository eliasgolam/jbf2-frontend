// FINAL: ThemenContainer.jsx – Jetzt vollständig mit Vertragsabschluss, perfektem Design & PDF-kompatibler Logik

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const gespeicherterKunde = JSON.parse(localStorage.getItem('ausgewaehlterKunde')) || {};


const fragen = {
  allgemein: [
    'Waren Sie mit der Beratung zufrieden?',
    'Wurden alle Fragen vollständig geklärt?',
    'Haben Sie die Angaben wahrheitsgetreu gemacht?',
    'Wurden Sie über Kosten informiert?',
    'Entsprechen die Produkte Ihren Zielen?',
    'Wurden AGB und Produktinfos erklärt?',
    'Wurden Beginn/Dauer/Kündigung besprochen?',
    'Sind Sie sich über die Verbindlichkeit bewusst?'
  ],
  gesundheit: [
    'Wurden Sie über versicherte Risiken informiert?',
    'Wurden mögliche Karenzfristen erklärt?',
    'Wurde ein Überblick über Leistungen gegeben?'
  ],
  vermoegen: [
    'Ist Ihnen der langfristige Anlagehorizont bewusst?',
    'Wissen Sie, dass Anlagen von Faktoren abhängen?',
    'Ist Ihnen Volatilität bei Anlagen bewusst?'
  ],
  sach: [
    'Stimmt das versicherte Risiko mit Ihrem Bedarf überein?'
  ],
  kuendigung: [
    'Der Kunde erlaubt die Weiterleitung',
    'Der Kunde kündigt selbst',
    'Keine Kündigung erforderlich'
  ]
};

const ThemenContainer = ({ antworten, setAntworten, onNext, onBack, onSkip }) => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    anrede: '', vorname: '', nachname: '', geburtsdatum: '', adresse: '', plzOrt: '', telefon: '', email: ''
  });
  
  
  const [themen, setThemen] = useState([]);
  const [gespraechsarten, setGespraechsarten] = useState([]);
  const [vertraege, setVertraege] = useState([{ gesellschaft: '', sparte: '' }, { gesellschaft: '', sparte: '' }, { gesellschaft: '', sparte: '' }]);
  const [vertragsabschluss, setVertragsabschluss] = useState(false);
  const navigate = useNavigate();
  


  const saveAntwortenBackend = async (neueAntworten) => {
    try {
      const user = JSON.parse(localStorage.getItem('loggedInUser'));
      if (!user?.email) return;
      await fetch(`/api/antworten/${user.email}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(neueAntworten)
      });
    } catch (error) {
      console.error('❌ Fehler beim Speichern der Antworten:', error);
    }
  };

  useEffect(() => {
    const gespeicherterKunde = JSON.parse(localStorage.getItem('ausgewaehlterKunde'));
    if (gespeicherterKunde) {
      setForm({
        anrede: gespeicherterKunde.anrede || '',
        vorname: gespeicherterKunde.vorname || '',
        nachname: gespeicherterKunde.nachname || '',
        geburtsdatum: gespeicherterKunde.geburtsdatum || '',
        adresse: gespeicherterKunde.adresse || '',
        plzOrt: gespeicherterKunde.plzOrt || '',
        telefon: gespeicherterKunde.telefon || '',
        email: gespeicherterKunde.email || ''
      });
    }
  }, []);
  

  useEffect(() => {
    const fetchKundendaten = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!user?.email) return;
  
        const res = await fetch(`/api/kunden/${user.email}`);
        if (!res.ok) throw new Error('Fehler beim Abrufen der Kundendaten');
  
        const kunde = await res.json();
  
        const kundendaten = {
          anrede: kunde.anrede || '',
          vorname: kunde.vorname || '',
          nachname: kunde.nachname || '',
          geburtsdatum: kunde.geburtsdatum
            ? new Date(kunde.geburtsdatum).toLocaleDateString('de-CH')
            : '',
          adresse: kunde.adresse || '',
          plzOrt: `${kunde.plz || ''} ${kunde.ort || ''}`.trim(),
          telefon: kunde.telefonnummer || '',
          email: kunde.email || ''
        };
  
        setForm(kundendaten); // füllt die UI-Felder
        const updated = { ...antworten, kundendaten };
        setAntworten(updated); // zentral speichern
        localStorage.setItem('antworten', JSON.stringify(updated)); // optional sichern
        localStorage.setItem('ausgewaehlterKunde', JSON.stringify(kundendaten));

  
      } catch (err) {
        console.error('❌ Fehler beim Laden der Kundendaten:', err);
      }
    };
  
    fetchKundendaten();
  }, []);
  
  
  const handleSkip = () => {
    setStep(3);
  };
  
  const handleBack = () => {
    if (step > 0) {
      setStep(prev => prev - 1);
    } else {
      navigate('/beratung/start');
    }
  };
  
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step === 0) {
      const istFormLeer = Object.values(form).every(v => !v || v.trim() === '');
    
      if (!istFormLeer) {
        const updated = { ...antworten, kundendaten: form };
        setAntworten(updated);
        localStorage.setItem('antworten', JSON.stringify(updated));
        localStorage.setItem('ausgewaehlterKunde', JSON.stringify(form));
        saveAntwortenBackend(updated);
      } else {
        console.warn('⚠️ Kundendaten-Formular ist leer – keine Speicherung');
      }
    }
    
  
    if (step === 1) {
      const updated = {
        ...antworten,
        gespraechsarten,
        themen
      };
      setAntworten(updated);
      saveAntwortenBackend(updated);
      
    }
  
    if (step === 2) {
      const updated = {
        ...antworten,
        vertragsabschluss,
        vertraege,
        fragen: {
          ...antworten.fragen,
          'Wurden Verträge abgeschlossen?': vertragsabschluss ? 'ja' : 'nein'
        }
      };
      setAntworten(updated);
      saveAntwortenBackend(updated);
      
    }
  
    if (step < 3) {
      setStep(prev => prev + 1);
    } else {
      setTimeout(() => {
        onNext();
      }, 100); // kleine Verzögerung, um sicherzustellen, dass State + Speicher fertig sind
    }
    
  };
  

  const toggleAuswahl = (list, setList, value) => {
    setList(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  };

  const handleJaNein = (frage, antwort) => {
    const updated = {
      ...antworten,
      fragen: { ...antworten.fragen, [frage]: antwort }
    };
    setAntworten(updated);
    saveAntwortenBackend(updated);
    
  };

  const updateVertrag = (index, key, value) => {
    const updated = [...vertraege];
    updated[index][key] = value;
    setVertraege(updated);
  };

  const renderFragenBlock = (title, list, motivKey) => (
    <div className="bg-white p-6 rounded-xl shadow space-y-4">
      <h3 className="text-lg font-bold text-[#4B2E2B]">{title}</h3>
      {list.map((frage, idx) => (
        <div key={idx} className="space-y-1">
          <p className="text-sm font-medium">{frage}</p>
          <div className="flex gap-4">
            <button onClick={() => handleJaNein(frage, 'ja')} className={`px-4 py-1 rounded border ${antworten?.fragen?.[frage] === 'ja' ? 'bg-[#8C3B4A]/90 text-white' : ''}`}>Ja</button>
            <button onClick={() => handleJaNein(frage, 'nein')} className={`px-4 py-1 rounded border ${antworten?.fragen?.[frage] === 'nein' ? 'bg-[#8C3B4A]/90 text-white' : ''}`}>Nein</button>
          </div>
        </div>
      ))}
      {motivKey && <textarea onChange={e => {
  const updated = { ...antworten, [motivKey]: e.target.value };
  setAntworten(updated);
  saveAntwortenBackend(updated);
}}
 className="w-full mt-4 border p-2 rounded text-sm" placeholder="Motiv eingeben..." />}
    </div>
  );

  const renderVertragsabschluss = () => (
    <div className="bg-white p-6 rounded-xl shadow space-y-4">
      <h3 className="text-lg font-bold text-[#4B2E2B]">Wurden Verträge abgeschlossen?</h3>
      <div className="flex gap-4">
        <button onClick={() => setVertragsabschluss(true)} className={`px-4 py-1 rounded border ${vertragsabschluss ? 'bg-[#8C3B4A]/90 text-white' : ''}`}>Ja</button>
        <button onClick={() => setVertragsabschluss(false)} className={`px-4 py-1 rounded border ${!vertragsabschluss ? 'bg-[#8C3B4A]/90 text-white' : ''}`}>Nein</button>
      </div>
      {vertragsabschluss && vertraege.map((v, i) => (
        <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input
            placeholder={`Gesellschaft ${i + 1}`}
            value={v.gesellschaft}
            onChange={e => updateVertrag(i, 'gesellschaft', e.target.value)}
            className="border p-2 rounded"
          />
          <input
            placeholder={`Sparte ${i + 1}`}
            value={v.sparte}
            onChange={e => updateVertrag(i, 'sparte', e.target.value)}
            className="border p-2 rounded"
          />
        </div>
      ))}
    </div>
  );

  const renderStep = () => {
    if (step === 0) {
      return (
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <h3 className="text-lg font-bold text-[#4B2E2B]">Kundendaten</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(form).map(([key, value]) => {
  if (key === 'geburtsdatum') {
    return (
      <input
        key={key}
        name={key}
        value={value}
        onChange={e => {
          const newValue = e.target.value;
          const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
          if (dateRegex.test(newValue)) {
            setForm(prev => ({ ...prev, [key]: newValue }));
          } else {
            setForm(prev => ({ ...prev, [key]: newValue })); // erlaubt Tippen trotz falschem Format
          }
        }}
        placeholder="TT.MM.JJJJ"
        className="border p-2 rounded"
      />
    );
  } else {
    return (
      <input
        key={key}
        name={key}
        value={value}
        onChange={handleChange}
        placeholder={key}
        className="border p-2 rounded"
      />
    );
  }
})}

          </div>
        </div>
      );
    } else if (step === 1) {
      return (
        <div className="bg-white p-6 rounded-xl shadow space-y-6">
          <div>
            <h3 className="text-lg font-bold mb-2 text-[#4B2E2B]">Art des Kundengesprächs</h3>
            {['Datenerhebung', 'Beratungsgespräch', 'Servicetermin'].map(opt => (
              <button
                key={opt}
                onClick={() => toggleAuswahl(gespraechsarten, setGespraechsarten, opt)}
                className={`w-full text-left py-2 px-4 border rounded mb-2 ${gespraechsarten.includes(opt) ? 'bg-[#8C3B4A]/90 text-white' : 'bg-gray-50 hover:bg-gray-100'}`}
              >
                {opt}
              </button>
            ))}
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2 text-[#4B2E2B]">Beratungsthemen</h3>
            {['Vorsorge', 'Gesundheitsvorsorge', 'Vermögensanlagen', 'Sach – und Vermögensversicherungen'].map(opt => (
              <button
                key={opt}
                onClick={() => toggleAuswahl(themen, setThemen, opt)}
                className={`w-full text-left py-2 px-4 border rounded mb-2 ${themen.includes(opt) ? 'bg-[#8C3B4A]/90 text-white' : 'bg-gray-50 hover:bg-gray-100'}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      );
    } else if (step === 2) {
      return renderVertragsabschluss();
    } else {
      return (
        <div className="space-y-6">
          {renderFragenBlock('Allgemeine Fragen', fragen.allgemein)}
          {themen.includes('Gesundheitsvorsorge') && renderFragenBlock('Gesundheitsvorsorge', fragen.gesundheit, 'motiv1')}
          {(themen.includes('Vermögensanlagen') || themen.includes('Vorsorge')) &&
  renderFragenBlock('Vermögensanlagen', fragen.vermoegen, 'motiv2')}

          {themen.includes('Sach – und Vermögensversicherungen') && renderFragenBlock('Sachversicherung', fragen.sach, 'motiv3')}
          <div className="bg-white p-6 rounded-xl shadow space-y-2">
            <h3 className="text-lg font-bold text-[#4B2E2B]">Kündigung bestehender Verträge</h3>
            {fragen.kuendigung.map((label, i) => (
              <label key={i} className="flex items-center gap-2">
                <input type="radio" name="kuendigung" onChange={() => setAntworten(prev => ({ ...prev, kuendigung: `Checkbox${i + 1}` }))} />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center px-4 py-10 text-[#4B2E2B] relative" style={{ backgroundImage: "url('/wave-bg.jpg')" }}>
      <div className="absolute inset-0 bg-[#00000040] z-0" />
      <div className="relative z-10 w-full max-w-3xl space-y-6">
        <h1 className="text-2xl font-bold text-center text-white">Beratungsprotokoll ausfüllen</h1>
        {renderStep()}
        <div className="flex justify-between">
        <button onClick={handleBack} className="text-sm underline text-white">Zurück</button>
          <div className="flex gap-4">
          <button onClick={handleSkip} className="text-sm underline text-white">Überspringen</button>
            <button onClick={handleNext} className="px-6 py-2 bg-[#8C3B4A] text-white rounded shadow hover:bg-[#722f3a]">
              {step < 3 ? 'Weiter' : 'Dokument unterschreiben'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemenContainer;