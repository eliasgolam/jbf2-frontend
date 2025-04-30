import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wallet, Home, Car, Heart, Plane, Shirt, Users, Banknote, ChevronDown
} from 'lucide-react';
import { useParams } from 'react-router-dom';

const initialCategories = [
  {
    name: 'Einkommen',
    info: 'Nettoeinkünfte, Zulagen, Sonderzahlungen usw.',
    icon: <Wallet size={16} />,
    type: 'income',
    color: 'text-[#4B5A76]', // Ruhiges, kühles Blaugrau
  },
  {
    name: 'Wohnen / Mieten',
    info: 'Miete, NK, Heizung, Hypothek etc.',
    icon: <Home size={16} />,
    type: 'expense',
    color: 'text-[#A44343]', // Dezentes Bordeaux
  },
  {
    name: 'Steuern',
    info: 'Einkommenssteuer, Kirchensteuer etc.',
    icon: <Banknote size={16} />,
    type: 'expense',
    color: 'text-[#A44343]',
  },
  {
    name: 'Mobilität (Auto und ÖV)',
    info: 'Auto, ÖV, Tanken, Versicherungen',
    icon: <Car size={16} />,
    type: 'expense',
    color: 'text-[#A44343]',
  },
  {
    name: 'Versicherungen',
    info: 'Kranken-, Lebens-, Sachversicherungen',
    icon: <Heart size={16} />,
    type: 'expense',
    color: 'text-[#A44343]',
  },
  {
    name: 'Lebenshaltungskosten',
    info: 'Nahrung, Kleidung, Haushalt etc.',
    icon: <Shirt size={16} />,
    type: 'expense',
    color: 'text-[#A44343]',
  },
  {
    name: 'Hobby, Soziales, Kultur',
    info: 'Freizeit, Vereinsbeiträge, Events',
    icon: <Users size={16} />,
    type: 'expense',
    color: 'text-[#A44343]',
  },
  {
    name: 'Reisen und Urlaub',
    info: 'Ferien & Ausflüge',
    icon: <Plane size={16} />,
    type: 'expense',
    color: 'text-[#A44343]',
  },
];

const Budget = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(initialCategories);
  const [values, setValues] = useState(() => {
    const saved = localStorage.getItem('budgetValues');
    return saved ? JSON.parse(saved) : {};
  });
  const [showBereich, setShowBereich] = useState(false);
  const [showTool, setShowTool] = useState(false);
  const { bereich } = useParams();


  const anzeigeBereich = bereich ? bereich.toUpperCase() : 'UNBEKANNT';


 
  const [customRows, setCustomRows] = useState([]);

const addCustomRow = () => {
  if (customRows.length < 3) {
    setCustomRows([...customRows, { label: '', kunde: '', familie: '' }]);
  }
};

  const [customCategory, setCustomCategory] = useState({
    label: '',
    kunde: '',
    familie: '',
  });
  
  const updateValue = (cat, key, val) => {
    const numeric = parseFloat(val) || 0;
    const updated = {
      ...values,
      [cat]: {
        ...(values[cat] || {}),
        [key]: numeric,
      },
    };
    setValues(updated);
    localStorage.setItem('budgetValues', JSON.stringify(updated));
  };

  const calcSum = (cat) => {
    const v = values[cat] || {};
    return (v.kunde || 0) + (v.familie || 0);
  };

  const total = categories.reduce(
    (acc, cat) => {
      const sum = calcSum(cat.name);
      if (cat.type === 'income') acc.einkommen += sum;
      else acc.ausgaben += sum;
      return acc;
    },
    { einkommen: 0, ausgaben: 0 }
  );

  const customSum = (parseFloat(customCategory.kunde) || 0) + (parseFloat(customCategory.familie) || 0);
const verfuegbar = total.einkommen - total.ausgaben - customSum;


  return (
    <div className="min-h-screen bg-[#F8F5F2] text-[#4B2E2B] font-sans" style={{ backgroundImage: 'url("/wave-bg.jpg")', backgroundSize: 'cover', backgroundAttachment: 'fixed' }}>
      {/* HEADER */}
      <header className="relative z-10 bg-gradient-to-b from-white via-white/90 to-transparent">
        <div className="max-w-[1100px] h-[160px] mx-auto px-6 flex justify-between items-center" style={{ transform: 'translateY(30%)' }}>
          {/* Navigation links */}
          <div className="flex items-center gap-3 text-sm font-medium">
            <button onClick={() => navigate('/')} className="px-4 py-2 border-2 border-[#4B2E2B] bg-white text-[#4B2E2B] rounded-xl hover:bg-[#f3efec]">
              ZUR STARTSEITE
            </button>

            <div className="relative">
            <button className="px-4 py-2 border-2 border-[#4B2E2B] bg-white text-[#4B2E2B] rounded-xl flex items-center gap-1">
  BEREICH: <span className="font-bold">{bereich?.toUpperCase() || 'UNBEKANNT'}</span>
</button>
              {showBereich && (
                <div className="absolute left-0 top-full mt-2 bg-white border rounded shadow z-50 min-w-[180px]">
                  <div className="px-4 py-2 hover:bg-[#f8f5f2] cursor-pointer" onClick={() => navigate('/vorsorge/tools')}>Vorsorge</div>
                  <div className="px-4 py-2 hover:bg-[#f8f5f2] cursor-pointer" onClick={() => navigate('/immobilien')}>Immobilien</div>
                  <div className="px-4 py-2 hover:bg-[#f8f5f2] cursor-pointer" onClick={() => navigate('/lebenstandard/tools')}>Lebenstandard</div>
                  <div className="px-4 py-2 hover:bg-[#f8f5f2] cursor-pointer" onClick={() => navigate('/kinderabsichern')}>Kinder absichern</div>
                  <div className="px-4 py-2 hover:bg-[#f8f5f2] cursor-pointer" onClick={() => navigate('/krankenkasse/tools')}>Gesundheit</div>
                </div>
              )}
            </div>

            <div className="relative">
              <button onClick={() => setShowTool(!showTool)} className="px-4 py-2 bg-[#8C3B4A] text-white border-2 border-[#4B2E2B] rounded-xl hover:bg-[#742e3b] flex items-center gap-1">
                Tool: <span className="font-bold">BUDGET</span> <ChevronDown size={16} />
              </button>
              {showTool && (
                <div className="absolute left-0 top-full mt-2 bg-white border rounded shadow z-50 text-[#4B2E2B] min-w-[180px]">
                  <div className="px-4 py-2 hover:bg-[#f8f5f2] cursor-pointer" onClick={() => navigate('/vermoegen/budget')}>Budget</div>
                  <div className="px-4 py-2 hover:bg-[#f8f5f2] cursor-pointer" onClick={() => navigate('/vermoegen/sparrechner')}>Sparrechner</div>
                  <div className="px-4 py-2 hover:bg-[#f8f5f2] cursor-pointer" onClick={() => navigate('/vermoegen/zinsvergleich')}>Zinsvergleich</div>
                  <div className="px-4 py-2 hover:bg-[#f8f5f2] cursor-pointer" onClick={() => navigate('/vermoegen/starten-oder-warten')}>Starten oder warten</div>
                </div>
              )}
            </div>
          </div>

          {/* Logo + Türe */}
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/beratung-starten')} className="hover:opacity-80">
              <img src="/türe.png" alt="Türe Icon" className="h-10 w-10" />
            </button>
            <img src="/logotools.png" alt="Logo" className="h-[250px] object-contain max-w-[240px] mt-[35px]" />
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-[1100px] mx-auto px-6 py-12">
  <h1 className="text-3xl font-semibold mb-8 tracking-tight text-[#4B2E2B]">Mein Budget</h1>

  <div className="overflow-hidden rounded-3xl shadow-2xl border border-[#e6dfd9] bg-white/95 backdrop-blur-md">
    <table className="min-w-full text-sm">
      <thead className="bg-[#f4f1ee] border-b border-[#e0dcd5]">
        <tr className="text-xs font-semibold text-left text-[#4B2E2B]">
          <th className="px-6 py-4">Kategorie</th>
          <th className="px-6 py-4 text-center">Kunde</th>
          <th className="px-6 py-4 text-center">Familie</th>
          <th className="px-6 py-4 text-right">Gesamt</th>
        </tr>
      </thead>

      <tbody>
        {categories.map((cat, idx) => {
          const v = values[cat.name] || {};
          const sum = calcSum(cat.name);
          return (
            <tr key={idx} className="border-b border-[#f0ebe7] hover:bg-[#f9f7f6] transition">
              <td className="px-6 py-4 align-top">
                <div className={`flex items-center gap-2 font-bold ${cat.color}`}>
                  {cat.icon} {cat.name} <span className="text-xs font-normal ml-1">monatlich</span>
                </div>
                <div className="text-xs text-[#7E6B64] mt-1 leading-snug italic">{cat.info}</div>
              </td>
              <td className="px-6 py-4 text-center align-middle">
                <input
                  type="number"
                  className="w-20 text-right border border-gray-300 rounded-md px-2 py-1 bg-white shadow-inner focus:ring-2 focus:ring-[#8C3B4A]"
                  value={v.kunde || ''}
                  onChange={(e) => updateValue(cat.name, 'kunde', e.target.value)}
                />
              </td>
              <td className="px-6 py-4 text-center align-middle">
                <input
                  type="number"
                  className="w-20 text-right border border-gray-300 rounded-md px-2 py-1 bg-white shadow-inner focus:ring-2 focus:ring-[#8C3B4A]"
                  value={v.familie || ''}
                  onChange={(e) => updateValue(cat.name, 'familie', e.target.value)}
                />
              </td>
              <td className="px-6 py-4 text-right font-bold text-[#4B2E2B] bg-[#f7f3ef]">
                {sum.toLocaleString()} CHF
              </td>
            </tr>
          );
        })}

        {customRows.map((row, i) => (
          <tr key={`custom-${i}`} className="border-t border-[#eeeae7] bg-white/90">
            <td className="px-6 py-4 text-[#A44343] font-semibold">
              <input
                type="text"
                placeholder={`Ausgabe ${i + 1}`}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#8C3B4A]"
                value={row.label}
                onChange={(e) => {
                  const updated = [...customRows];
                  updated[i].label = e.target.value;
                  setCustomRows(updated);
                }}
              />
            </td>
            <td className="px-6 py-4 text-center">
              <input
                type="number"
                className="w-20 text-right border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-[#8C3B4A]"
                value={row.kunde}
                onChange={(e) => {
                  const updated = [...customRows];
                  updated[i].kunde = e.target.value;
                  setCustomRows(updated);
                }}
              />
            </td>
            <td className="px-6 py-4 text-center">
              <input
                type="number"
                className="w-20 text-right border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-[#8C3B4A]"
                value={row.familie}
                onChange={(e) => {
                  const updated = [...customRows];
                  updated[i].familie = e.target.value;
                  setCustomRows(updated);
                }}
              />
            </td>
            <td className="px-6 py-4 text-right font-bold text-[#4B2E2B] bg-[#f4f1ee]">
              {((parseFloat(row.kunde) || 0) + (parseFloat(row.familie) || 0)).toLocaleString()} CHF
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* + Button */}
    {customRows.length < 3 && (
      <div className="flex justify-start px-6 py-4 border-t border-[#eeeae7]">
        <button
          onClick={addCustomRow}
          className="text-[#A44343] text-sm font-medium hover:underline flex items-center gap-2"
        >
          <span className="text-lg">＋</span> Eigene Ausgabe hinzufügen
        </button>
      </div>
    )}
  </div>

  {/* Verfügbar */}
  <div className="flex justify-end mt-6">
    <div className="bg-white border border-[#e0dcd5] text-[#4B2E2B] font-semibold px-6 py-3 rounded-xl shadow text-sm">
      Verfügbar: {verfuegbar.toLocaleString()} CHF
    </div>
  </div>

  {/* Navigation */}
  <div className="flex justify-between items-center mt-10">
    <button
      onClick={() => navigate(-1)}
      className="bg-[#E7E2DD] hover:bg-[#d5cec7] text-[#4B2E2B] px-6 py-2 rounded-xl text-sm font-medium shadow transition"
    >
      Zurück
    </button>
    <button
      onClick={() => navigate('/vermoegen/tools')}
      className="bg-[#8C3B4A] hover:bg-[#742e3b] text-white px-6 py-2 rounded-xl text-sm font-semibold shadow transition"
    >
      Weiter
    </button>
  </div>
</main>

    </div>
  );
};

export default Budget;