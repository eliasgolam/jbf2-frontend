import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { useNavigate } from "react-router-dom";

const ASSOZIATIONEN = [
  "Familie",
  "Freunde",
  "Arbeitskollegen",
  "Vereinskollegen",
  "Nachbarn",
  "Menschen mit Kindern",
  "Menschen vor der Pensionierung",
  "Junge Erwachsene / Studierende",
  "Selbständige oder Unternehmer",
  "Menschen mit Immobilien",
  "Menschen, die oft in den Urlaub fahren",
  "Menschen, die viel Steuern zahlen",
  "Menschen mit Interesse an Investments",
  "Menschen, die bald heiraten",
  "Menschen, die ein Haus kaufen wollen",
  "Menschen mit viel Geld auf dem Konto",
  "Menschen mit Interesse an finanzieller Freiheit",
  "Menschen, die kürzlich ein Kind bekommen haben",
  "Menschen, die kürzlich umgezogen sind",
];

function Empfehlung() {
  const [openFor, setOpenFor] = useState(null);
  const [empfehlungen, setEmpfehlungen] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const gespeicherte = localStorage.getItem("empfehlungen");
    if (gespeicherte) {
      setEmpfehlungen(JSON.parse(gespeicherte));
    }
  }, []);

  const speichern = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const neueEmpfehlung = {
      id: Date.now(),
      assoziation: openFor,
      name: form.get("name"),
      vorname: form.get("vorname"),
      beruf: form.get("beruf"),
      telefon: form.get("telefon"),
      bezug: form.get("bezug"),
      notizen: form.get("notizen"),
    };
    const updated = [...empfehlungen, neueEmpfehlung];
    setEmpfehlungen(updated);
    localStorage.setItem("empfehlungen", JSON.stringify(updated));
    setOpenFor(null);
  };

  const beraterName = 'Max Muster';
  const profilbild = '/default-profile.png';

  return (
    <div className="relative min-h-screen flex flex-col bg-[#F8F5F2] pt-10" style={{ backgroundImage: 'url("/wave-bg.jpg")', backgroundSize: 'cover', backgroundAttachment: 'fixed' }}>
      <header className="relative z-10 flex justify-between items-center px-8 py-6">
        <div className="w-1/3" />
        <div className="w-1/3 flex justify-center">
          <img src="/logo.svg" alt="JB Finanz Logo" className="h-80 object-contain" />
        </div>
        <div className="w-1/3 flex justify-end items-center gap-4 text-right">
          <div className="text-sm sm:text-base text-[#4B2E2B] font-semibold">{beraterName}</div>
          <img src={profilbild} alt="Profil" className="h-12 w-12 rounded-full object-cover border border-gray-300" />
        </div>
      </header>

      <main className="flex-grow px-4 sm:px-6 md:px-10 max-w-6xl mx-auto w-full -mt-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#4B2E2B] text-center mb-6">Empfehlungen aufnehmen</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6 mt-3">
          {ASSOZIATIONEN.map((asso) => (
            <div key={asso} className="flex items-center justify-center min-h-[3rem] w-full text-[#4B2E2B] border-2 border-[#8C3B4A] hover:bg-[#8C3B4A] hover:text-white text-sm px-3 py-2 rounded-md transition cursor-pointer" onClick={() => setOpenFor(asso)}>
              {asso}
            </div>
          ))}
        </div>

        {openFor && (
          <Dialog open={!!openFor} onClose={() => setOpenFor(null)} className="fixed inset-0 z-50">
            <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="bg-white p-6 rounded-2xl max-w-md w-full shadow-xl">
                <Dialog.Title className="text-lg font-semibold mb-4">
                  Empfehlung erfassen ({openFor})
                </Dialog.Title>
                <form onSubmit={speichern} className="space-y-3">
                  <input name="vorname" placeholder="Vorname" className="w-full border p-2 rounded" required />
                  <input name="name" placeholder="Name" className="w-full border p-2 rounded" required />
                  <input name="beruf" placeholder="Beruf" className="w-full border p-2 rounded" />
                  <input name="telefon" placeholder="Telefonnummer" className="w-full border p-2 rounded" />
                  <input name="bezug" placeholder="Bezug zum Kunden" className="w-full border p-2 rounded" />
                  <textarea name="notizen" placeholder="Notizen" className="w-full border p-2 rounded" rows={3} />
                  <div className="flex justify-between mt-4">
                    <button type="button" onClick={() => setOpenFor(null)} className="px-4 py-2 rounded bg-gray-200 text-sm">Abbrechen</button>
                    <button type="submit" className="bg-[#8C3B4A] text-white px-4 py-2 rounded-xl hover:bg-[#722f3a] text-sm">Speichern</button>
                  </div>
                </form>
              </Dialog.Panel>
            </div>
          </Dialog>
        )}

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#4B2E2B] text-center mb-2">Empfehlungsübersicht</h2>
          {empfehlungen.map((e) => (
  <div key={e.id} className="relative flex flex-col border-2 border-[#8C3B4A] rounded-lg px-3 py-2 bg-white text-sm">
    <p><strong className="text-[#8C3B4A]">{e.vorname} {e.name}</strong> ({e.beruf})</p>
    <p><strong>Telefon:</strong> {e.telefon}</p>
    <p><strong>Bezug:</strong> {e.bezug}</p>
    <p><strong>Assoziation:</strong> {e.assoziation}</p>
    <p><strong>Notizen:</strong> {e.notizen}</p>

    {/* 🗑️ Papierkorb unten rechts */}
    <img
      src="/papierkorb.png"
      alt="Löschen"
      title="Empfehlung löschen"
      onClick={() => {
        const updated = empfehlungen.filter(emp => emp.id !== e.id);
        setEmpfehlungen(updated);
        localStorage.setItem("empfehlungen", JSON.stringify(updated));
      }}
      className="absolute bottom-2 right-2 w-5 h-5 cursor-pointer hover:scale-110 transition"
    />
  </div>
))}

        </section>
        <div className="flex justify-between mt-10 px-4 sm:px-6 md:px-10">
  <button
    onClick={() => navigate('/beratungs-menue')}
    className="bg-gray-200 text-[#4B2E2B] px-5 py-2 rounded-xl hover:bg-[#8C3B4A] hover:text-white text-sm transition"
  >
    ← Zurück
  </button>
  <button
    onClick={() => {
      localStorage.setItem("empfehlungen", JSON.stringify(empfehlungen));
      navigate('/beratungs-menue');
    }}
    className="bg-[#8C3B4A] text-white px-5 py-2 rounded-xl hover:bg-[#722f3a] text-sm transition"
  >
    Einreichen →
  </button>
</div>

      </main>

      <footer className="w-full flex-shrink-0 flex justify-center items-center py-4 bg-white/10 backdrop-blur-sm mt-auto">
        <p className="text-xs text-gray-700 tracking-wide">© 2025 JB Finanz AG. Alle Rechte vorbehalten.</p>
      </footer>
    </div>
  );
}

export default Empfehlung;