// Finaler AdminDashboard Code mit Optimierungen: zuverlässiges Zurücksetzen, größere Logos, Speichern-Animation
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GESSELLSCHAFTEN = [
  'Axa', 'Innova', 'Concordia', 'Swica', 'Helsana',
  'Visana', 'Sanitas', 'Ökk', 'CSS', 'Sympany'
];

const DEFAULTS_BY_KASSE = {
  Axa: {
    fitness: { type: 'CHF', value: 300 },
    brille: { type: 'CHF', value: 300 },
    alternativmedizin: { type: '%CHF', value: { percent: 75, amount: 3000 } },
    zahnversicherung: { type: '%CHF', value: { percent: 75, amount: 3000 } },
    familienrabatt: { type: '%', value: 20 },
    spitalaufenthalt: { type: 'DROPDOWN', value: 'mittel' },
    preisleistung: { type: 'DROPDOWN', value: 'hoch' }
  },
  Innova: {
    fitness: { type: 'CHF', value: 250 },
    brille: { type: 'CHF', value: 200 },
    alternativmedizin: { type: '%CHF', value: { percent: 75, amount: 3000 } },
    zahnversicherung: { type: '%CHF', value: { percent: 75, amount: 3000 } },
    familienrabatt: { type: '%', value: 0 },
    spitalaufenthalt: { type: 'DROPDOWN', value: 'günstig' },
    preisleistung: { type: 'DROPDOWN', value: 'günstig' }
  },
  Concordia: {
    fitness: { type: 'CHF', value: 200 },
    brille: { type: 'CHF', value: 300 },
    alternativmedizin: { type: '%CHF', value: { percent: 75, amount: 6000 } },
    zahnversicherung: { type: '%CHF', value: { percent: 75, amount: 2000 } },
    familienrabatt: { type: '%', value: 10 },
    spitalaufenthalt: { type: 'DROPDOWN', value: 'mittel' },
    preisleistung: { type: 'DROPDOWN', value: 'hoch' }
  },
  Swica: {
    fitness: { type: 'CHF', value: 1300 },
    brille: { type: 'CHF', value: 900 },
    alternativmedizin: { type: '%CHF', value: { percent: 100, amount: 15000 } },
    zahnversicherung: { type: '%CHF', value: { percent: 75, amount: 4000 } },
    familienrabatt: { type: '%', value: 47 },
    spitalaufenthalt: { type: 'DROPDOWN', value: 'hoch' },
    preisleistung: { type: 'DROPDOWN', value: 'hoch' }
  },
  Helsana: {
    fitness: { type: 'CHF', value: 400 },
    brille: { type: 'CHF', value: 500 },
    alternativmedizin: { type: '%CHF', value: { percent: 75, amount: 5000 } },
    zahnversicherung: { type: '%CHF', value: { percent: 75, amount: 3000 } },
    familienrabatt: { type: '%', value: 25 },
    spitalaufenthalt: { type: 'DROPDOWN', value: 'mittel' },
    preisleistung: { type: 'DROPDOWN', value: 'mittel' }
  },
  Visana: {
    fitness: { type: 'CHF', value: 200 },
    brille: { type: 'CHF', value: 250 },
    alternativmedizin: { type: '%CHF', value: { percent: 90, amount: 10000 } },
    zahnversicherung: { type: '%CHF', value: { percent: 75, amount: 5000 } },
    familienrabatt: { type: '%', value: 50 },
    spitalaufenthalt: { type: 'DROPDOWN', value: 'mittel' },
    preisleistung: { type: 'DROPDOWN', value: 'mittel' }
  },
  Sanitas: {
    fitness: { type: 'CHF', value: 400 },
    brille: { type: 'CHF', value: 600 },
    alternativmedizin: { type: '%CHF', value: { percent: 80, amount: 10000 } },
    zahnversicherung: { type: '%CHF', value: { percent: 80, amount: 5000 } },
    familienrabatt: { type: '%', value: 0 },
    spitalaufenthalt: { type: 'DROPDOWN', value: 'hoch' },
    preisleistung: { type: 'DROPDOWN', value: 'mittel' }
  },
  Ökk: {
    fitness: { type: 'CHF', value: 300 },
    brille: { type: 'CHF', value: 480 },
    alternativmedizin: { type: '%CHF', value: { percent: 80, amount: 10000 } },
    zahnversicherung: { type: '%CHF', value: { percent: 75, amount: 5000 } },
    familienrabatt: { type: '%', value: 50 },
    spitalaufenthalt: { type: 'DROPDOWN', value: 'mittel' },
    preisleistung: { type: 'DROPDOWN', value: 'günstig' }
  },
  CSS: {
    fitness: { type: 'CHF', value: 500 },
    brille: { type: 'CHF', value: 300 },
    alternativmedizin: { type: '%CHF', value: { percent: 75, amount: 2000 } },
    zahnversicherung: { type: '%CHF', value: { percent: 75, amount: 5000 } },
    familienrabatt: { type: '%', value: 25 },
    spitalaufenthalt: { type: 'DROPDOWN', value: 'mittel' },
    preisleistung: { type: 'DROPDOWN', value: 'hoch' }
  },
  Sympany: {
    fitness: { type: 'CHF', value: 300 },
    brille: { type: 'CHF', value: 270 },
    alternativmedizin: { type: '%CHF', value: { percent: 100, amount: 6000 } },
    zahnversicherung: { type: '%CHF', value: { percent: 75, amount: 5000 } },
    familienrabatt: { type: '%', value: 72 },
    spitalaufenthalt: { type: 'DROPDOWN', value: 'mittel' },
    preisleistung: { type: 'DROPDOWN', value: 'hoch' }
  }
};


function calculatePoints(key, value) {
  switch (key) {
    case 'fitness':
    case 'brille':
      return value / 2;
    case 'alternativmedizin':
    case 'zahnversicherung':
      return (value.percent / 100) * value.amount;
    case 'familienrabatt':
      return value * 5;
    case 'spitalaufenthalt':
    case 'preisleistung':
      return value === 'hoch' ? 300 : value === 'mittel' ? 200 : 100;
    case 'digitalservices':
      return value === 'gut' ? 300 : 100;
    default:
      return 0;
  }
}

function generateDescription(key, val) {
  switch (key) {
    case 'fitness': return `Bis zu ${val} CHF für Fitness.`;
    case 'brille': return `Bis zu ${val} CHF für Brillen.`;
    case 'alternativmedizin': return `${val.percent}% bis ${val.amount} CHF für Alternativmedizin.`;
    case 'zahnversicherung': return `${val.percent}% bis ${val.amount} CHF für Zahnbehandlungen.`;
    case 'familienrabatt': return `${parseFloat(val)}% Familienrabatt.`;
    case 'spitalaufenthalt': return `Spitalaufenthalt: ${val}.`;
    case 'preisleistung': return `Preis-Leistung: ${val}.`;
    case 'digitalservices': return `Digitalservices: ${val}.`;
    default: return '';
  }
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Benutzerverwalten');
  const [selectedKasse, setSelectedKasse] = useState(null);
  const [formData, setFormData] = useState(null);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (selectedKasse) {
      loadDataFromBackend();
    }
  }, [selectedKasse]);
  
  const loadDataFromBackend = async () => {
    try {
      const res = await fetch('/api/krankenkassen');
      const result = await res.json();
  
      if (result && result.daten && result.daten[selectedKasse]) {
        setFormData(result.daten[selectedKasse]);
      } else {
        loadInitialForm(); // wenn keine gespeicherten Daten existieren, Standards laden
      }
    } catch (error) {
      console.error('❌ Fehler beim Laden der Krankenkassendaten:', error);
      loadInitialForm(); // falls Fehler, trotzdem Standards laden
    }
  };
  

  const loadInitialForm = (source) => {
    const base = DEFAULTS_BY_KASSE[selectedKasse];
    const enriched = {};
    for (const key in base) {
      const val = base[key];
      enriched[key] = {
        ...val,
        points: calculatePoints(key, val.value),
        description: generateDescription(key, val.type === '%' ? val.value : val.value)
        
      };
    }
    setFormData(source || enriched);
  };

  const handleInputChange = (key, input) => {
    const newData = { ...formData };
    newData[key].value = input;
    newData[key].points = calculatePoints(key, input);
    newData[key].description = generateDescription(key, input);
    setFormData(newData);
    localStorage.setItem(`krankenkasse-${selectedKasse}`, JSON.stringify(newData));
  };

  const handleReset = () => {
    loadInitialForm();
    // NICHTS im Backend löschen beim Reset lokal – später optional einbauen
  };
  
  const handleSave = async () => {
    try {
      await fetch('/api/krankenkassen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [selectedKasse]: formData }),
      });
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 1500);
    } catch (error) {
      console.error('❌ Fehler beim Speichern:', error);
    }
  };
  

  return (
    <div className="min-h-screen bg-cover bg-center text-[#4B2E2B] font-sans" style={{ backgroundImage: 'url(/wave-bg.jpg)' }}>
      {/* HEADER */}
      <header className="relative z-10 bg-gradient-to-b from-white via-white/90 to-transparent">
        <div className="max-w-[1100px] h-[160px] mx-auto px-6 flex justify-between items-center" style={{ transform: 'translateY(30%)' }}>
          <button onClick={() => navigate('/admin-auswahl')} className="px-4 py-2 border-2 border-[#4B2E2B] bg-white text-[#4B2E2B] rounded-xl hover:bg-[#f3efec]">ZURÜCK ZUR AUSWAHL</button>
          <img src="/Logotools.png" alt="Logo" className="h-[250px] object-contain max-w-[240px] mt-[35px]" />
        </div>
      </header>

      {/* NAVIGATION */}
      <div className="flex justify-center mt-10 mb-6">
        <div className="bg-white/70 backdrop-blur-md p-4 rounded-xl shadow flex gap-6">
          <button onClick={() => setActiveTab('Benutzerverwalten')} className={`px-6 py-3 rounded-xl font-semibold ${activeTab==='Benutzerverwalten' ? 'bg-[#8C3B4A] text-white' : 'bg-white text-[#4B2E2B] border border-[#4B2E2B]'}`}>Benutzerverwalten</button>
          <button onClick={() => setActiveTab('Krankenkassenvergleich')} className={`px-6 py-3 rounded-xl font-semibold ${activeTab==='Krankenkassenvergleich' ? 'bg-[#8C3B4A] text-white' : 'bg-white text-[#4B2E2B] border border-[#4B2E2B]'}`}>Krankenkassenvergleich</button>
        </div>
      </div>

      {/* INHALT */}
      <main className="p-6 max-w-6xl mx-auto">
        {activeTab === 'Benutzerverwalten' && <div className="text-center text-lg">Benutzerliste kommt hier hin…</div>}

        {activeTab === 'Krankenkassenvergleich' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {GESSELLSCHAFTEN.map(name => (
              <button key={name} onClick={() => setSelectedKasse(name)}>
                <img src={`/LogosG/${name}.png`} alt={name} className="h-28 w-full object-contain rounded-xl shadow hover:scale-105 transition" />
              </button>
            ))}
          </div>
        )}
      </main>

      {/* POPUP */}
      {selectedKasse && formData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl relative">
            <button onClick={() => setSelectedKasse(null)} className="absolute top-4 right-4 text-xl">✕</button>
            <h2 className="text-2xl font-bold mb-4">{selectedKasse}</h2>
            {Object.entries(formData).map(([key, entry]) => (
              <div key={key} className="flex items-center gap-4 mb-3">
                <div className="w-1/4 font-medium capitalize">{key}</div>
                <div className="w-1/4">
                  {entry.type === 'CHF' && (
                    <input type="number" value={entry.value} onChange={e => handleInputChange(key, parseFloat(e.target.value))} className="w-full border rounded px-2 py-1" />
                  )}
                  {entry.type === '%CHF' && (
                    <div className="flex gap-2">
                      <input type="number" placeholder="%" value={entry.value.percent} onChange={e => handleInputChange(key, { ...entry.value, percent: parseFloat(e.target.value) })} className="w-1/2 border rounded px-2 py-1" />
                      <input type="number" placeholder="CHF" value={entry.value.amount} onChange={e => handleInputChange(key, { ...entry.value, amount: parseFloat(e.target.value) })} className="w-1/2 border rounded px-2 py-1" />
                    </div>
                  )}
                  {entry.type === 'DROPDOWN' && (
                    <select value={entry.value} onChange={e => handleInputChange(key, e.target.value)} className="w-full border rounded px-2 py-1">
                      {['hoch', 'mittel', 'günstig', 'gut', 'schlecht'].map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  )}
                        {entry.type === '%' && (
        <input
          type="number"
          value={entry.value}
          onChange={e => handleInputChange(key, parseFloat(e.target.value))}
          className="w-full border rounded px-2 py-1"
        />
      )}

                </div>
                <div className="w-1/3 text-sm text-gray-700">{entry.description}</div>
                <div className="w-1/6 text-right font-semibold">{entry.points} Pkt</div>
              </div>
            ))}
            <div className="flex justify-between mt-6 items-center">
              <button onClick={handleReset} className="bg-gray-200 px-4 py-2 rounded-xl">Zurücksetzen</button>
              <div className="flex items-center gap-4">
                {showSaved && <span className="text-green-600 font-semibold">✓ Gespeichert</span>}
                <button onClick={handleSave} className="bg-[#8C3B4A] text-white px-6 py-2 rounded-xl">Speichern</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
