import React, { useState } from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const formatCHF = (value) => {
  if (!value) return '';
  return parseFloat(value.toString().replace(/[^\d.-]/g, '')).toLocaleString('de-CH') + ' CHF';
};

const BeratungAbschliessen = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState({});
  const [vorsorgeExpanded, setVorsorgeExpanded] = useState(false);
  const [individuelleGesellschaften, setIndividuelleGesellschaften] = useState([]);
  const [popup, setPopup] = useState(null);
  const [neueGesellschaft, setNeueGesellschaft] = useState("");
  const [showAddPopup, setShowAddPopup] = useState(false);

  const handleToggle = (key) => setSelected((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleAddCustomGesellschaft = () => {
    setNeueGesellschaft("");
    setShowAddPopup(true);
  };

  const renderPopup = () => {
    if (!popup && !showAddPopup) return null;
    const close = () => {
      setPopup(null);
      setShowAddPopup(false);
    };

    if (showAddPopup) {
      return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold">Eigene Gesellschaft hinzufügen</h2>
            <input
              placeholder="Name der Gesellschaft"
              value={neueGesellschaft}
              onChange={(e) => setNeueGesellschaft(e.target.value)}
              className="w-full border p-2 rounded"
            />
            <div className="flex justify-end gap-2 pt-4">
              <button onClick={close} className="px-4 py-2 border rounded">Abbrechen</button>
              <button
                onClick={() => {
                  if (neueGesellschaft.trim()) {
                    const id = `custom_${Date.now()}`;
                    setIndividuelleGesellschaften([...individuelleGesellschaften, { id, name: neueGesellschaft }]);
                    close();
                  }
                }}
                className="px-4 py-2 bg-[#4B2E2B] text-white rounded"
              >
                Hinzufügen
              </button>
            </div>
          </div>
        </div>
      );
    }

    const commonFields = (
      <>
        <input placeholder="Motiv" className="w-full border p-2 rounded h-24" />
      </>
    );

    if (popup?.type === 'vorsorge') {
      return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-xl space-y-4">
            <h2 className="text-xl font-bold">{popup.name}</h2>
            <select className="w-full border p-2 rounded">
              <option value="3a">Säule 3a</option>
              <option value="3b">Säule 3b</option>
            </select>
            <input placeholder="Prämie" className="w-full border p-2 rounded" onBlur={(e) => e.target.value = formatCHF(e.target.value)} />
            <input placeholder="Erwerbsunfähigkeitsrente" className="w-full border p-2 rounded" onBlur={(e) => e.target.value = formatCHF(e.target.value)} />
            <input placeholder="Durchschnittslücke laut Rentenrechner" className="w-full border p-2 rounded" onBlur={(e) => e.target.value = formatCHF(e.target.value)} />
            <input placeholder="Ungefährer Bezug bei 6%" className="w-full border p-2 rounded" onBlur={(e) => e.target.value = formatCHF(e.target.value)} />
            <textarea placeholder="Vorteile" className="w-full border p-2 rounded h-28" />
            <div className="flex flex-wrap gap-3 pt-2">
              {['Starten oder Warten', 'Kostennutzenrechnung', 'Vorsorgerechner', 'Ersparnis durch Beratung'].map((label) => (
                <label key={label} className="flex items-center gap-2">
                  <input type="checkbox" /> {label}
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <button onClick={close} className="px-4 py-2 border rounded">Abbrechen</button>
              <button onClick={close} className="px-4 py-2 bg-[#4B2E2B] text-white rounded">Speichern</button>
            </div>
          </div>
        </div>
      );
    }

    if (popup?.type === 'sach') {
      return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-xl space-y-4">
            <h2 className="text-xl font-bold">Sachversicherung</h2>
            <input placeholder="Art" className="w-full border p-2 rounded" />
            <input placeholder="Vorherige Versicherung" className="w-full border p-2 rounded" />
            <input placeholder="Neue Versicherung" className="w-full border p-2 rounded" />
            {commonFields}
            <div className="flex justify-end gap-2 pt-4">
              <button onClick={close} className="px-4 py-2 border rounded">Abbrechen</button>
              <button onClick={close} className="px-4 py-2 bg-[#4B2E2B] text-white rounded">Speichern</button>
            </div>
          </div>
        </div>
      );
    }

    if (popup?.type === 'vermoegen') {
      return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-xl space-y-4">
            <h2 className="text-xl font-bold">Vermögensanlage</h2>
            <input placeholder="Bank / Gesellschaft / Verwalter" className="w-full border p-2 rounded" />
            {commonFields}
            <div className="flex flex-wrap gap-3 pt-2">
              {['Sparrechner', 'Starten oder Warten', 'Zinsvergleich'].map((label) => (
                <label key={label} className="flex items-center gap-2">
                  <input type="checkbox" /> {label}
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <button onClick={close} className="px-4 py-2 border rounded">Abbrechen</button>
              <button onClick={close} className="px-4 py-2 bg-[#4B2E2B] text-white rounded">Speichern</button>
            </div>
          </div>
        </div>
      );
    }

    if (popup?.type === 'kinder') {
      return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-xl space-y-4">
            <h2 className="text-xl font-bold">Kinder absichern</h2>
            <input placeholder="Gesellschaft" className="w-full border p-2 rounded" />
            <input placeholder="Prämie" className="w-full border p-2 rounded" onBlur={(e) => e.target.value = formatCHF(e.target.value)} />
            {commonFields}
            <div className="flex flex-wrap gap-3 pt-2">
              {['Sparrechner', 'Starten oder Warten', 'Zinsvergleich'].map((label) => (
                <label key={label} className="flex items-center gap-2">
                  <input type="checkbox" /> {label}
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <button onClick={close} className="px-4 py-2 border rounded">Abbrechen</button>
              <button onClick={close} className="px-4 py-2 bg-[#4B2E2B] text-white rounded">Speichern</button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-cover bg-center text-[#4B2E2B] px-4 py-12 flex items-center justify-center" style={{ backgroundImage: "url('/wave-bg.jpg')" }}>
      <div className="absolute inset-0 bg-[#00000070]" />

      <div className="relative z-10 p-10 sm:p-12 rounded-3xl shadow-2xl w-full max-w-4xl bg-white/80 backdrop-blur-lg">
        <h1 className="text-3xl font-bold text-center text-[#8C3B4A] mb-8">Beratung abschließen</h1>

        <div className="space-y-4">
          <div onClick={() => handleToggle('krankenkasse')} className={`cursor-pointer p-4 border rounded-xl ${selected.krankenkasse ? 'bg-green-100/50' : 'bg-gray-50'}`}>
            Krankenkasse
          </div>

          <div className="border rounded-xl bg-gray-50">
            <div onClick={() => setVorsorgeExpanded(!vorsorgeExpanded)} className="flex items-center justify-between cursor-pointer p-4">
              <span>Vorsorge</span>
              <ChevronDown className={`w-5 h-5 transition-transform ${vorsorgeExpanded ? 'rotate-180' : ''}`} />
            </div>
            {vorsorgeExpanded && (
              <div className="space-y-2 p-4 pt-0">
                {['Generali', 'Liechtenstein Life', 'AXA', 'Helvetia'].map((name) => (
                  <button
                    key={name}
                    onClick={() => setPopup({ type: 'vorsorge', name })}
                    className="w-full text-left px-4 py-2 bg-white rounded-xl border shadow hover:bg-gray-50"
                  >
                    {name}
                  </button>
                ))}
                {individuelleGesellschaften.map(({ id, name }) => (
                  <button
                    key={id}
                    onClick={() => setPopup({ type: 'vorsorge', name })}
                    className="w-full text-left px-4 py-2 bg-white rounded-xl border shadow hover:bg-gray-50"
                  >
                    {name}
                  </button>
                ))}
                <button onClick={handleAddCustomGesellschaft} className="flex items-center gap-2 text-sm text-[#4B2E2B] hover:underline">
                  <Plus className="w-4 h-4" /> Eigene Gesellschaft hinzufügen
                </button>
              </div>
            )}
          </div>

          <div onClick={() => setPopup({ type: 'sach' })} className="cursor-pointer p-4 border rounded-xl bg-gray-50">
            Sachversicherungen
          </div>

          <div onClick={() => setPopup({ type: 'vermoegen' })} className="cursor-pointer p-4 border rounded-xl bg-gray-50">
            Vermögensanlagen
          </div>

          <div onClick={() => setPopup({ type: 'kinder' })} className="cursor-pointer p-4 border rounded-xl bg-gray-50">
            Kinder absichern
          </div>
        </div>

        <div className="mt-10 flex justify-between">
          <button
            onClick={() => navigate('/beratung-abschliessen')}
            className="px-6 py-3 bg-white text-[#4B2E2B] border border-[#4B2E2B] rounded-xl text-sm font-medium shadow hover:bg-gray-50"
          >
            Zurück
          </button>

          <button
            onClick={() => alert('Zusammenfassung wird generiert...')}
            className="px-6 py-3 bg-[#4B2E2B] text-white rounded-xl text-sm font-medium shadow hover:bg-[#3a221f]"
          >
            Zusammenfassung generieren
          </button>
        </div>
      </div>
      {renderPopup()}
    </div>
  );
};

export default BeratungAbschliessen;
