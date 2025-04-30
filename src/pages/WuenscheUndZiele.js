import React, { useState, useEffect, useRef } from "react";
import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";
import ausbildung from "../assets/Ausbildung.json";
import family from "../assets/Family.json";
import individuell from "../assets/Individuell.json";
import reisen from "../assets/Reisen.json";
import eigenheim from "../assets/Eigenheim.json";
import vermoegen from "../assets/Vermögensaufbau.json";

const animations = {
  Ausbildung: ausbildung,
  Familie: family,
  Individuell: individuell,
  Reisen: reisen,
  Eigenheim: eigenheim,
  Vermögensaufbau: vermoegen,
};

const jahre = [2025, 2031, 2038, 2045, 2051, 2058, 2065];
const wichtigkeiten = ["Sehr wichtig", "Wichtig", "Weniger wichtig"];
const LOCAL_STORAGE_KEY = "wuenscheUndZiele";

function WuenscheUndZiele() {
  const [ziele, setZiele] = useState([]);
  const [selectedZiel, setSelectedZiel] = useState(null);
  const [customName, setCustomName] = useState("");
  const navigate = useNavigate();
  const timelineRef = useRef(null);

  const kunde = JSON.parse(localStorage.getItem("ausgewaehlterKunde")) || { vorname: "Kunde", nachname: "" };
  const beraterName = localStorage.getItem("beraterName") || "Max Muster";
  const profilbild = "/default-profile.png";

  useEffect(() => {
    const gespeicherteZiele = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (gespeicherteZiele) setZiele(JSON.parse(gespeicherteZiele));
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(ziele));
  }, [ziele]);

  const handleZielMove = (e, ziel) => {
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const jahrPx = rect.width / (jahre.length - 1);
    const jahrIndexFloat = x / jahrPx;
    const interpoliert = Math.round(jahre[0] + (jahrIndexFloat / (jahre.length - 1)) * (jahre[jahre.length - 1] - jahre[0]));

    const neuesZiel = {
      ...ziel,
      jahr: interpoliert,
      topPercent: (y / rect.height) * 100, // speichere die genaue Position
    };
    
    setZiele((prev) => prev.map((z) => (z.id === ziel.id ? neuesZiel : z)));
    setSelectedZiel(neuesZiel);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("ziel");
if (!data) return;
let ziel;
try {
  ziel = JSON.parse(data);
} catch (err) {
  console.warn("Ungültige Drag-Daten:", err);
  return;
}

    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const jahrPx = rect.width / (jahre.length - 1);
    const jahrIndexFloat = x / jahrPx;
    const interpoliert = Math.round(jahre[0] + (jahrIndexFloat / (jahre.length - 1)) * (jahre[jahre.length - 1] - jahre[0]));
    const wichtigkeitIndex = Math.floor((y / rect.height) * wichtigkeiten.length);
    const neuesZiel = {
      ...ziel,
      jahr: interpoliert,
      wichtigkeit: wichtigkeiten[wichtigkeitIndex] || "Wichtig",
      name: ziel.icon === "Individuell" && customName ? customName : ziel.name,
    };
    setZiele([...ziele.filter((z) => z.id !== ziel.id), neuesZiel]);
    setSelectedZiel(neuesZiel);
    setCustomName("");
  };

  const handleZielDelete = (id) => {
    setZiele(ziele.filter((z) => z.id !== id));
    if (selectedZiel?.id === id) setSelectedZiel(null);
  };

  const handleZieleSpeichernUndZurueck = () => {
    localStorage.setItem("wuenscheUndZiele", JSON.stringify(ziele));
    navigate("/beratung-starten");
  };
  
  const handleDetailsChange = (field, value) => {
    if (!selectedZiel) return;
    const updated = { ...selectedZiel, [field]: value };
    setSelectedZiel(updated);
    setZiele(ziele.map((z) => (z.id === updated.id ? updated : z)));
  };

  return (
    <div className="relative min-h-screen font-sans">
      {/* Hintergrund */}
      <div className="absolute inset-0 bg-cover bg-center bg-fixed z-0" style={{ backgroundImage: 'url("/wave-bg.jpg")' }} />
      <div className="absolute inset-0 bg-[#F8F5F2]/70 backdrop-blur-md z-0" />

      <header className="relative z-10 h-[100px] bg-gradient-to-b from-white/80 via-white/60 to-transparent backdrop-blur-md flex justify-end items-center px-6">
  <div className="flex items-center gap-4">
    <button onClick={() => navigate('/beratung-starten')}
 className="hover:opacity-80 transition">
      <img src="/türe.png" alt="Zur Startseite" className="h-10 w-10" />
    </button>
    <img src="/logotools.png" alt="JB Finanz Logo" className="h-30 object-contain max-w-[180px]" />
  </div>
</header>


      <section className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-10 text-center">
  <h1 className="text-4xl sm:text-5xl font-bold font-serif text-[#4B2E2B] tracking-tight">
    Wünsche und Ziele von {kunde.vorname} {kunde.nachname}
  </h1>
  <p className="text-lg mt-2 text-[#4B2E2B]/80">
    Ziehe deine Wünsche auf die Zeitachse und plane deine Zukunft.
  </p>
</section>



{/* ==== ERSETZE DEN GESAMTEN <section> BLOCK ZUM ICON-BEREICH ==== */}
<section className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-6">
  <div className="flex flex-wrap justify-center items-center gap-10">
    {Object.entries(animations).map(([key, animation], index) => (
      <div
        key={key}
        draggable
        onDragStart={(e) =>
          e.dataTransfer.setData("ziel", JSON.stringify({ id: key, name: key === 'Family' ? 'Familie' : key, icon: key }))
        }
        onClick={() => setSelectedZiel({ id: key, name: key === 'Family' ? 'Familie' : key, icon: key })}
        className="flex flex-col items-center cursor-pointer select-none group"
      >
        <div className="w-20 h-20 rounded-full bg-white/30 backdrop-blur-xl border border-white/50 shadow-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl">
          <div className="relative w-12 h-12">
            <Lottie animationData={animation} className="absolute inset-0" loop autoplay />
          </div>
        </div>
        <span className="text-sm font-medium text-[#4B2E2B] mt-2 group-hover:text-[#8C3B4A] transition-colors duration-300">
          {key === 'Family' ? 'Familie' : key}
        </span>
      </div>
    ))}
  </div>
</section>


<section className="relative z-10 w-full max-w-[1150px] mx-auto px-6 pt-8">
  <div className="flex flex-col lg:flex-row items-stretch gap-8">

    {/* Zeitachse */}
    <div className="flex-1">
      <h2 className="text-sm font-semibold text-[#4B2E2B] mb-2">Zeitachse</h2>
      <div
  ref={timelineRef}
  onDragOver={(e) => e.preventDefault()}
  onDrop={handleDrop}
  className="relative w-full max-w-[1200px] h-[420px] bg-white/80 backdrop-blur-md border border-[#DDD] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] overflow-visible px-8 py-6"
>
  <div className="absolute inset-0 z-0">
    {/* Wichtigkeit-Labels */}
    {wichtigkeiten.map((w, i) => {
  return (
    <div
      key={w}
      className="absolute text-[13px] text-[#4B2E2B]/80 font-medium"
      style={{
        top: `${((i + 0.5) / wichtigkeiten.length) * 100}%`,
        left: "8px",
        transform: "translateY(-50%)"
      }}
    >
      {w}
    </div>
  );
})}

    {/* Jahresachsenlinien */}
    {jahre.map((jahr, i) => {
  const isEdge = i === 0 || i === jahre.length - 1;
  const labelClass = isEdge
    ? "font-medium text-[#4B2E2B]"
    : "text-[#4B2E2B]/70";
  const leftPercent = (i / (jahre.length - 1)) * 100;

  return (
    <div
      key={jahr}
      className="absolute top-0 bottom-0 border-l border-gray-300"
      style={{
        left: `${leftPercent}%`,
        transform: "translateX(-50%)",
      }}
    >
      {i === 0 ? (
        <div
          className={`absolute bottom-3 text-[11px] ${labelClass}`}
          style={{ left: "32px", transform: "none" }}
        >
          Heute
        </div>
      ) : i === jahre.length - 1 ? (
        <div
          className={`absolute bottom-3 text-[11px] ${labelClass}`}
          style={{ left: "calc(100% - 32px)", transform: "none" }}
        >
          {jahr}
        </div>
      ) : (
        <div
          className={`absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] ${labelClass}`}
        >
          {jahr}
        </div>
      )}
    </div>
  );
  
})}

  </div>


        {/* Ziele platzieren */}
        {ziele.map((ziel) => {
          const xRatio = (ziel.jahr - jahre[0]) / (jahre[jahre.length - 1] - jahre[0]);
          const topPercent = ziel.topPercent ?? 50; // Fallback in die Mitte


          return (
            <>
              {/* Ziel-Element */}
              <div
                key={ziel.id}
                className="absolute flex flex-col items-center cursor-grab z-10"
                style={{
                  left: `${xRatio * 100}%`,
                  top: `${topPercent}%`,
                  transform: "translate(-50%, -50%)",
                }}
                onMouseDown={(e) => {
                  const move = (ev) => handleZielMove(ev, ziel);
                  const stop = () => {
                    window.removeEventListener("mousemove", move);
                    window.removeEventListener("mouseup", stop);
                  };
                  window.addEventListener("mousemove", move);
                  window.addEventListener("mouseup", stop);
                }}
              >
                <Lottie animationData={animations[ziel.icon]} className="w-14 h-14" loop autoplay />
                <span className="text-[10px] text-center text-[#4B2E2B] max-w-[60px] truncate mt-1">
                  {ziel.name}
                </span>
              </div>
          
              {/* Verbindungslinie NACH dem Ziel */}
              <div
                className="absolute w-[2px] bg-[#4B2E2B] z-0"
                style={{
                  left: `${xRatio * 100}%`,
                  top: `calc(${topPercent}% + 45px)`, // 45px = Platz für Icon + Text
                  height: `calc(100% - ${topPercent}% - 45px)`,
                  transform: "translateX(-50%)",
                }}
              />
            </>
          );
          
          
        })}
      </div>
    </div>

    {/* Ziel-Details */}
    <div className="w-full lg:w-[320px] h-[420px]">
  <h2 className="text-sm font-semibold text-[#4B2E2B] mb-2">Ziel-Details (Bearbeiten)</h2>
  <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-[#e2dfdc] h-full flex flex-col justify-between">
        {selectedZiel ? (
         <div className="space-y-6 text-sm text-[#4B2E2B]">

         {/* Icon + Titel */}
         <div className="flex items-center gap-3">
           <Lottie animationData={animations[selectedZiel.icon]} className="w-10 h-10" loop autoplay />
           <h2 className="text-xl font-semibold">{selectedZiel.name}</h2>
         </div>
       
         {/* Jahr + Monat (Platzhalter, falls du später Monate brauchst) */}
         <div className="grid grid-cols-2 gap-4">
           <div>
             <label className="block text-xs font-medium mb-1">Bis Jahr</label>
             <div className="p-2 bg-white border border-gray-300 rounded-md">
               {selectedZiel.jahr}
             </div>
           </div>
         </div>
       
         {/* Kapitalbedarf */}
         <div>
  <label className="block text-xs font-medium mb-1">Benötigtes Kapital?</label>
  <input
    type="text"
    className="w-full rounded-md p-2 border border-gray-300 text-right"
    value={
      selectedZiel.kapitalbedarf
        ? parseInt(selectedZiel.kapitalbedarf).toLocaleString("de-CH")
        : ""
    }
    onChange={(e) => {
      const numeric = e.target.value.replace(/[^0-9]/g, ""); // nur Ziffern erlauben
      handleDetailsChange("kapitalbedarf", numeric);
    }}
  />
</div>

       
         {/* Fremdfinanzierung */}
         <div>
           <label className="block text-xs font-medium mb-1">Anteil Fremdfinanzierung (%)</label>
           <input
             type="range"
             min="0"
             max="100"
             value={selectedZiel.fremdfinanzierung || 0}
             onChange={(e) => handleDetailsChange("fremdfinanzierung", e.target.value)}
           />
           <div className="text-xs mt-1">{selectedZiel.fremdfinanzierung || 0}%</div>
         </div>
       
         {/* Sparziel */}
         <div className="mt-4">
  <label className="block text-xs font-medium text-[#4B2E2B] mb-1">Ihr Sparziel</label>
  <div className="flex items-center justify-between px-3 py-2 bg-white/80 backdrop-blur rounded-lg border border-[#e0dcd9] shadow-sm text-sm text-[#4B2E2B] font-semibold">
    <span>CHF</span>
    <span>
      {(selectedZiel.kapitalbedarf && selectedZiel.fremdfinanzierung >= 0)
        ? (selectedZiel.kapitalbedarf * (1 - selectedZiel.fremdfinanzierung / 100))
            .toLocaleString("de-CH", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })
        : "0.00"}
    </span>
  </div>
</div>
    
       
    
       
       </div>
       
        
        ) : (
          <div className="text-sm text-gray-600">Bitte Ziel auswählen</div>
        )}
      </div>
    </div>

  </div>
</section>


{/* Zusammenfassung */}
<section className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-10 pb-4">
  <h2 className="text-sm font-semibold text-[#4B2E2B] mb-3">Zusammenfassung Ihrer Sparziele</h2>

  <div className="overflow-x-auto rounded-2xl shadow-md backdrop-blur-lg bg-white/50 border border-[#ddd]">
    <table className="min-w-full text-sm text-[#4B2E2B]">
      <thead className="bg-[#F8F5F2] text-left font-semibold text-xs tracking-wide uppercase border-b border-gray-200">
        <tr>
          <th className="px-4 py-3">Prio</th>
          <th className="px-4 py-3">Ziel</th>
          <th className="px-4 py-3">Bis</th>
          <th className="px-4 py-3">Sparziel</th>
          <th className="px-4 py-3">Start sparen</th>
          <th className="px-4 py-3">Sparbudget</th>
          <th className="px-4 py-3">Aktion</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white/30">
        {ziele.map((ziel) => (
          <tr key={ziel.id + ziel.jahr}>
            <td className="px-4 py-2">{ziel.wichtigkeit}</td>
            <td className="px-4 py-2">{ziel.name}</td>
            <td className="px-4 py-2">{ziel.jahr}</td>
            <td className="px-4 py-2">
              CHF {(ziel.kapitalbedarf * (1 - ziel.fremdfinanzierung / 100)).toFixed(2)}
            </td>
            <td className="px-4 py-2">2025</td>
            <td className="px-4 py-2">CHF 0.00</td>
            <td className="px-4 py-2 flex gap-2 items-center">
              <img
                src="/stift.png"
                alt="Bearbeiten"
                className="w-5 h-5 cursor-pointer hover:scale-110 transition"
                onClick={() => setSelectedZiel(ziel)}
              />
              <img
                src="/papierkorb.png"
                alt="Löschen"
                className="w-5 h-5 cursor-pointer hover:scale-110 transition"
                onClick={() => handleZielDelete(ziel.id)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</section>
{/* Button & Footer */}
<div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-6 pb-16 flex justify-end">
  <button
    onClick={handleZieleSpeichernUndZurueck}
    className="bg-[#8C3B4A] text-white px-6 py-3 rounded-xl shadow hover:bg-[#742e3b] transition"
  >
    Ziele speichern und zurück zur Beratung
  </button>
</div>

<footer className="relative z-10 py-6 text-center text-xs text-gray-700 bg-white/10 backdrop-blur-sm">
  © 2025 JB Finanz AG. Alle Rechte vorbehalten.
</footer>

</div>
  );
} 
export default WuenscheUndZiele;
