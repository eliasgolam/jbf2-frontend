// SPARRECHNER – Final integriert mit edler Containerstruktur & Animation
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const formatNumber = (num) => {
  if (isNaN(num)) return '0 CHF';
  return `${Number(num).toLocaleString('de-CH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  })} CHF`;
};

const Sparrechner = () => {
  const navigate = useNavigate();
  const [ziel, setZiel] = useState('endkapital');
  const [intervall, setIntervall] = useState('monatlich');
  const [anfangskapital, setAnfangskapital] = useState(0);
  const [sparrate, setSparrate] = useState(300);
  const [zinssatz, setZinssatz] = useState(5);
  const [jahre, setJahre] = useState(10);
  const [endkapital, setEndkapital] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [chartKey, setChartKey] = useState(0);
  const [showBereich, setShowBereich] = useState(false);
  const [showTool, setShowTool] = useState(false);
  const [bereichTimeout, setBereichTimeout] = useState(null);
  const [toolTimeout, setToolTimeout] = useState(null);
  const { bereich } = useParams(); // Bereich aus der URL holen (z. B. "kinderabsichern")


  const r = zinssatz / 100;
  const n = jahre;
  const p = intervall === 'monatlich' ? r / 12 : r;
  const z = intervall === 'monatlich' ? n * 12 : n;

  useEffect(() => {
    if (ziel === 'endkapital') {
      let k = anfangskapital;
      for (let i = 1; i <= z; i++) {
        k += sparrate;
        k *= 1 + p;
      }
      setEndkapital(k);
    } else if (ziel === 'sparrate') {
      const f = ((Math.pow(1 + p, z) - 1) / p);
      const result = (endkapital - anfangskapital * Math.pow(1 + p, z)) / f;
      setSparrate(result);
    } else if (ziel === 'jahre') {
      let k = anfangskapital;
      let j = 0;
      while (k < endkapital && j < 1000) {
        j++;
        for (let i = 0; i < (intervall === 'monatlich' ? 12 : 1); i++) {
          k += sparrate;
          k *= 1 + p;
        }
      }
      setJahre(j);
    }

    let kapital = anfangskapital;
    let einzahlungen = 0;
    const daten = [];
    for (let i = 1; i <= z; i++) {
      kapital += sparrate;
      kapital *= 1 + p;
      einzahlungen += sparrate;
      if (intervall === 'monatlich' && i % 12 === 0 || intervall === 'jährlich') {
        daten.push({
          jahr: Math.round(i / (intervall === 'monatlich' ? 12 : 1)),
          kapital: Number(kapital.toFixed(2)),
          einzahlung: Number(einzahlungen.toFixed(2)),
        });
      }
    }
    setChartData([{ jahr: 0, kapital: anfangskapital, einzahlung: 0 }, ...daten]);
    setChartKey(prev => prev + 1);
  }, [ziel, anfangskapital, sparrate, zinssatz, jahre, endkapital, intervall]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5F2] text-[#4B2E2B] font-sans" style={{ backgroundImage: 'url("/wave-bg.jpg")', backgroundSize: 'cover', backgroundAttachment: 'fixed' }}>

      {/* HEADER */}
      <header className="relative z-10 bg-gradient-to-b from-white via-white/90 to-transparent">
        <div className="max-w-[1100px] h-[160px] mx-auto px-6 flex justify-between items-center" style={{ transform: 'translateY(30%)' }}>
          <div className="flex items-center gap-3 text-sm font-medium">
            <button onClick={() => navigate('/')} className="px-4 py-2 border-2 border-[#4B2E2B] bg-white text-[#4B2E2B] rounded-xl hover:bg-[#f3efec]">ZUR STARTSEITE</button>
            <div className="relative" onMouseEnter={() => { if (bereichTimeout) clearTimeout(bereichTimeout); setShowBereich(true); }} onMouseLeave={() => { const timeout = setTimeout(() => setShowBereich(false), 200); setBereichTimeout(timeout); }}>
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
            <div className="relative" onMouseEnter={() => { if (toolTimeout) clearTimeout(toolTimeout); setShowTool(true); }} onMouseLeave={() => { const timeout = setTimeout(() => setShowTool(false), 200); setToolTimeout(timeout); }}>
              <button className="px-4 py-2 bg-[#8C3B4A] text-white border-2 border-[#4B2E2B] rounded-xl flex items-center gap-1">TOOL: <span className="font-bold">SPARRECHNER</span> <ChevronDown size={16} /></button>
              {showTool && (
                <div className="absolute left-0 top-full mt-2 bg-white border rounded shadow z-50 min-w-[180px] text-[#4B2E2B]">
                  <div className="px-4 py-2 hover:bg-[#f8f5f2] cursor-pointer" onClick={() => navigate('/vermoegen/budget')}>Budget</div>
                  <div className="px-4 py-2 hover:bg-[#f8f5f2] cursor-pointer" onClick={() => navigate('/vermoegen/sparrechner')}>Sparrechner</div>
                  <div className="px-4 py-2 hover:bg-[#f8f5f2] cursor-pointer" onClick={() => navigate('/vermoegen/zinsvergleich')}>Zinsvergleich</div>
                  <div className="px-4 py-2 hover:bg-[#f8f5f2] cursor-pointer" onClick={() => navigate('/vermoegen/starten-oder-warten')}>Starten oder warten</div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/beratung-starten')} className="hover:opacity-80">
              <img src="/türe.png" alt="Türe Icon" className="h-10 w-10" />
            </button>
            <img src="/logotools.png" alt="Logo" className="h-[250px] object-contain max-w-[240px] mt-[35px]" />
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="w-full px-6 py-16 max-w-[1100px] mx-auto grid grid-cols-[minmax(0,_560px)_minmax(0,_560px)] gap-10 items-start justify-between">
        {/* Eingabe-Container */}
        <div className="w-full bg-white/90 backdrop-blur p-6 rounded-[1.8rem] shadow-xl border border-[#e5dad2]/70">




          <h2 className="text-xl font-semibold text-[#4B2E2B] mb-6">Eingaben</h2>
          <div className="space-y-5">
            {[{
              key: 'anfangskapital', label: 'Anfangskapital', value: anfangskapital, setter: setAnfangskapital,
            }, {
              key: 'sparrate', label: `Sparrate ${intervall === 'monatlich' ? 'monatlich' : 'jährlich'}`, value: sparrate, setter: setSparrate,
            }, {
              key: 'zinssatz', label: 'Zinssatz %', value: zinssatz, setter: setZinssatz,
            }, {
              key: 'jahre', label: 'Dauer (Jahre)', value: jahre, setter: setJahre,
            }, {
              key: 'endkapital', label: 'Endkapital', value: endkapital, setter: setEndkapital,
            }].map(({ key, label, value, setter }) => (
              <label key={key} className="block">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">{label}</span>
                  <input type="radio" name="ziel" value={key} checked={ziel === key} onChange={() => setZiel(key)} className="h-4 w-4 rounded-full border border-gray-400 accent-[#8C3B4A]" />
                </div>
                <input
                  type="text"
                  inputMode="decimal"
                  disabled={ziel === key}
                  value={ziel === key ? formatNumber(value).replace(' CHF', '') : value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'")}
                  onChange={(e) => {
                    const input = e.target.value.replace(/[^0-9.,']/g, '').replace(/'/g, '').replace(/,/g, '.');
                    const parsed = parseFloat(input);
                    if (!isNaN(parsed)) setter(parsed);
                    else setter(0);
                  }}
                  className={`w-full border border-gray-300 rounded-lg px-4 py-2 shadow-inner focus:ring-2 focus:ring-[#8C3B4A] ${ziel === key ? 'bg-gray-100 text-gray-500' : ''}`}
                />
              </label>
            ))}

            <div className="pt-4">
              <label className="text-sm font-medium block mb-1">Sparintervall</label>
              <select value={intervall} onChange={(e) => setIntervall(e.target.value)} className="w-full border rounded px-4 py-2 shadow focus:ring-2 focus:ring-[#8C3B4A]">
                <option value="monatlich">monatlich</option>
                <option value="jährlich">jährlich</option>
              </select>
            </div>
          </div>
        </div>

        {/* Diagramm-Container */}
        <div className="flex flex-col w-full max-w-[820px]">
          <div className="w-full">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={chartData}
                key={chartKey}
                margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0dcd5" />
                <XAxis dataKey="jahr" tick={{ fontSize: 12 }} label={{ value: 'Jahre', position: 'insideBottomRight', offset: -5 }} />
                <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}'000 CHF`} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => formatNumber(v)} labelFormatter={(v) => `${v}. Jahr`} />
                <Line type="monotone" dataKey="kapital" stroke="#8C3B4A" strokeWidth={3} dot={false} isAnimationActive={true} animationDuration={1200} animationEasing="ease-out" />
                <Line type="monotone" dataKey="einzahlung" stroke="#7E6B64" strokeDasharray="5 5" strokeWidth={2} dot={false} isAnimationActive={true} animationDuration={1200} animationEasing="ease-out" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-sm text-[#4B2E2B] mt-4">Endkapital: <strong>{formatNumber(endkapital)}</strong></p>

{/* Weiter-Button */}
<div className="flex justify-center mt-6">
  <button
    onClick={() => navigate('/vermoegen/tools')}
    className="bg-[#8C3B4A] hover:bg-[#742e3b] text-white px-6 py-2 rounded-xl text-sm font-semibold shadow transition"
  >
    Weiter
  </button>
</div>
</div>
</main>

      <footer className="w-full py-6 text-center text-xs text-[#7E6B64] bg-white/30 backdrop-blur-sm mt-auto">
        © 2025 JB Finanz AG. Alle Rechte vorbehalten.
      </footer>
    </div>
  );
};

export default Sparrechner;