import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Fazit() {
  const navigate = useNavigate();

  const [daten, setDaten] = useState(null);
  const [tarif, setTarif] = useState(null);
  const [empfName, setEmpfName] = useState(null);
  const [empfDetails, setEmpfDetails] = useState(null);
  const [wuensche, setWuensche] = useState([]);
  const [alleKrankenkassen, setAlleKrankenkassen] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const aktuelle = JSON.parse(localStorage.getItem("aktuelleDaten"));
        const tarif = JSON.parse(localStorage.getItem("auswahlTarif"));
        const empfohlen = localStorage.getItem("ausgewählteEmpfehlung");
        const wuensche = JSON.parse(localStorage.getItem("ausgewaehlteWuensche")) || [];
  
        const res = await fetch('/api/krankenkassen');
        const result = await res.json();
  
        console.log("✅ LocalStorage aktuelleDaten:", aktuelle);
        console.log("✅ LocalStorage auswahlTarif:", tarif);
        console.log("✅ LocalStorage ausgewählteEmpfehlung:", empfohlen);
        console.log("✅ API Krankenkassendaten:", result);
  
        setDaten(aktuelle);
        setTarif(tarif);
        setEmpfName(empfohlen);
        setAlleKrankenkassen(result.daten || {});
        setWuensche(wuensche);
      } catch (error) {
        console.error('❌ Fehler beim Laden der Daten im Fazit:', error);
      }
    };
  
    fetchData();
  }, []);

  useEffect(() => {
    if (alleKrankenkassen && empfName) {
      const details = alleKrankenkassen[empfName] || 
                      alleKrankenkassen[empfName.toLowerCase()] || 
                      alleKrankenkassen[empfName.toUpperCase()] || 
                      null;
      setEmpfDetails(details);
    }
  }, [alleKrankenkassen, empfName]);
  
  

  const getNameById = (id) => {
    const list = JSON.parse(localStorage.getItem("versichererListe")) || [];
    const found = list.find((v) => String(v.id).trim() === String(id).trim());
    return found ? found.name : id;
  };

  if (!daten || !tarif || !empfDetails) return <div className="p-6">Lade Fazit...</div>;

  const personenAnzahl = Array.isArray(daten.personen) ? daten.personen.length : 1;
  const totalAlt = parseFloat(daten.grundPraemie || 0) * personenAnzahl;
  const totalNeu = parseFloat(tarif.summe || 0);
  const ersparnisMonat = (totalAlt - totalNeu).toFixed(2);
  const ersparnisJahr = (totalAlt - totalNeu) * 12;
  const formatCHF = (num) => num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, "'") + ' CHF';

  const gewuenschteLeistungen = Object.entries(empfDetails).filter(
    ([k, v]) => wuensche.includes(k) && v?.description
  );

  const sonstigeLeistungen = Object.entries(empfDetails).filter(
    ([k, v]) => !wuensche.includes(k) && v?.description
  );

  return (
    <div className="min-h-screen bg-[#F8F5F2] text-[#4B2E2B] font-sans" style={{ backgroundImage: 'url("/wave-bg.jpg")', backgroundSize: 'cover', backgroundAttachment: 'fixed' }}>
      {/* HEADER */}
      <header className="relative z-10 bg-gradient-to-b from-white via-white/90 to-transparent">
        <div className="max-w-[1100px] h-[160px] mx-auto px-6 flex justify-between items-center" style={{ transform: 'translateY(30%)' }}>
          <div className="flex items-center gap-3 text-sm font-medium">
            <button onClick={() => navigate('/')} className="px-4 py-2 border-2 border-[#4B2E2B] bg-white text-[#4B2E2B] rounded-xl hover:bg-[#f3efec]">ZUR STARTSEITE</button>
            <button className="px-4 py-2 border-2 border-[#4B2E2B] bg-white text-[#4B2E2B] rounded-xl">BEREICH: <span className="font-bold">KRANKENKASSE</span></button>
            <button onClick={() => navigate(-1)} className="px-4 py-2 bg-[#8C3B4A] text-white border-2 border-[#4B2E2B] rounded-xl flex items-center gap-1">Tool: <span className="font-bold">FAZIT</span> <ChevronDown size={16} /></button>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/beratung-starten')} className="hover:opacity-80">
              <img src="/türe.png" alt="Türe Icon" className="h-10 w-10" />
            </button>
            <img src="/logotools.png" alt="Logo" className="h-[250px] object-contain max-w-[240px] mt-[35px]" />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 space-y-10">
  <h1 className="text-3xl font-bold">Ihre persönliche Empfehlung auf einen Blick</h1>

  {/* Aktuelle Situation */}
  <section className="bg-white rounded-2xl shadow-lg p-6 space-y-3 border border-[#e0dcd5]">
    <h2 className="text-xl font-bold text-[#4B2E2B] flex items-center gap-2">📌 Aktuelle Situation</h2>
    <p>Sie haben aktuell Ihre Grundversicherung bei <strong>{daten.grundkasse}</strong> und die Zusatzversicherung bei <strong>{daten.zusatzkasse}</strong>.</p>
    <p>Die monatliche Prämie für Ihre aktuelle Grundversicherung beträgt <strong>{totalAlt.toFixed(2)} CHF</strong> (für {personenAnzahl} {personenAnzahl === 1 ? 'Person' : 'Personen'}).</p>
  </section>

  {/* Empfehlung Grundversicherung */}
  <section className="bg-white rounded-2xl shadow-lg p-6 space-y-3 border border-[#e0dcd5]">
    <h2 className="text-xl font-bold text-[#4B2E2B] flex items-center gap-2">💡 Empfohlene Grundversicherung</h2>
    <p>
      Basierend auf Ihrer aktuellen Situation empfehlen wir Ihnen die Grundversicherung bei <strong>{getNameById(tarif.versicherer)}</strong> im Modell <strong>{tarif.modell}</strong>.
    </p>
    <p>
      Die neue monatliche Gesamtprämie beträgt <strong>{totalNeu.toFixed(2)} CHF</strong>, wodurch Sie eine mögliche monatliche Ersparnis von <strong>{ersparnisMonat} CHF</strong> erzielen könnten – das entspricht einer jährlichen Einsparung von <strong>{formatCHF(ersparnisJahr)}</strong>.
    </p>
  </section>

  {/* Zusatzversicherung */}
  <section className="bg-white rounded-2xl shadow-lg p-6 space-y-3 border border-[#e0dcd5]">
    <h2 className="text-xl font-bold text-[#4B2E2B] flex items-center gap-2">✅ Zusatzversicherungsempfehlung: {empfName}</h2>
    <div className="flex gap-5 items-start">
      <img src={`/LogosG/${empfName}.png`} alt={empfName} className="h-24 object-contain rounded-lg border p-1 bg-white shadow" />
      <div className="space-y-3 text-sm leading-relaxed">
        {gewuenschteLeistungen.length > 0 ? (
          <>
            <p>Sie legen besonderen Wert auf: 
              {gewuenschteLeistungen.map(([k]) => (
                <span key={k} className="inline-block bg-[#F8F5F2] border border-[#4B2E2B] text-[#4B2E2B] text-xs px-2 py-1 rounded-full ml-2">
                  {k.charAt(0).toUpperCase() + k.slice(1)}
                </span>
              ))}
            </p>
            <p className="mt-2">{empfName} bietet Ihnen hierzu folgende Leistungen:</p>
            <ul className="list-disc list-inside space-y-1">
              {gewuenschteLeistungen.map(([k, v]) => (
                <li key={k}><strong>{k.charAt(0).toUpperCase() + k.slice(1)}:</strong> {v.description}</li>
              ))}
            </ul>
          </>
        ) : (
          <p>Es wurden keine spezifischen Prioritäten ausgewählt.</p>
        )}

        {sonstigeLeistungen.length > 0 && (
          <>
            <p className="pt-4">Darüber hinaus bietet <strong>{empfName}</strong> folgende weitere Leistungen:</p>
            <ul className="list-disc list-inside space-y-1">
              {sonstigeLeistungen.map(([k, v]) => (
                <li key={k}><strong>{k.charAt(0).toUpperCase() + k.slice(1)}:</strong> {v.description}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  </section>

  {/* Button */}
  <div className="text-right pt-4">
    <button
      onClick={() => navigate(`/tools/krankenkasse/krankenkasse`)}
      className="bg-[#4B2E2B] hover:bg-[#8C3B4A] text-white px-6 py-3 rounded-xl text-sm shadow transition-all duration-200"
    >
      Fazit speichern & zurück zur Übersicht
    </button>
  </div>
</main>

    </div>
  );
}
