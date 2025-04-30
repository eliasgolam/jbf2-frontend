
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const WUENSCHE = [
  'fitness', 'familienrabatt', 'preisleistung', 'spitalaufenthalt',
  'digitalservices', 'alternativmedizin', 'brille', 'zahnversicherung'
];

const GESELLSCHAFTEN = [
  'Innova', 'Helsana', 'Sanitas', 'Swica', 'Ökk',
  'Visana', 'Axa', 'CSS', 'Sympany', 'Concordia'
];

const Krankenkassenvergleich = () => {
  const navigate = useNavigate();
  const { bereich } = useParams();
  const [step, setStep] = useState(1);
  const [wuensche, setWuensche] = useState([]);
  const [empfehlungen, setEmpfehlungen] = useState([]);
  const [kombi, setKombi] = useState({});
  const [bewertungDaten, setBewertungDaten] = useState({});
  const [selectedEmpf, setSelectedEmpf] = useState(null);
  const [expanded, setExpanded] = useState(null); // 
  const [personen, setPersonen] = useState(1);
  const [grundkasse, setGrundkasse] = useState('');
  const [grundPraemie, setGrundPraemie] = useState('');
  const [zusatzkasse, setZusatzkasse] = useState('');
  const [zusatzPraemie, setZusatzPraemie] = useState('');


  useEffect(() => {
    const gespeicherte = localStorage.getItem('ausgewählteEmpfehlung');
    if (gespeicherte) setSelectedEmpf(gespeicherte);
  }, []);
  
  
  useEffect(() => {
    const alle = {};
    for (const name of GESELLSCHAFTEN) {
      const raw = localStorage.getItem(`krankenkasse-${name}`);
      if (raw) {
        alle[name] = JSON.parse(raw);
      }
    }
    setBewertungDaten(alle);
  }, []);

  const toggleWunsch = (w) => {
    setWuensche(prev => prev.includes(w) ? prev.filter(x => x !== w) : [...prev, w]);
  };

  const generiereFazit = (name, daten) => {
    if (!daten) return '';
    const lines = wuensche.map(k => {
      const eintrag = daten[k];
      if (!eintrag) return null;
      return `${k.charAt(0).toUpperCase() + k.slice(1)}: ${eintrag.description}`;
    }).filter(Boolean);

    return `Warum ${name} ideal für dich ist:\n\n${lines.join('\n')}\n\nHinweis: Diese Empfehlung basiert auf deinen gewählten Prioritäten.`;
  };

  const calcEmpfehlungen = () => {
    const scores = {};
    const einzel = {};

    Object.entries(bewertungDaten).forEach(([name, data]) => {
      let sum = 0;
      wuensche.forEach(kat => {
        const punktzahl = data[kat]?.points || 0;
        sum += punktzahl;
        if (!einzel[kat] || punktzahl > einzel[kat].punkte) {
          einzel[kat] = { gesellschaft: name, punkte: punktzahl };
        }
      });
      scores[name] = sum;
    });

    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    setEmpfehlungen(sorted.slice(0, 3));


    const spital = 'Innova';
    const zweite = wuensche.find(w => w !== 'spitalaufenthalt');
    const zweiteEmpf = einzel[zweite];
    const kombi = {};
    if (zweiteEmpf) kombi[zweite] = zweiteEmpf;
    kombi['spitalaufenthalt'] = { gesellschaft: spital, punkte: 5 };
    setKombi(kombi);

    localStorage.setItem("aktuelleDaten", JSON.stringify({
      personen,
      grundkasse,
      grundPraemie,
      zusatzkasse,
      zusatzPraemie
    }));
    
    const gespeicherte = localStorage.getItem('ausgewählteEmpfehlung');
    if (gespeicherte) {
      setSelectedEmpf(gespeicherte);
    }

    localStorage.setItem("ausgewaehlteWuensche", JSON.stringify(wuensche));
    // Speichere ausgewählte Wünsche als `selected: true`
Object.entries(bewertungDaten).forEach(([name, data]) => {
  const copy = { ...data };

  wuensche.forEach((w) => {
    if (copy[w]) {
      copy[w].selected = true;
    }
  });

  localStorage.setItem(`krankenkasse-${name}`, JSON.stringify(copy));
});

    setStep(3);
  };

  return (
    <div className="min-h-screen bg-[#F8F5F2] text-[#4B2E2B] font-sans" style={{ backgroundImage: 'url("/wave-bg.jpg")', backgroundSize: 'cover', backgroundAttachment: 'fixed' }}>
      <header className="relative z-10 bg-gradient-to-b from-white via-white/90 to-transparent">
        <div className="max-w-[1100px] h-[160px] mx-auto px-6 flex justify-between items-center" style={{ transform: 'translateY(30%)' }}>
          <div className="flex items-center gap-3 text-sm font-medium">
            <button onClick={() => navigate('/')} className="px-4 py-2 border-2 border-[#4B2E2B] bg-white text-[#4B2E2B] rounded-xl hover:bg-[#f3efec]">ZUR STARTSEITE</button>
            <button className="px-4 py-2 border-2 border-[#4B2E2B] bg-white text-[#4B2E2B] rounded-xl">BEREICH: <span className="font-bold">{bereich?.toUpperCase() || 'UNBEKANNT'}</span></button>
            <button onClick={() => setStep(1)} className="px-4 py-2 bg-[#8C3B4A] text-white border-2 border-[#4B2E2B] rounded-xl flex items-center gap-1">Tool: <span className="font-bold">VERGLEICH</span> <ChevronDown size={16} /></button>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/beratung-starten')} className="hover:opacity-80">
              <img src="/türe.png" alt="Türe Icon" className="h-10 w-10" />
            </button>
            <img src="/logotools.png" alt="Logo" className="h-[250px] object-contain max-w-[240px] mt-[35px]" />
          </div>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-6 py-12">
        {step === 1 && (
          <>
            <h1 className="text-3xl font-semibold mb-6">Was haben Sie aktuell?</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm mb-1">Anzahl Personen</label>
                <input type="number" value={personen} onChange={e => setPersonen(e.target.value)} className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm mb-1">Grundversicherung</label>
                <input type="text" value={grundkasse} onChange={e => setGrundkasse(e.target.value)} className="w-full border rounded p-2" />
                <input type="text" placeholder="Monatliche Prämie" value={grundPraemie} onChange={e => setGrundPraemie(e.target.value)} className="w-full border rounded p-2 mt-2" />
              </div>
              <div>
                <label className="block text-sm mb-1">Zusatzversicherung</label>
                <input type="text" value={zusatzkasse} onChange={e => setZusatzkasse(e.target.value)} className="w-full border rounded p-2" />
                <input type="text" placeholder="Monatliche Prämie" value={zusatzPraemie} onChange={e => setZusatzPraemie(e.target.value)} className="w-full border rounded p-2 mt-2" />
              </div>
            </div>
            <div className="flex justify-end mt-10">
              <button onClick={() => setStep(2)} className="bg-[#8C3B4A] text-white px-6 py-2 rounded-xl shadow hover:bg-[#742e3b]">Weiter</button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-3xl font-semibold mb-6">Was ist Ihnen wichtig für Ihre Gesundheit?</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-10">
              {WUENSCHE.map(w => (
                <button
                  key={w}
                  onClick={() => toggleWunsch(w)}
                  className={`border px-4 py-2 rounded-xl shadow-sm text-sm font-medium capitalize ${wuensche.includes(w) ? 'bg-[#8C3B4A] text-white border-[#8C3B4A]' : 'bg-white text-[#4B2E2B] border-[#ccc]'}`}
                >
                  {w.replace('spitalaufenthalt', 'Spitalaufenthalt').replace(/([a-z])([A-Z])/g, '$1 $2')}
                </button>
              ))}
            </div>
            <div className="flex justify-between mt-10">
              <button onClick={() => setStep(1)} className="text-sm text-[#4B2E2B] underline">Zurück</button>
              <button onClick={calcEmpfehlungen} className="bg-[#8C3B4A] text-white px-6 py-2 rounded-xl shadow hover:bg-[#742e3b]">Weiter</button>
            </div>
          </>
        )}
        
{step === 3 && (
  <div className="space-y-10">
    <h1 className="text-3xl font-semibold mb-4">Unsere Empfehlungen</h1>

    {empfehlungen.slice(0, 3).map(([name], i) => (
  <button
  key={name}
  type="button"
  onClick={() => {
    setSelectedEmpf(name);
    localStorage.setItem('ausgewählteEmpfehlung', name);
  }}
  className={`relative w-full text-left rounded-3xl p-6 shadow-xl border transition-all duration-300 hover:shadow-lg ${
    selectedEmpf === name
      ? 'bg-[#8c3b4a]/10 border-[#8c3b4a] ring-2 ring-[#8c3b4a]/30'
      : 'bg-white border-[#e0dcd5]'
  }`}
>

    <div className="flex items-start gap-6">
      <div className="bg-white border rounded-xl p-2 shadow-sm">
        <img src={`/LogosG/${name}.png`} alt={name} className="h-20 w-auto object-contain" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold mb-2">{i + 1}. Empfehlung: {name}</h2>
          <span
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(expanded === name ? null : name);
            }}
            className="text-[#4B2E2B] text-lg cursor-pointer"
          >
            {expanded === name ? '▲' : '▼'}
          </span>
        </div>
        <pre className="text-sm font-sans leading-relaxed text-[#4B2E2B] whitespace-pre-wrap">
          {generiereFazit(name, bewertungDaten[name])}
        </pre>
        {expanded === name && (
          <div className="mt-4 text-xs text-[#7E6B64]">
            {Object.entries(bewertungDaten[name]).map(([k, v]) => (
              <div key={k}>
                {k.charAt(0).toUpperCase() + k.slice(1)}: {v.description}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </button>
))}


    {/* Kombi-Empfehlung */}
    <div className="bg-white rounded-3xl p-6 shadow-xl border border-[#e0dcd5]">
      <h2 className="text-xl font-bold mb-2">Preisgünstigste Kombinationsmöglichkeit</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {Object.entries(kombi).map(([kat, val]) => {
          const label = kat === 'spitalaufenthalt' ? 'Spitalaufenthalt' : 'Zusatzversicherungen';
          const name = Array.isArray(val)
            ? typeof val[0] === 'object'
              ? val[0].gesellschaft
              : val[0]
            : typeof val === 'object'
            ? val.gesellschaft
            : val;
          return (
            <div key={kat} className="flex items-start gap-4">
              <div className="bg-white border rounded-xl p-2 shadow-sm">
                <img src={`/LogosG/${name}.png`} alt={name} className="h-16 w-auto object-contain" />
              </div>
              <div>
                <p className="text-sm font-semibold">{label}</p>
                <p className="text-xs text-[#7E6B64]">Empfohlen: {name}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="text-xs text-[#7E6B64] mt-2">
        Diese Kombination wurde basierend auf den besten Einzelkategorien zusammengestellt – sie bietet dir eine optimale Mischung aus Leistungen bei günstiger Prämie.
      </div>
    </div>

    <button
      onClick={() => navigate('/priminfo')}
      className="bg-[#4B2E2B] hover:bg-[#8C3B4A] text-white px-6 py-3 rounded-xl text-sm shadow"
    >
      Jetzt Prämienvergleich starten
    </button>
  </div>
)}

      </main>
    </div>
  );
};

export default Krankenkassenvergleich;
