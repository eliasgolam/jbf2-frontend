import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Praemienvergleich() {
  const navigate = useNavigate();

  const [personen, setPersonen] = useState([{ geburtsjahr: "", plz: "", franchise: "300", unfall: false }]);
  const [gemeinden, setGemeinden] = useState([]);
  const [regionZuordnungen, setRegionZuordnungen] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [tarife, setTarife] = useState([]);
  const [versichererListe, setVersichererListe] = useState([]);
  const [plzRegionen, setPlzRegionen] = useState([]);
  const [vorschlaege, setVorschlaege] = useState([]);
  const [resultate, setResultate] = useState([]);
  const [selectedInsurer, setSelectedInsurer] = useState(null); // Welche Kasse ist aktiv
  const [selectedModel, setSelectedModel] = useState(null);     // Modell-Auswahl
  const [selectedModelsByInsurer, setSelectedModelsByInsurer] = useState({}); // Pro Kasse gewähltes Modell
  


  const [showBereich, setShowBereich] = useState(false);
  const [bereichTimeout, setBereichTimeout] = useState(null);
  const [showTool, setShowTool] = useState(false);
  const [toolTimeout, setToolTimeout] = useState(null);
  const region0Kantone = ["SO", "ZG", "SZ", "NW", "OW", "GL", "AI", "AR", "JU", "NE", "TG", "UR"];

  

  useEffect(() => {
    fetch("/Priminfo/versicherer_aus_pdf.json").then(res => res.json()).then(setVersichererListe);
    fetch("/Priminfo/plz_regionen.json").then(res => res.json()).then(setPlzRegionen);
    Papa.parse("/Priminfo/amtovz_gemeinden.csv", {
      header: true,
      delimiter: ";",
      download: true,
      complete: (res) => setGemeinden(res.data)
    });
    fetch("/Priminfo/praemienregionen_2025.xlsx").then(res => res.arrayBuffer()).then(buf => {
      const workbook = XLSX.read(buf, { type: "buffer" });
      const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 });
      setRegionZuordnungen(sheet.map(r => ({ bfs: r[1], region: r[3] })));
    });
    fetch("/Priminfo/gesamtbericht_ch.xlsx").then(res => res.arrayBuffer()).then(buf => {
      const workbook = XLSX.read(buf, { type: "buffer" });
      const sheet = XLSX.utils.sheet_to_json(workbook.Sheets["Export"]);
      setTarife(sheet);
    });
  }, []);

  const autocompletePlz = (input) => {
    const lowerInput = input.toLowerCase();
    const filtered = plzRegionen.filter((e) => {
      const plz = String(e.PLZ || "");
      const ort = String(e.Ortschaftsname || "").toLowerCase();
      return plz.startsWith(lowerInput) || ort.includes(lowerInput);
    });
  
    setVorschlaege(filtered.slice(0, 8));
  };
  
  const getNameById = (id) => {
    const found = versichererListe.find((v) => String(v.id).trim() === String(id).trim());
    return found ? found.name : id;
  };
  

  const berechne = () => {
    if (personen.length === 1) {
      // ✅ EINZELPERSON-LOGIK (deine bestehende)
      const gruppiert = {};

      const alleKombis = personen.map((p) => {
        const alter = new Date().getFullYear() - parseInt(p.geburtsjahr);
        const akl = alter < 18 ? "AKL-KIN" : alter >= 26 ? "AKL-ERW" : "AKL-JUG";
        const untergruppe = akl === "AKL-KIN" ? "K1" : null;
        const plzOnly = p.plz.split(' ')[0].trim();
      
        const gemeinde = gemeinden.find((g) => g.PLZ?.trim() === plzOnly);
        if (!gemeinde) return [];
      
        const bfs = gemeinde["BFS-Nr"];
        const kanton = gemeinde["Kantonskürzel"];
        const istRegion0Kanton = region0Kantone.includes(kanton);
        const region = istRegion0Kanton ? null : regionZuordnungen.find((r) => `${r.bfs}` === bfs);
        const regCode = istRegion0Kanton ? "PR-REG CH0" : `PR-REG CH${region?.region}`;
      
        return tarife
          .filter((t) =>
            String(t.Kanton).trim() === kanton &&
            String(t.Region || "").trim() === regCode &&
            String(t.Altersklasse).trim() === akl &&
            (!untergruppe || String(t.Altersuntergruppe).trim() === untergruppe) &&
            String(t.Unfalleinschluss).trim() === (p.unfall ? "MIT-UNF" : "OHN-UNF") &&
            String(t.Franchise).trim() === `FRA-${p.franchise}`
          )
          .map((t) => ({
            ...t,
            // Wir hängen die nötigen Daten direkt an den Tarif dran
            kanton,
            region: regCode,
            akl,
            untergruppe,
            unfall: p.unfall,
            franchise: p.franchise,
          }));
      });
      
  
      const combinations = alleKombis.reduce((a, b) => a.flatMap(x => b.map(y => [x, y].flat())), [[]]);
      for (const kombi of combinations) {
        for (const tarif of kombi) {
          const id = `${tarif.Versicherer}-${tarif["Tarif-ID"]}`;
          const name = tarif["Tarifbezeichnung"] || "Unbekannt";
          const praemie = parseFloat(tarif.Prämie);
  
          if (!gruppiert[id] || gruppiert[id].summe > praemie) {
            gruppiert[id] = {
              versicherer: tarif.Versicherer,
              modell: name,
              tarifId: tarif["Tarif-ID"],
              summe: praemie,
              id,
              kanton: tarif.kanton,
              region: tarif.region,
              akl: tarif.akl,
              untergruppe: tarif.untergruppe,
              unfall: tarif.unfall,
              franchise: tarif.franchise
            };
            
            
          }
        }
      }
  
      setResultate(Object.values(gruppiert).sort((a, b) => a.summe - b.summe).slice(0, 10));
    } else {
      // ✅ MEHRERE PERSONEN: GEMEINSAME BERECHNUNG
   // ✅ MEHRERE PERSONEN: GEMEINSAME BERECHNUNG
const alleTarifeProPerson = personen.map((p) => {
  const alter = new Date().getFullYear() - parseInt(p.geburtsjahr);
  const akl = alter < 18 ? "AKL-KIN" : alter >= 26 ? "AKL-ERW" : "AKL-JUG";
  const untergruppe = akl === "AKL-KIN" ? "K1" : null;

  const plzOnly = typeof p.plz === "string" ? p.plz.match(/^\d{4}/)?.[0]?.trim() : undefined;
  if (!plzOnly) {
    console.warn("❌ PLZ konnte nicht extrahiert werden aus:", p.plz);
    return [];
  }
  
  const gemeinde = gemeinden.find((g) => g.PLZ?.trim() === plzOnly);
  if (!gemeinde) {
    console.warn("❌ Keine Gemeinde gefunden für:", plzOnly);
    return [];
  }
  
  const bfs = gemeinde["BFS-Nr"];
const kanton = gemeinde["Kantonskürzel"];
const istRegion0Kanton = region0Kantone.includes(kanton);
const region = istRegion0Kanton ? null : regionZuordnungen.find((r) => `${r.bfs}` === bfs);
const regCode = istRegion0Kanton ? "PR-REG CH0" : `PR-REG CH${region?.region}`;




return tarife.filter((t) =>
  String(t.Kanton).trim() === kanton &&
  String(t.Region || "").trim() === regCode &&
  String(t.Altersklasse).trim() === akl &&
  (!untergruppe || String(t.Altersuntergruppe).trim() === untergruppe) &&
  String(t.Unfalleinschluss).trim() === (p.unfall ? "MIT-UNF" : "OHN-UNF") &&
  String(t.Franchise).trim() === `FRA-${p.franchise}`
);




});

const versichererMap = {};

for (let i = 0; i < alleTarifeProPerson.length; i++) {
  const personTarife = alleTarifeProPerson[i];
  if (!Array.isArray(personTarife)) continue;

  for (const tarif of personTarife) {
    const versichererId = tarif.Versicherer;
    if (!versichererMap[versichererId]) versichererMap[versichererId] = [];
    versichererMap[versichererId][i] = tarif;
  }
}

const gemeinsame = [];

for (const [versicherer, tarifeProPerson] of Object.entries(versichererMap)) {
  if (
    Array.isArray(tarifeProPerson) &&
    tarifeProPerson.length === personen.length &&
    tarifeProPerson.every(Boolean)
  ) {
    const summe = tarifeProPerson.reduce((acc, t) => {
      const raw = String(t.Prämie).replace(",", "."); // Komma zu Punkt
      const preis = parseFloat(raw);
      return acc + (isNaN(preis) ? 0 : preis);
    }, 0);
    
    gemeinsame.push({
      versicherer,
      modell: tarifeProPerson[0]["Tarifbezeichnung"] || "Unbekannt",
      tarifId: tarifeProPerson[0]["Tarif-ID"],
      summe,
      id: versicherer
    });
  }
}

setResultate(gemeinsame.sort((a, b) => a.summe - b.summe).slice(0, 10));

    }
  };
  

  return (
    <div className="min-h-screen bg-[#F8F5F2] text-[#4B2E2B] font-sans" style={{ backgroundImage: 'url("/wave-bg.jpg")', backgroundSize: 'cover', backgroundAttachment: 'fixed' }}>
      <header className="relative z-10 bg-gradient-to-b from-white via-white/90 to-transparent">
        <div className="max-w-[1100px] h-[160px] mx-auto px-6 flex justify-between items-center" style={{ transform: 'translateY(30%)' }}>
          <div className="flex items-center gap-3 text-sm font-medium">
            <button onClick={() => navigate('/')} className="px-4 py-2 border-2 border-[#4B2E2B] bg-white text-[#4B2E2B] rounded-xl hover:bg-[#f3efec]">ZUR STARTSEITE</button>
            <div className="relative" onMouseEnter={() => { if (bereichTimeout) clearTimeout(bereichTimeout); setShowBereich(true); }} onMouseLeave={() => { const timeout = setTimeout(() => setShowBereich(false), 200); setBereichTimeout(timeout); }}>
              <button className="px-4 py-2 border-2 border-[#4B2E2B] bg-white text-[#4B2E2B] rounded-xl flex items-center gap-1">BEREICH: <span className="font-bold">KRANKENKASSE</span></button>
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
              <button className="px-4 py-2 bg-[#8C3B4A] text-white border-2 border-[#4B2E2B] rounded-xl flex items-center gap-1">TOOL: <span className="font-bold">Prämienvergleich</span> <ChevronDown size={16} /></button>
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

      <div className="max-w-4xl mx-auto px-4 pt-10 space-y-4">
        <h1 className="text-2xl font-bold">Prämienvergleich</h1>

        {personen.map((p, i) => {
          const alter = p.geburtsjahr ? new Date().getFullYear() - parseInt(p.geburtsjahr) : 0;
          const franchises = alter < 18 ? [0, 100, 200, 300, 400, 500, 600] : [300, 500, 1000, 1500, 2000, 2500];
          return (
            <div key={i} className="relative p-4 bg-white rounded-xl shadow space-y-2">
  {personen.length > 1 && (
    <button
      className="absolute top-3 right-3 hover:scale-105 transition-transform"
      onClick={() => {
        const updated = personen.filter((_, index) => index !== i);
        setPersonen(updated);
      }}
    >
     <img
  src="/papierkorb.png"
  alt="Person entfernen"
  className="w-6 h-6 opacity-70 hover:opacity-100 transition-opacity"
/>

    </button>
  )}

              <input type="number" placeholder="Geburtsjahr" className="input input-bordered w-full" value={p.geburtsjahr} onChange={(e) => {
                const clone = [...personen]; clone[i].geburtsjahr = e.target.value; setPersonen(clone);
              }} />
            { i === 0 ? (
  <input
    type="text"
    placeholder="PLZ"
    className="input input-bordered w-full"
    value={p.plz}
    onChange={(e) => {
      const val = e.target.value;
      const updated = [...personen];
      updated[0].plz = val;
      // alle anderen Personen übernehmen diese PLZ
      for (let j = 1; j < updated.length; j++) {
        updated[j].plz = val;
      }
      setPersonen(updated);
      if (i === 0 && val.length >= 2) autocompletePlz(val);

    }}
  />
) : (
  <input
    type="text"
    value={personen[0].plz}
    readOnly
    disabled
    className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
  />
)}

{i === 0 && vorschlaege.length > 0 && (
                <ul className="bg-white border rounded shadow">
                  {vorschlaege.map((v, idx) => (
                    <li
                    key={idx}
                    onClick={() => {
                      const clone = [...personen];
                      clone[i].plz = `${v.PLZ} ${v.Ortschaftsname}`;
                      setPersonen(clone);
                      setVorschlaege([]);
                    }}
                    className="px-2 py-1 cursor-pointer hover:bg-gray-100"
                  >
                    {v.PLZ} {v.Ortschaftsname}
                  </li>
                  
                  ))}
                </ul>
              )}
              <select className="select select-bordered w-full" value={p.franchise} onChange={(e) => {
                const clone = [...personen]; clone[i].franchise = e.target.value; setPersonen(clone);
              }}>
                {franchises.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={p.unfall} onChange={() => {
                  const clone = [...personen]; clone[i].unfall = !clone[i].unfall; setPersonen(clone);
                }} /> Mit Unfall
              </label>
            </div>
          );
        })}

        <div className="flex gap-2">
        <button
  onClick={() => {
    const erstePlz = personen[0]?.plz || "";
    setPersonen([...personen, {
      geburtsjahr: "",
      plz: erstePlz,
      franchise: "300",
      unfall: false
    }]);
  }}

  className="border border-[#4B2E2B] text-[#4B2E2B] hover:bg-[#f8f5f2] font-medium px-5 py-2 rounded-xl shadow-sm"
>
  + Weitere Person
</button>

          <button
  onClick={berechne}
  className="bg-[#8C3B4A] hover:bg-[#732f3c] transition-colors text-white font-semibold px-6 py-2 rounded-xl shadow-md"
>
  Jetzt berechnen
</button>

        </div>

        {resultate.length > 0 && (
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-200">

            <h2 className="text-lg font-bold mb-2">Top 10 Krankenkassen</h2>
            <table className="w-full text-base text-left text-[#4B2E2B]">
            <thead className="text-base font-semibold text-[#4B2E2B] border-b">
  <tr>
    <th className="py-2 px-4 text-left">Versicherer</th>
    <th className="py-2 px-4 text-right">Prämie</th>
    <th className="py-2 px-4 text-right">Vergütung</th>
    <th className="py-2 px-4 text-right">Total</th>
    <th className="py-2 px-4 text-right">Modell</th>

  </tr>
</thead>


<tbody>
{resultate.map((r, i) => {
  const isActive = selectedInsurer === r.versicherer;

  return (
    <React.Fragment key={i}>
      <tr
      onClick={() => {
        // Kasse auswählen
        setSelectedId(r.id);
        setSelectedInsurer(r.versicherer);
        setSelectedModel(null);
      
        // Nur Modell dieser Kasse behalten, alle anderen löschen
        setSelectedModelsByInsurer((prev) => ({
          [r.versicherer]: prev[r.versicherer] || null
        }));
      
        
      }}
      
        className={`cursor-pointer text-[16px] leading-6 transition-all duration-150 ${
          selectedId === r.id
            ? 'bg-[#8C3B4A]/10 border-l-4 border-[#8C3B4A]'
            : 'hover:bg-[#f8f5f2]'
        }`}
      >
        <td className="py-3 px-4">{getNameById(r.versicherer)}</td>
        <td className="py-3 px-4 text-right whitespace-nowrap">
          {r.summe.toFixed(2)} CHF
        </td>
        <td className="py-3 px-4 text-right whitespace-nowrap">
          {(personen.length * 5.15).toFixed(2)} CHF
        </td>
        <td className="py-3 px-4 text-right whitespace-nowrap">
          {(r.summe - (personen.length * 5.15)).toFixed(2)} CHF
        </td>
        <td className="py-3 px-4 text-right whitespace-nowrap text-sm text-gray-600">
          {selectedModelsByInsurer[r.versicherer]?.Tarifbezeichnung
            ? `${selectedModelsByInsurer[r.versicherer].Tarifbezeichnung} – ${parseFloat(
                selectedModelsByInsurer[r.versicherer].Prämie
              ).toFixed(2)} CHF`
            : ""}
        </td>
      </tr>

      {isActive && (
        <tr>
          <td colSpan={5}>
            <div className="mt-2 bg-white border border-gray-300 rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-base">
                  Modelle von {getNameById(r.versicherer)}
                </h3>
                <button
                  onClick={() => {
                    setSelectedInsurer(null);
                    setSelectedModel(null);
                  }}
                  className="text-sm text-gray-500 hover:text-gray-800"
                >
                  ✕ schließen
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {tarife
                  .filter(
                    (t) =>
                      String(t.Versicherer).trim() ===
                        String(r.versicherer).trim() &&
                      String(t.Kanton).trim() === r.kanton &&
                      String(t.Region || "").trim() === r.region &&
                      String(t.Altersklasse).trim() === r.akl &&
                      (!r.untergruppe ||
                        String(t.Altersuntergruppe).trim() === r.untergruppe) &&
                      String(t.Unfalleinschluss).trim() ===
                        (r.unfall ? "MIT-UNF" : "OHN-UNF") &&
                      String(t.Franchise).trim() === `FRA-${r.franchise}`
                  )
                  .sort((a, b) => parseFloat(a.Prämie) - parseFloat(b.Prämie))
                  .slice(0, 5)
                  .map((modell, idx) => (
                    <div
                      key={idx}
                      className="cursor-pointer hover:bg-[#f8f5f2] p-2 border rounded"
                      onClick={() => {
                        const fullTarif = {
                          versicherer: modell.Versicherer,
                          modell: modell.Tarifbezeichnung,
                          tarifId: modell["Tarif-ID"],
                          summe: parseFloat(modell.Prämie)
                        };
                      
                        setSelectedModel(modell);
                        setSelectedModelsByInsurer({
                          ...selectedModelsByInsurer,
                          [r.versicherer]: modell,
                        });
                      
                        localStorage.setItem("auswahlTarif", JSON.stringify(fullTarif));
                        localStorage.setItem("versichererListe", JSON.stringify(versichererListe));
                      
                        setSelectedInsurer(null);
                      }}
                      
                    >
                      <div className="font-medium">
                        {modell.Tarifbezeichnung || "Unbenannt"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {parseFloat(modell.Prämie).toFixed(2)} CHF
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
})}

</tbody>

            </table>
            <div className="mt-6 text-right">
  <button
    onClick={() => navigate('/fazit')}
    className="bg-[#4B2E2B] hover:bg-[#8C3B4A] text-white px-6 py-3 rounded-xl text-sm shadow"
  >
    Weiter zum Fazit →
  </button>
</div>




          </div>
        )}
      </div>
    </div>
  );
}