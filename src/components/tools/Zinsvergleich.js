// FINALER ZINSVERGLEICH – Im Sparrechner-Stil mit animiertem mehrfarbigem Diagramm
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import {
  AreaChart,
  Area,
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

const calculateCompoundInterest = (initial, monthly, rate, years, interval, mode) => {
  const periods = interval === 'monatlich' ? years * 12 : years;
  const ratePerPeriod = rate / (interval === 'monatlich' ? 12 : 1) / 100;
  let total = initial;
  const data = [{ jahr: 0, [`zins${rate}`]: initial }];

  for (let i = 1; i <= periods; i++) {
    if (mode === 'vorschüssig') total += monthly;
    total *= 1 + ratePerPeriod;
    if (mode === 'nachschüssig') total += monthly;

    if ((interval === 'monatlich' && i % 12 === 0) || interval === 'jährlich') {
      const jahr = interval === 'monatlich' ? i / 12 : i;
      data.push({ jahr, [`zins${rate}`]: Number(total.toFixed(2)) });
    }
  }
  return { total: Number(total.toFixed(2)), data };
};

const Zinsvergleich = () => {
  const navigate = useNavigate();
  const [initial, setInitial] = useState(10000);
  const [monthly, setMonthly] = useState(100);
  const [interval, setInterval] = useState('monatlich');
  const [mode, setMode] = useState('vorschüssig');
  const [years, setYears] = useState(20);
  const [rate1, setRate1] = useState(1);
  const [rate2, setRate2] = useState(3);
  const [rate3, setRate3] = useState(5);
  const [chartKey, setChartKey] = useState(0);
  const [showBereich, setShowBereich] = useState(false);
  const [showTool, setShowTool] = useState(false);
  const [bereichTimeout, setBereichTimeout] = useState(null);
  const [toolTimeout, setToolTimeout] = useState(null);
  const { bereich } = useParams(); // Bereich aus der URL holen (z. B. "kinderabsichern")
  const rates = [rate1, rate2, rate3];
  const colors = ['#FF8C00', '#003366', '#50C878'];

  const results = useMemo(() => {
    const merged = new Map();
    const allResults = rates.map((rate) => {
      const result = calculateCompoundInterest(initial, monthly, rate, years, interval, mode);
      result.data.forEach((point) => {
        if (!merged.has(point.jahr)) merged.set(point.jahr, { jahr: point.jahr });
        merged.get(point.jahr)[`zins${rate}`] = point[`zins${rate}`];
      });
      return { rate, total: result.total };
    });
    setChartKey((prev) => prev + 1);
    return { chartData: Array.from(merged.values()), allResults };
  }, [initial, monthly, interval, mode, years, rate1, rate2, rate3]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5F2] text-[#4B2E2B] font-sans" style={{ backgroundImage: 'url("/wave-bg.jpg")', backgroundSize: 'cover', backgroundAttachment: 'fixed' }}>

      {/* HEADER */}
      <header className="relative z-10 bg-gradient-to-b from-white via-white/90 to-transparent">
        <div
          className="max-w-[1100px] h-[160px] mx-auto px-6 flex justify-between items-center"
          style={{ transform: "translateY(30%)" }}
        >
          <div className="flex items-center gap-3 text-sm font-medium">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 border-2 border-[#4B2E2B] bg-white text-[#4B2E2B] rounded-xl hover:bg-[#f3efec]"
            >
              ZUR STARTSEITE
            </button>

            {/* Bereich */}
            <div
              className="relative"
              onMouseEnter={() => {
                if (bereichTimeout) clearTimeout(bereichTimeout);
                setShowBereich(true);
              }}
              onMouseLeave={() => {
                const timeout = setTimeout(() => setShowBereich(false), 200);
                setBereichTimeout(timeout);
              }}
            >
            <button className="px-4 py-2 border-2 border-[#4B2E2B] bg-white text-[#4B2E2B] rounded-xl flex items-center gap-1">
  BEREICH: <span className="font-bold">{bereich?.toUpperCase() || 'UNBEKANNT'}</span>
</button>
              {showBereich && (
                <div className="absolute left-0 top-full mt-2 bg-white border rounded shadow z-50 min-w-[180px]">
                  <div
                    className="px-4 py-2 hover:bg-[#f8f5f2] cursor-pointer"
                    onClick={() => navigate("/vorsorge/tools")}
                  >
                    Vorsorge
                  </div>
                  <div
                    className="px-4 py-2 hover:bg-[#f8f5f2] cursor-pointer"
                    onClick={() => navigate("/immobilien")}
                  >
                    Immobilien
                  </div>
                  <div
                    className="px-4 py-2 hover:bg-[#f8f5f2] cursor-pointer"
                    onClick={() => navigate("/lebenstandard/tools")}
                  >
                    Lebenstandard
                  </div>
                  <div
                    className="px-4 py-2 hover:bg-[#f8f5f2] cursor-pointer"
                    onClick={() => navigate("/kinderabsichern")}
                  >
                    Kinder absichern
                  </div>
                  <div
                    className="px-4 py-2 hover:bg-[#f8f5f2] cursor-pointer"
                    onClick={() => navigate("/krankenkasse/tools")}
                  >
                    Gesundheit
                  </div>
                </div>
              )}
            </div>

            {/* Tool */}
            <div
              className="relative"
              onMouseEnter={() => {
                if (toolTimeout) clearTimeout(toolTimeout);
                setShowTool(true);
              }}
              onMouseLeave={() => {
                const timeout = setTimeout(() => setShowTool(false), 200);
                setToolTimeout(timeout);
              }}
            >
              <button className="px-4 py-2 bg-[#8C3B4A] text-white border-2 border-[#4B2E2B] rounded-xl flex items-center gap-1">
                TOOL: <span className="font-bold">ZINSVERGLEICH</span>{" "}
                <ChevronDown size={16} />
              </button>
              {showTool && (
                <div className="absolute left-0 top-full mt-2 bg-white border rounded shadow z-50 min-w-[180px] text-[#4B2E2B]">
                  <div
                    className="px-4 py-2 hover:bg-[#f8f5f2] cursor-pointer"
                    onClick={() => navigate("/vermoegen/budget")}
                  >
                    Budget
                  </div>
                  <div
                    className="px-4 py-2 hover:bg-[#f8f5f2] cursor-pointer"
                    onClick={() => navigate("/vermoegen/sparrechner")}
                  >
                    Sparrechner
                  </div>
                  <div
                    className="px-4 py-2 hover:bg-[#f8f5f2] cursor-pointer"
                    onClick={() => navigate("/vermoegen/zinsvergleich")}
                  >
                    Zinsvergleich
                  </div>
                  <div
                    className="px-4 py-2 hover:bg-[#f8f5f2] cursor-pointer"
                    onClick={() => navigate("/vermoegen/starten-oder-warten")}
                  >
                    Starten oder warten
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/beratung-starten")}
              className="hover:opacity-80"
            >
              <img
                src="/türe.png"
                alt="Türe Icon"
                className="h-10 w-10"
              />
            </button>
            <img
              src="/logotools.png"
              alt="Logo"
              className="h-[250px] object-contain max-w-[240px] mt-[35px]"
            />
          </div>
        </div>
      </header>
      {/* CONTENT */}
      <main className="w-full px-6 py-16 max-w-[1100px] mx-auto grid grid-cols-[minmax(0,_560px)_minmax(0,_560px)] gap-10 items-start justify-between">
        {/* Eingabe-Container */}
        <div className="w-full bg-white/90 backdrop-blur p-6 rounded-[1.8rem] shadow-xl border border-[#e5dad2]/70 space-y-4">
          {[{ key: 'initial', label: 'Anfangskapital', value: initial, setter: setInitial }, { key: 'monthly', label: 'Sparrate', value: monthly, setter: setMonthly }].map(({ key, label, value, setter }) => (
            <label key={key} className="block">
              <span className="text-sm font-medium">{label}</span>
              <input
                type="number"
                value={value}
                onChange={(e) => setter(Number(e.target.value))}
                className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 shadow-inner focus:ring-2 focus:ring-[#8C3B4A]"
              />
            </label>
          ))}

          {[{ label: 'Zinssatz 1', value: rate1, setter: setRate1 }, { label: 'Zinssatz 2', value: rate2, setter: setRate2 }, { label: 'Zinssatz 3', value: rate3, setter: setRate3 }].map(({ label, value, setter }, i) => (
            <label key={label} className="block">
              <span className="text-sm font-medium">{label}</span>
              <input
                type="number"
                value={value}
                onChange={(e) => setter(Number(e.target.value))}
                className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 shadow-inner focus:ring-2 focus:ring-[#8C3B4A]"
              />
            </label>
          ))}

          <label className="text-sm font-medium block">Sparintervall</label>
          <select value={interval} onChange={(e) => setInterval(e.target.value)} className="w-full border rounded px-4 py-2 shadow focus:ring-2 focus:ring-[#8C3B4A]">
            <option value="monatlich">monatlich</option>
            <option value="jährlich">jährlich</option>
          </select>

          <label className="text-sm font-medium block">Einzahlungsart</label>
          <select value={mode} onChange={(e) => setMode(e.target.value)} className="w-full border rounded px-4 py-2 shadow focus:ring-2 focus:ring-[#8C3B4A]">
            <option value="vorschüssig">vorschüssig</option>
            <option value="nachschüssig">nachschüssig</option>
          </select>

          <label className="block">Laufzeit: {years} Jahre</label>
          <input type="range" min={1} max={40} value={years} onChange={(e) => setYears(+e.target.value)} className="w-full" />
        </div>

        {/* Diagramm-Container */}
        <div className="flex flex-col w-full max-w-[820px]">
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart
              key={chartKey}
              data={results.chartData}
              margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
              stackOffset="none"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0dcd5" />
              <XAxis dataKey="jahr" tick={{ fontSize: 12 }} label={{ value: 'Jahre', position: 'insideBottomRight', offset: -5 }} />
              <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}'000 CHF`} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => formatCurrency(v)} labelFormatter={(v) => `${v}. Jahr`} />
              <Legend verticalAlign="top" height={36} />
              {rates.map((rate, i) => (
                <Area
                  key={rate}
                  type="monotone"
                  dataKey={`zins${rate}`}
                  name={`Zins ${rate}%`}
                  stroke={colors[i]}
                  fill={colors[i]}
                  strokeWidth={2}
                  isAnimationActive={true}
                  animationDuration={1200}
                  animationEasing="ease-out"
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>

          <div className="mt-6 space-y-2 text-sm text-[#4B2E2B]">
            {results.allResults.map((r, i) => (
              <div key={i}>Endkapital mit Zinssatz {r.rate}%: <strong>{formatCurrency(r.total)}</strong></div>
            ))}
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
      </main>

      <footer className="w-full py-6 text-center text-xs text-[#7E6B64] bg-white/30 backdrop-blur-sm mt-auto">
        © 2025 JB Finanz AG. Alle Rechte vorbehalten.
      </footer>
    </div>
  );
};

export default Zinsvergleich;