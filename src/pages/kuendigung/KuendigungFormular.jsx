import React, { useEffect, useState } from 'react';
import krankenkassen from '../../data/krankenkassen.json';
import { Plus } from 'lucide-react';

const KuendigungFormular = ({ antworten, setAntworten, onAbschliessen }) => {
  const gespeicherterKunde = JSON.parse(localStorage.getItem('ausgewaehlterKunde')) || {};

  const [absender, setAbsender] = useState({
    vorname: gespeicherterKunde.vorname || '',
    nachname: gespeicherterKunde.nachname || '',
    strasse: gespeicherterKunde.adresse || '',
    plzOrt: `${gespeicherterKunde.plz || ''} ${gespeicherterKunde.ort || ''}`.trim()
  });

  const [kasseSuche, setKasseSuche] = useState('');
  const [kasseAuswahl, setKasseAuswahl] = useState('');
  const [personen, setPersonen] = useState([
    {
      vorname: gespeicherterKunde.vorname || '',
      nachname: gespeicherterKunde.nachname || '',
      geburtsdatum: gespeicherterKunde.geburtsdatum || '',
      kuendigungsdatumKVG: '',
      kuendigungsdatumVVG: ''
    }
  ]);

  const krankenkassenNamen = krankenkassen.map(k => k.name);

  const handlePersonChange = (index, field, value) => {
    const updated = [...personen];
    updated[index][field] = value;
    setPersonen(updated);
  };

  const handleAddPerson = () => {
    if (personen.length >= 6) return;
    setPersonen(prev => [...prev, {
      vorname: '', nachname: '', geburtsdatum: '', kuendigungsdatumKVG: '', kuendigungsdatumVVG: ''
    }]);
  };

  const handleRemovePerson = (index) => {
    const updated = [...personen];
    updated.splice(index, 1);
    setPersonen(updated);
  };

  const handleSubmit = () => {
    const ausgewählteKasse = krankenkassen.find(k => k.name === kasseAuswahl);
    const adresse = ausgewählteKasse?.adresse || '';
    const [empfaengerStrasse, empfaengerPlzOrt] = adresse.split(',').map(s => s.trim());
  
    const daten = {
      AbsenderName: `${absender.vorname || ''} ${absender.nachname || ''}`.trim(),
      AbsenderStrasse: absender.strasse || '',
      AbsenderPlzOrt: absender.plzOrt || '',
      EmpfängerName: kasseAuswahl || '',
      EmpfängerStrasse: empfaengerStrasse || '',
      EmpfängerPlzOrt: empfaengerPlzOrt || '',
      personen: personen, // 🟢 gesamtes Array zur Weiterverarbeitung
      ...personen.reduce((acc, person, i) => {
        const idx = i + 1;
        acc[`NameVorname${idx}`] = `${person.vorname} ${person.nachname}`.trim();
        acc[`Geburtsdatum${idx}`] = person.geburtsdatum || '';
        acc[`KündigungKVG${idx}`] = person.kuendigungsdatumKVG || '';
        acc[`KündigungVVG${idx}`] = person.kuendigungsdatumVVG || '';
        acc[`KVG${idx}`] = !!person.kuendigungsdatumKVG;
        acc[`VVG${idx}`] = !!person.kuendigungsdatumVVG;
        return acc;
      }, {})
    };
  
    setAntworten(daten);
    localStorage.setItem('antworten', JSON.stringify(daten));
    onAbschliessen(); // 🔄 weiter zum Viewer
  };
  

  return (
    <div className="min-h-screen bg-cover bg-center px-6 py-12 text-[#4B2E2B]" style={{ backgroundImage: "url('/wave-bg.jpg')" }}>
      <div className="absolute inset-0 bg-[#00000040] z-0" />
      <div className="relative z-10 max-w-3xl mx-auto bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl space-y-6">
        <h1 className="text-2xl font-bold text-center text-[#8C3B4A]">Kündigungsformular</h1>

        {/* 1. Absender */}
        <div className="space-y-4">
          <h2 className="font-semibold text-[#4B2E2B]">1. Absender</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input placeholder="Vorname" value={absender.vorname} onChange={e => setAbsender(prev => ({ ...prev, vorname: e.target.value }))} className="border rounded px-4 py-2" />
            <input placeholder="Nachname" value={absender.nachname} onChange={e => setAbsender(prev => ({ ...prev, nachname: e.target.value }))} className="border rounded px-4 py-2" />
            <input placeholder="Straße und Nr." value={absender.strasse} onChange={e => setAbsender(prev => ({ ...prev, strasse: e.target.value }))} className="border rounded px-4 py-2" />
            <input placeholder="PLZ Ort" value={absender.plzOrt} onChange={e => setAbsender(prev => ({ ...prev, plzOrt: e.target.value }))} className="border rounded px-4 py-2" />
          </div>
        </div>

        {/* 2. Krankenkasse */}
        <div className="space-y-4">
          <h2 className="font-semibold text-[#4B2E2B]">2. Zu kündigende Krankenkasse</h2>
          <input
            type="text"
            placeholder="Krankenkasse eingeben..."
            list="kassenListe"
            value={kasseSuche}
            onChange={e => {
              setKasseSuche(e.target.value);
              setKasseAuswahl(e.target.value);
            }}
            className="w-full border rounded px-4 py-2"
          />
          <datalist id="kassenListe">
            {krankenkassenNamen.map((name, i) => (
              <option key={i} value={name} />
            ))}
          </datalist>
        </div>

        {/* 3. Personen */}
        <div className="space-y-4">
          <h2 className="font-semibold text-[#4B2E2B]">3. Personen</h2>
          {personen.map((person, index) => (
            <div key={index} className="flex flex-wrap gap-3 items-end">
              <div className="flex flex-col">
                <input placeholder="Vorname" value={person.vorname} onChange={e => handlePersonChange(index, 'vorname', e.target.value)} className="border rounded px-3 py-2 w-[130px]" />
                <label className="text-xs text-center mt-1">Vorname</label>
              </div>
              <div className="flex flex-col">
                <input placeholder="Nachname" value={person.nachname} onChange={e => handlePersonChange(index, 'nachname', e.target.value)} className="border rounded px-3 py-2 w-[130px]" />
                <label className="text-xs text-center mt-1">Nachname</label>
              </div>
              <div className="flex flex-col">
                <input type="date" value={person.geburtsdatum} onChange={e => handlePersonChange(index, 'geburtsdatum', e.target.value)} className="border rounded px-3 py-2 w-[160px]" />
                <label className="text-xs text-center mt-1">Geburtsdatum</label>
              </div>
              <div className="flex flex-col">
                <input type="date" value={person.kuendigungsdatumKVG} onChange={e => handlePersonChange(index, 'kuendigungsdatumKVG', e.target.value)} className="border rounded px-3 py-2 w-[160px]" />
                <label className="text-xs text-center mt-1">KVG Kündigen per</label>
              </div>
              <div className="flex flex-col">
                <input type="date" value={person.kuendigungsdatumVVG} onChange={e => handlePersonChange(index, 'kuendigungsdatumVVG', e.target.value)} className="border rounded px-3 py-2 w-[160px]" />
                <label className="text-xs text-center mt-1">VVG Kündigen per</label>
              </div>
              <div className="flex gap-2">
                {personen.length < 6 && index === personen.length - 1 && (
                  <button onClick={handleAddPerson} className="px-2 py-1 bg-[#4B2E2B] text-white rounded shadow hover:bg-[#3a221f]">
                    <Plus className="w-4 h-4" />
                  </button>
                )}
                {personen.length > 1 && (
                  <button onClick={() => handleRemovePerson(index)} className="px-2">
                    <img src="/papierkorb.png" alt="Entfernen" className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-4">
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-[#8C3B4A] text-white rounded-xl shadow hover:bg-[#722f3a]"
          >
            Weiter zur Unterschrift
          </button>
        </div>
      </div>
    </div>
  );
};

export default KuendigungFormular;
