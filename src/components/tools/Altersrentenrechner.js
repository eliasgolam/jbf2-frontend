import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LabelList } from 'recharts';




// AHV Skala (gekürzt zur Übersicht – später kannst du alles einfügen)
const ahvSkala = [
  { lohn: 15120, rente: 1260 },
  { lohn: 16632, rente: 1293 },
  { lohn: 18144, rente: 1326 },
  { lohn: 19656, rente: 1358 },
  { lohn: 21168, rente: 1391 },
  { lohn: 22680, rente: 1424 },
  { lohn: 24192, rente: 1457 },
  { lohn: 25704, rente: 1489 },
  { lohn: 27216, rente: 1522 },
  { lohn: 28728, rente: 1555 },
  { lohn: 30240, rente: 1588 },
  { lohn: 31752, rente: 1620 },
  { lohn: 33264, rente: 1653 },
  { lohn: 34776, rente: 1686 },
  { lohn: 36288, rente: 1719 },
  { lohn: 37800, rente: 1751 },
  { lohn: 39312, rente: 1784 },
  { lohn: 40824, rente: 1817 },
  { lohn: 42336, rente: 1850 },
  { lohn: 43848, rente: 1882 },
  { lohn: 45360, rente: 1915 },
  { lohn: 46872, rente: 1935 },
  { lohn: 48384, rente: 1956 },
  { lohn: 49896, rente: 1976 },
  { lohn: 51408, rente: 1996 },
  { lohn: 52920, rente: 2016 },
  { lohn: 54432, rente: 2036 },
  { lohn: 55944, rente: 2056 },
  { lohn: 57456, rente: 2076 },
  { lohn: 58968, rente: 2097 },
  { lohn: 60480, rente: 2117 },
  { lohn: 61992, rente: 2137 },
  { lohn: 63404, rente: 2157 },
  { lohn: 64916, rente: 2177 },
  { lohn: 66428, rente: 2197 },
  { lohn: 67940, rente: 2218 },
  { lohn: 69452, rente: 2238 },
  { lohn: 70964, rente: 2258 },
  { lohn: 72476, rente: 2278 },
  { lohn: 73988, rente: 2298 },
  { lohn: 75500, rente: 2318 },
  { lohn: 77012, rente: 2339 },
  { lohn: 78524, rente: 2359 },
  { lohn: 80036, rente: 2379 },
  { lohn: 81548, rente: 2399 },
  { lohn: 83060, rente: 2419 },
  { lohn: 84572, rente: 2439 },
  { lohn: 86084, rente: 2460 },
  { lohn: 87596, rente: 2480 },
  { lohn: 89108, rente: 2500 },
  { lohn: 90620, rente: 2520 },
];


// AHV Rente berechnen - Nächsthöherer Lohn aus der Skala
const berechneAhvRente = (brutto) => {
  for (let i = 0; i < ahvSkala.length; i++) {
    if (brutto <= ahvSkala[i].lohn) {
      return ahvSkala[i].rente * 12; // 💡 Jahreswert zurückgeben
    }
  }
  return ahvSkala[ahvSkala.length - 1].rente * 12;
};

const formatCurrency = (amount) => {
    return amount?.toLocaleString('de-CH', { style: 'currency', currency: 'CHF' }).replace('CHF', "'CHF");
  };
  

// Balken-Stil dynamisch berechnen
const visualisierungBalken = (wert, maxWert) => ({
  width: maxWert ? `${(wert / maxWert) * 100}%` : '0%',
  padding: '10px',
  marginRight: '5px',
  backgroundColor: '#dfe7dd',
  borderRadius: '6px',
  transition: 'width 0.4s ease-in-out',
});





const Altersrentenrechner = () => {
  const navigate = useNavigate();
  const { bereich, tool } = useParams();
  const [showBereich, setShowBereich] = useState(false);
  const [showTool, setShowTool] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    vorname: '',
    geburtsdatum: '',
    zivilstand: '',
    kinder: '',
    bruttoLohn: '',
    lohnzuwachs: '',
    guthabenBeiRentenbeginn: 0, // Sicherstellen, dass es initialisiert ist!
    benoetigtesEinkommen: '', // Benötigtes Einkommen in der Pension
  });
  
  

const chartRef = useRef(null);
const [showCharts, setShowCharts] = useState(false);


  const [ahvRente, setAhvRente] = useState(null);
  const [gesamtRente, setGesamtRente] = useState(null);
  const [luecke, setLuecke] = useState(null);
  const eintrittsalter = parseInt(formData.eintrittsalter);
  const [gesamtluecke, setGesamtluecke] = useState(null);
  const jahreBisRente = 65 - eintrittsalter;
  const benoetigt = Math.max(parseFloat(formData.benoetigtesEinkommen) || 0, 1);



  const handleBerechnen = () => {
    const brutto = parseFloat(formData.bruttoLohn) || 0;
    const guthabenBeiRentenbeginn = parseFloat(formData.guthabenBeiRentenbeginn) || 0;
    const benoetigtMonatlich = parseFloat(formData.benoetigtesEinkommen) || 0;
  
    // Berechnung der AHV-Rente
    const ahv = berechneAhvRente(brutto);
  
    // Gesamte Rentenberechnung: AHV-Rente für 20 Jahre + Pensionskassenkapital
    const gesamtRente = (ahv * 20) + guthabenBeiRentenbeginn;
  
    // Berechnung des benötigten Einkommens über 20 Jahre
    const benoetigtJaehrlich = benoetigtMonatlich * 12 * 20;
  
    // Berechnung der monatlichen Lücke
    const monatlicheLuecke = benoetigtMonatlich - (gesamtRente / 12);
  
    // Berechnung der Gesamtlücke bis 85 Jahre (20 Jahre ab 65)
    const gesamtluecke = monatlicheLuecke * 12 * 20;
  
    // Zustände setzen
    setAhvRente(ahv);
    setGesamtRente(gesamtRente);
    setLuecke(monatlicheLuecke);
    setGesamtluecke(gesamtluecke);
  
    setAnimationKey((prev) => prev + 1);
    setShowCharts(true);
  };
  
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    // Entfernen von nicht-numerischen Zeichen und Leerzeichen
    let formattedValue = value.replace(/[^0-9]/g, '');
  
    // Formatieren der Zahl
    if (formattedValue) {
      formattedValue = parseInt(formattedValue).toLocaleString('de-CH');
    }
  
    // Wenn der Benutzer etwas eingegeben hat, wird es im richtigen Format gesetzt
    setFormData((prevState) => ({
      ...prevState,
      [name]: formattedValue,
    }));
  };
  
  
  

  return (
    <div className="min-h-screen text-[#4B2E2B] font-sans" style={{ backgroundImage: 'url("/wave-bg.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <header className="relative z-10 bg-gradient-to-b from-white via-white/90 to-transparent">
        <div className="max-w-[1100px] h-[160px] mx-auto px-6 flex justify-between items-center" style={{ transform: 'translateY(30%)' }}>
          {/* Navigation links */}
          <div className="flex items-center gap-3 text-sm font-medium">
            <button onClick={() => navigate('/')} className="px-4 py-2 border-2 border-[#4B2E2B] bg-white text-[#4B2E2B] rounded-xl hover:bg-[#f3efec]">
              ZUR STARTSEITE
            </button>

            <div className="relative">
  <button onClick={() => setShowBereich(!showBereich)} className="px-4 py-2 border-2 border-[#4B2E2B] bg-white text-[#4B2E2B] rounded-xl flex items-center gap-1">
    BEREICH: <span className="font-bold">{bereich?.toUpperCase() || 'LEBENSTANDARD'}</span>
  </button>
  {showBereich && (
    <div className="absolute left-0 top-full mt-2 bg-white border rounded shadow z-50 min-w-[180px]">
      <div className="px-4 py-2 hover:bg-[#f8f5f2] cursor-pointer" onClick={() => navigate('/vorsorge/ivrechner')}>Vorsorge</div>
      <div className="px-4 py-2 hover:bg-[#f8f5f2] cursor-pointer" onClick={() => navigate('/immobilien/ivrechner')}>Immobilien</div>
      <div className="px-4 py-2 hover:bg-[#f8f5f2] cursor-pointer" onClick={() => navigate('/lebenstandard/ivrechner')}>Lebenstandard</div>
      <div className="px-4 py-2 hover:bg-[#f8f5f2] cursor-pointer" onClick={() => navigate('/kinderabsichern/ivrechner')}>Kinder absichern</div>
      <div className="px-4 py-2 hover:bg-[#f8f5f2] cursor-pointer" onClick={() => navigate('/gesundheit/ivrechner')}>Gesundheit</div>
    </div>
  )}
</div>


            <div className="relative">
              <button onClick={() => setShowTool(!showTool)} className="px-4 py-2 bg-[#8C3B4A] text-white border-2 border-[#4B2E2B] rounded-xl hover:bg-[#742e3b] flex items-center gap-1">
                Tool: <span className="font-bold">BUDGET</span> <FaChevronDown size={16} />
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
      <main className="max-w-[1100px] mx-auto px-6 py-12">
  <h1 className="text-3xl font-semibold mb-8 tracking-tight text-[#4B2E2B]">Altersrentenrechner</h1>

  <div className="overflow-hidden rounded-3xl shadow-2xl border border-[#e6dfd9] bg-white/95 backdrop-blur-md p-6">
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-[#4B2E2B]">Persönliche Angaben</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#4B2E2B]">Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#8C3B4A]" />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#4B2E2B]">Vorname</label>
          <input type="text" name="vorname" value={formData.vorname} onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#8C3B4A]" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#4B2E2B]">Geburtsdatum</label>
          <input type="date" name="geburtsdatum" value={formData.geburtsdatum} onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#8C3B4A]" />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#4B2E2B]">Zivilstand</label>
          <select name="zivilstand" value={formData.zivilstand} onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#8C3B4A]">
            <option value="">Bitte wählen</option>
            <option value="ledig">Ledig</option>
            <option value="verheiratet">Verheiratet</option>
            <option value="geschieden">Geschieden</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#4B2E2B]">Anzahl Kinder</label>
          <input type="number" name="kinder" value={formData.kinder} onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#8C3B4A]" />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#4B2E2B]">Bruttolohn</label>
          <input type="number" name="bruttoLohn" value={formData.bruttoLohn} onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#8C3B4A]" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#4B2E2B]">Lohnzuwachs p.a.</label>
        <select name="lohnzuwachs" value={formData.lohnzuwachs} onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#8C3B4A]">
          <option value="">0% p.a</option>
          <option value="1">1% p.a.</option>
          <option value="2">2% p.a.</option>
          <option value="3">3% p.a.</option>
          <option value="4">4% p.a.</option>
          <option value="5">5% p.a.</option>
        </select>
      </div>

      <h2 className="text-xl font-semibold text-[#4B2E2B] mt-8">Pensionskassendaten</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#4B2E2B]">Guthaben bei Rentenbeginn</label>
          <input
  type="number"
  name="guthabenBeiRentenbeginn"
  value={formData.guthabenBeiRentenbeginn}  // Bindung an den State
  onChange={handleInputChange}
  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#8C3B4A]"
/>


        </div>

        <div>
  <label className="block text-sm font-medium text-[#4B2E2B]">Benötigtes Einkommen in der Pension (monatlich)</label>
  <input
    type="number"
    name="benoetigtesEinkommen"
    value={formData.benoetigtesEinkommen}
    onChange={handleInputChange}
    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#8C3B4A]"
  />
</div>

      </div>

      {/* Der Schieberegler für Eintrittsalter wird entfernt */}
      {/* Keine weiteren Felder für Eintrittsalter */}
    </div>
  </div>

  {/* Berechnen Button */}
  <div className="mt-8">
    <button onClick={handleBerechnen} className="bg-[#8C3B4A] hover:bg-[#742e3b] text-white px-6 py-2 rounded-xl text-sm font-semibold shadow transition">
      Berechnen
    </button>
  </div>


  {showCharts && (
  <div ref={chartRef}>
<div className="mt-12 p-6 bg-white rounded-2xl border shadow flex flex-col md:flex-row gap-8 items-start">
  <div className="flex-1 text-sm text-[#4B2E2B] space-y-1">
    <h2 className="text-xl font-semibold mb-4">Berechnung der Altersrente</h2>
    <p>AHV-Rente: {formatCurrency(ahvRente)}</p>
<p>Pensionskassen-Guthaben bei Rentenbeginn: {formatCurrency(formData.guthabenBeiRentenbeginn)}</p>
<p className="mt-2 font-bold text-[#2E7D32]">Gesamtrente: {formatCurrency(gesamtRente)}</p>
<p className="mt-2 font-bold text-red-700">Monatliche Lücke: {formatCurrency(luecke)}</p>
<p className="text-lg font-bold text-red-700">Gesamtlücke bis 85: {formatCurrency(gesamtluecke)}</p>

  </div>

  {/* Rechte Spalte: Chart */}
  <div className="flex-1 w-full">
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        key={animationKey}
        data={[{ Rente: luecke || 0, GesamtRente: gesamtRente }]}  // Hier stellen wir sicher, dass es ein Array ist
        layout="vertical"
        margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
        barGap={10}
      >
        <XAxis
          type="number"
          domain={[0, benoetigt]} // Maximaler Wert = benötoigtes Einkommen
          tickFormatter={(val) =>
            val === 0 ? '0' : val === benoetigt ? `Bedarf: ${formatCurrency(val)}` : ''
          }
          tick={{ fontSize: 12, fill: '#888' }}
        />
        <YAxis type="category" hide />
        <Tooltip formatter={(value) => formatCurrency(value)} cursor={{ fill: '#f0f0f0' }} />
        {/* Balken für die monatliche Lücke */}
        <Bar
          dataKey="Rente"
          stackId="a"
          fill="#E57373"  // Roter Balken für Lücke
          animationDuration={2000}
          style={visualisierungBalken(luecke, benoetigt)} // Dynamischer Balkenstil für die Lücke
        />
        <Bar
          dataKey="GesamtRente"
          stackId="b"
          fill="#2E7D32"  // Grüner Balken für Gesamtrente
          animationDuration={2000}
          style={visualisierungBalken(gesamtRente, benoetigt)} // Dynamischer Balkenstil für die Gesamtrente
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>

  </div>
)}
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-xs text-[#7E6B64] bg-white/30 backdrop-blur-sm mt-auto">
        © 2025 JB Finanz AG. Alle Rechte vorbehalten.
      </footer>
    </div>
  );
};

export default Altersrentenrechner;


