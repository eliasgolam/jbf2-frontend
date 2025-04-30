// STARTEN ODER WARTEN – Final mit Mastercode-Header, präziser Wartezeit-Logik & Animation
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const formatCurrency = (num) => {
  if (isNaN(num)) return '0 CHF';
  return `${Number(num).toLocaleString('de-CH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  })} CHF`;
};

const calculateGrowth = (initial, monthly, rate, years, interval, mode) => {
  const periods = interval === 'monatlich' ? years * 12 : years;
  const ratePerPeriod = rate / (interval === 'monatlich' ? 12 : 1) / 100;
  let total = initial;
  const data = [];

  for (let i = 0; i <= periods; i++) {
    if (i > 0) {
      if (mode === 'vorschüssig') total += monthly;
      total *= 1 + ratePerPeriod;
      if (mode === 'nachschüssig') total += monthly;
    }

    if (interval === 'monatlich' && i % 12 === 0 || interval === 'jährlich') {
      data.push({ jahr: i / (interval === 'monatlich' ? 12 : 1), value: Number(total.toFixed(2)) });
    }
  }

  return { total: Number(total.toFixed(2)), data };
};

const StartenOderWarten = () => {
  const navigate = useNavigate();
  const [initial, setInitial] = useState(10000);
  const [monthly, setMonthly] = useState(500);
  const [rate, setRate] = useState(5);
  const [years, setYears] = useState(40);
  const [waitYears, setWaitYears] = useState(5);
  const [interval, setInterval] = useState('monatlich');
  const [mode, setMode] = useState('vorschüssig');
  const [showBereich, setShowBereich] = useState(false);
  const [showTool, setShowTool] = useState(false);
  const [bereichTimeout, setBereichTimeout] = useState(null);
  const [toolTimeout, setToolTimeout] = useState(null);
  const [chartKey, setChartKey] = useState(0);
  const { bereich } = useParams(); // Bereich aus der URL holen (z. B. "kinderabsichern")

  const sofort = useMemo(() => calculateGrowth(initial, monthly, rate, years, interval, mode), [initial, monthly, rate, years, interval, mode]);

  const warten = useMemo(() => {
    const ohneWartezeit = calculateGrowth(initial, 0, rate, waitYears, interval, mode);
    const wartenTeil = calculateGrowth(ohneWartezeit.total, monthly, rate, years - waitYears, interval, mode);

    const fullData = sofort.data.map((point) => {
      const jahr = point.jahr;
      const wartenPoint = wartenTeil.data.find((p) => p.jahr === jahr - waitYears);
      return {
        jahr,
        sofort: point.value,
        warten: jahr >= waitYears ? wartenPoint?.value ?? null : null,
      };
    });

    setChartKey(prev => prev + 1);

    return {
      total: wartenTeil.total,
      data: fullData,
    };
  }, [initial, monthly, rate, years, waitYears, interval, mode, sofort.data]);

  const diff = sofort.total - warten.total;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5F2] text-[#4B2E2B] font-sans" style={{ backgroundImage: 'url("/wave-bg.jpg")', backgroundSize: 'cover', backgroundAttachment: 'fixed' }}>

      {/* HEADER (aus Mastercode) */}
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
              <button className="px-4 py-2 bg-[#8C3B4A] text-white border-2 border-[#4B2E2B] rounded-xl flex items-center gap-1">TOOL: <span className="font-bold">STARTEN ODER WARTEN</span> <ChevronDown size={16} /></button>
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
      <main className="w-full px-6 py-16 max-w-[1100px] mx-auto flex flex-col md:flex-row gap-8 items-start justify-between">

        {/* Eingabe-Container */}
        <div className="w-full md:w-1/2 bg-white/90 backdrop-blur p-5 rounded-2xl shadow-xl border border-[#e5dad2]/70 space-y-4">

          <h2 className="text-xl font-semibold text-[#4B2E2B] mb-6">Eingaben</h2>
          <div className="space-y-5">
            {[{
              key: 'initial', label: 'Anfangskapital', value: initial, setter: setInitial,
            }, {
              key: 'monthly', label: 'Sparrate', value: monthly, setter: setMonthly,
            }, {
              key: 'rate', label: 'Zinssatz %', value: rate, setter: setRate,
            }].map(({ key, label, value, setter }) => (
              <label key={key} className="block">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">{label}</span>
                </div>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setter(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-inner focus:ring-2 focus:ring-[#8C3B4A]"
                />
              </label>
            ))}

            <div>
              <label className="text-sm font-medium block mb-1">Sparintervall</label>
              <select value={interval} onChange={(e) => setInterval(e.target.value)} className="w-full border rounded px-4 py-2 shadow focus:ring-2 focus:ring-[#8C3B4A]">
                <option value="monatlich">monatlich</option>
                <option value="jährlich">jährlich</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Einzahlungsart</label>
              <select value={mode} onChange={(e) => setMode(e.target.value)} className="w-full border rounded px-4 py-2 shadow focus:ring-2 focus:ring-[#8C3B4A]">
                <option value="vorschüssig">vorschüssig</option>
                <option value="nachschüssig">nachschüssig</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Laufzeit: {years} Jahre</label>
              <input type="range" min={5} max={50} value={years} onChange={(e) => setYears(+e.target.value)} className="w-full" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Wartezeit: {waitYears} Jahre</label>
              <input type="range" min={0} max={years - 1} value={waitYears} onChange={(e) => setWaitYears(+e.target.value)} className="w-full" />
            </div>
          </div>
        </div>

        {/* Diagramm-Container */}
   {/* Diagramm-Container */}
   <div className="w-full md:w-1/2 flex flex-col gap-6">

  <div className="w-full">
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        key={chartKey}
        data={warten.data}
        margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0dcd5" />
        <XAxis dataKey="jahr" label={{ value: 'Jahre', position: 'insideBottomRight', offset: -5 }} tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}'000 CHF`} tick={{ fontSize: 12 }} />
        <Tooltip formatter={(v) => formatCurrency(v)} labelFormatter={(v) => `${v}. Jahr`} />
        <Legend verticalAlign="top" height={36} />

        <Line
          type="monotone"
          dataKey="sofort"
          name="Sofort starten"
          stroke="#8C3B4A"
          strokeWidth={3}
          dot={false}
          isAnimationActive={true}
          animationDuration={1200}
          animationEasing="ease-out"
        />
        {waitYears > 0 && (
          <Line
            type="monotone"
            dataKey="warten"
            name={`Später starten ab Jahr ${waitYears}`}
            stroke="#7E6B64"
            strokeDasharray="5 5"
            strokeWidth={3}
            dot={false}
            isAnimationActive={true}
            animationDuration={1200}
            animationEasing="ease-out"
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  </div>

  {/* Ergebnistext inkl. hervorgehobener Differenz */}
  <div className="p-4 rounded-xl bg-white/90 backdrop-blur border border-[#e5dad2] shadow-inner text-sm text-[#4B2E2B] space-y-2">

  <div className="flex justify-between">
    <span>Ertrag bei sofortigem Start:</span>
    <strong>{formatCurrency(sofort.total)}</strong>
  </div>
  <div className="flex justify-between">
    <span>Ertrag bei Start in {waitYears} Jahren:</span>
    <strong>{formatCurrency(warten.total)}</strong>
  </div>

  <div className="mt-3 px-4 py-2 rounded-xl bg-[#f3efec] text-[#8C3B4A] font-semibold border border-[#8C3B4A]/30 shadow-inner text-center">
    💡 Differenz: {formatCurrency(diff)}
  </div>
</div>
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

export default StartenOderWarten;