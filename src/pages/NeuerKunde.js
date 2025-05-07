import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../config';

// Wichtig: installieren mit `npm install react-places-autocomplete`
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';

function NeuerKunde() {
  const navigate = useNavigate();
  const [zeigeDuplikatWarnung, setZeigeDuplikatWarnung] = useState(false);
const [pendingKunde, setPendingKunde] = useState(null);


  // Für Fade-in-Effekt
  const [fadeIn, setFadeIn] = useState(false);

  // State für Adress-Autocomplete
  const [address, setAddress] = useState('');

  useEffect(() => {
    // Kleiner Timeout, damit beim Laden eine leichte Fade-in Animation entsteht
    const timer = setTimeout(() => setFadeIn(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Beim Klick in den Autocomplete-Vorschlag
  const handleSelect = async (value) => {
    setAddress(value);
    // Falls du Lat/Lng brauchst, könntest du so was machen:
    // const results = await geocodeByAddress(value);
    // const latLng = await getLatLng(results[0]);
    // console.log("Koordinaten:", latLng);
  };

  const handleBeratungStart = async () => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
  
    if (!user || !user.email) {
      alert("❌ Benutzer nicht korrekt eingeloggt oder keine E-Mail vorhanden.");
      return;
    }
  
    const kunde = {
      vorname: document.querySelector('[placeholder="Vorname"]').value,
      nachname: document.querySelector('[placeholder="Nachname"]').value,
      geburtsdatum: document.querySelector('[type="date"]').value,
      adresse: address,
      plz: document.querySelector('[placeholder="PLZ"]').value,
      ort: document.querySelector('[placeholder="Ort"]').value,
      zivilstand: document.querySelector('[placeholder="Zivilstand"]').value,
      raucher: document.querySelector('select').value,
      kinder: document.querySelector('[placeholder="Anzahl Kinder"]').value,
      beruf: document.querySelector('[placeholder="Beruf"]').value,
      email: document.querySelector('[placeholder="E-Mail"]').value,
      telefonnummer: document.querySelector('[placeholder="Telefonnummer"]').value,
      besitzer: user.email
    };
  
    try {
      const res = await fetch(`${API_BASE}/api/kunden/${user.email}`);
      const kunden = await res.json();
  
      const bereitsVorhanden = kunden.find(k => k.email === kunde.email);
  
      if (bereitsVorhanden) {
        setPendingKunde(kunde);
        setZeigeDuplikatWarnung(true);
        return;
      }
  
      await speichereKunde(kunde);
    } catch (error) {
      console.error('❌ Fehler:', error);
      alert('Fehler beim Abrufen der bestehenden Kunden.');
    }
  };
  
  const speichereKunde = async (kunde) => {
    try {
      const res = await fetch(`${API_BASE}/api/kunden`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(kunde)
      });
  
      if (!res.ok) throw new Error(await res.text());
  
      const gespeicherterKunde = await res.json();
      console.log('✅ Kunde erfolgreich gespeichert:', gespeicherterKunde);
      localStorage.setItem('ausgewaehlterKunde', JSON.stringify(gespeicherterKunde));
      localStorage.setItem('aktiveKundenId', gespeicherterKunde._id);
      
      // 🧹 Vorherige Daten explizit löschen
      localStorage.removeItem('antworten');
      localStorage.removeItem('protokollStatus');
      
      // 🆕 Leerer Antwortzustand mit verknüpfter Kunden-ID
      localStorage.setItem('antworten', JSON.stringify({
        kundendaten: {
          kundenId: gespeicherterKunde._id
        }
      }));
      
      navigate('/beratung-starten');
      
    } catch (error) {
      console.error('❌ Fehler beim Speichern des Kunden:', error);
      alert('Fehler beim Speichern des Kunden.');
    }
  };
  


  return (
    <div className="relative min-h-screen w-full flex flex-col font-sans">
      {/* 1) Hintergrundbild */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url("/wave-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      />
      {/* 2) Overlay */}
      <div className="absolute inset-0 bg-[#F8F5F2]/40" />

      {/* HEADER mit Fade-in */}
      <header
        className={`
          relative z-10 flex items-center justify-center
          px-6 py-8
          transition-all duration-700 ease-out
          ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
        `}
      >
        <img
          src="/logo.svg"
          alt="JB Finanz Logo"
          className="h-[500px] object-contain"
        />
      </header>

      {/* MAIN-Inhalt mit Fade-in */}
      <main
        className={`
          relative z-10 flex-grow flex items-center justify-center
          px-4 py-8
          transition-all duration-700 ease-out
          ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
        `}
      >
        {/* Glas-Container für das Formular */}
        <div className="
          w-full
          max-w-xl
          bg-white/15
          backdrop-blur-md
          border border-white/20
          rounded-2xl
          shadow-xl
          p-8
        ">
          <h1 className="
            text-3xl
            sm:text-4xl
            font-playfair
            font-bold
            text-[#4B2E2B]
            mb-6
            text-center
          ">
            📝 Neuer Kunde erfassen
          </h1>

          <form className="space-y-4 text-[#7E6B64] font-sans">

            {/* Anrede */}
<select
  className="
    w-full
    rounded-xl
    border border-gray-300
    px-4
    py-2
    shadow-sm
    focus:outline-none
    focus:ring-2
    focus:ring-[#8C3B4A]
  "
>
  <option>Herr</option>
  <option>Frau</option>
  <option>Divers</option>
</select>

            {/* Vorname / Nachname */}
            <div className="grid grid-cols-2 gap-4">
              <input
                className="
                  rounded-xl
                  border border-gray-300
                  px-4
                  py-2
                  shadow-sm
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#8C3B4A]
                "
                placeholder="Vorname"
              />
              <input
                className="
                  rounded-xl
                  border border-gray-300
                  px-4
                  py-2
                  shadow-sm
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#8C3B4A]
                "
                placeholder="Nachname"
              />
            </div>

            {/* Geburtsdatum */}
            <input
              type="date"
              className="
                w-full
                rounded-xl
                border border-gray-300
                px-4
                py-2
                shadow-sm
                focus:outline-none
                focus:ring-2
                focus:ring-[#8C3B4A]
              "
            />

            {/* Adress-Autocomplete */}
            <PlacesAutocomplete
              value={address}
              onChange={setAddress}
              onSelect={handleSelect}
            >
              {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div className="relative">
                  <input
                    {...getInputProps({
                      placeholder: "Adresse eingeben...",
                      className: `
                        w-full
                        rounded-xl
                        border border-gray-300
                        px-4
                        py-2
                        shadow-sm
                        focus:outline-none
                        focus:ring-2
                        focus:ring-[#8C3B4A]
                      `
                    })}
                  />
                  {suggestions?.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-lg z-50">
                      {loading && (
                        <div className="p-2 text-sm text-gray-500">
                          Lade Vorschläge...
                        </div>
                      )}
                      {suggestions.map((suggestion) => {
                        const style = suggestion.active
                          ? "bg-[#f1f5f9] cursor-pointer p-2"
                          : "bg-white cursor-pointer p-2";

                        return (
                          <div
                            {...getSuggestionItemProps(suggestion, { className: style })}
                            key={suggestion.placeId}
                          >
                            {suggestion.description}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </PlacesAutocomplete>

            {/* PLZ + Ort */}
            <div className="grid grid-cols-2 gap-4">
              <input
                className="
                  rounded-xl
                  border border-gray-300
                  px-4
                  py-2
                  shadow-sm
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#8C3B4A]
                "
                placeholder="PLZ"
              />
              <input
                className="
                  rounded-xl
                  border border-gray-300
                  px-4
                  py-2
                  shadow-sm
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#8C3B4A]
                "
                placeholder="Ort"
              />
            </div>

            {/* Zivilstand */}
            <input
              className="
                w-full
                rounded-xl
                border border-gray-300
                px-4
                py-2
                shadow-sm
                focus:outline-none
                focus:ring-2
                focus:ring-[#8C3B4A]
              "
              placeholder="Zivilstand"
            />

            {/* Raucher */}
            <select
              className="
                w-full
                rounded-xl
                border border-gray-300
                px-4
                py-2
                shadow-sm
                focus:outline-none
                focus:ring-2
                focus:ring-[#8C3B4A]
              "
            >
              <option>Nicht-Raucher</option>
              <option>Raucher</option>
            </select>

            {/* Kinder & Beruf */}
            <div className="grid grid-cols-2 gap-4">
              <input
                className="
                  rounded-xl
                  border border-gray-300
                  px-4
                  py-2
                  shadow-sm
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#8C3B4A]
                "
                placeholder="Anzahl Kinder"
              />
              <input
                className="
                  rounded-xl
                  border border-gray-300
                  px-4
                  py-2
                  shadow-sm
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#8C3B4A]
                "
                placeholder="Beruf"
              />
            </div>

            {/* E-Mail */}
            <input
              className="
                w-full
                rounded-xl
                border border-gray-300
                px-4
                py-2
                shadow-sm
                focus:outline-none
                focus:ring-2
                focus:ring-[#8C3B4A]
              "
              placeholder="E-Mail"
            />

            {/* Telefonnummer */}
            <input
              className="
                w-full
                rounded-xl
                border border-gray-300
                px-4
                py-2
                shadow-sm
                focus:outline-none
                focus:ring-2
                focus:ring-[#8C3B4A]
              "
              placeholder="Telefonnummer"
            />

            {/* Button: Beratung starten */}
            <button
              type="button"
              onClick={handleBeratungStart}
              className="
                w-full
                bg-[#8C3B4A]
                text-white
                hover:bg-[#7A3340]
                hover:scale-105
                transition-transform
                px-6
                py-3
                rounded-full
                font-semibold
                shadow
                duration-300
                text-lg
                mt-4
              "
            >
              Beratung starten
            </button>

            {/* Zurück */}
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="
                text-gray-500
                hover:text-gray-800
                transition
                text-sm
                mt-2
              "
            >
              ← Zurück
            </button>
          </form>
        </div>
      </main>

      {zeigeDuplikatWarnung && (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full text-center">
      <h2 className="text-lg font-bold text-[#4B2E2B] mb-4">⚠️ Kunde bereits erfasst</h2>
      <p className="text-sm text-gray-600 mb-6">
        Ein Kunde mit dieser E-Mail existiert bereits. Möchten Sie trotzdem fortfahren?
      </p>
      <div className="flex justify-between gap-4">
        <button
          onClick={() => setZeigeDuplikatWarnung(false)}
          className="px-4 py-2 bg-gray-200 rounded text-sm"
        >
          Abbrechen
        </button>
        <button
          onClick={() => {
            setZeigeDuplikatWarnung(false);
            speichereKunde(pendingKunde);
          }}
          className="px-4 py-2 bg-[#8C3B4A] text-white rounded text-sm hover:bg-[#722f3a]"
        >
          Trotzdem erfassen
        </button>
      </div>
    </div>
  </div>
)}


      {/* FOOTER */}
      <footer
        className="
          relative
          z-10
          flex
          justify-center
          items-center
          py-4
          bg-white/10
          backdrop-blur-sm
        "
      >
        <p className="text-xs text-gray-700 tracking-wide">
          © 2025 JB Finanz AG. Alle Rechte vorbehalten.
        </p>
      </footer>
    </div>
  );
}

export default NeuerKunde;
