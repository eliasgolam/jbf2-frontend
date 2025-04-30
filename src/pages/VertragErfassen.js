// FINALER CODE - BUTTONS EIN WENIG NACH UNTEN VERSCHOBEN FÜR VOLLE KLICKBARKEIT

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Modal({ show, onClose, onSave, formData, setFormData }) {
  if (!show) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-[#00000080] flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold text-[#4B2E2B] mb-4">Vertrag hinzufügen</h2>
        <form className="grid gap-3">
          <input type="text" name="gesellschaft" placeholder="Gesellschaft" value={formData.gesellschaft || ''} onChange={handleInputChange} className="border px-3 py-1.5 rounded-xl" />
          <input type="text" name="vertragsnummer" placeholder="Vertragsnummer" value={formData.vertragsnummer || ''} onChange={handleInputChange} className="border px-3 py-1.5 rounded-xl" />
          <input type="date" name="beginn" value={formData.beginn || ''} onChange={handleInputChange} className="border px-3 py-1.5 rounded-xl" />
          <input type="date" name="ablauf" value={formData.ablauf || ''} onChange={handleInputChange} className="border px-3 py-1.5 rounded-xl" />
          <input type="number" name="betrag" placeholder="Betrag" value={formData.betrag || ''} onChange={handleInputChange} className="border px-3 py-1.5 rounded-xl" />
          <select name="zahlungsfrequenz" value={formData.zahlungsfrequenz || 'monatlich'} onChange={handleInputChange} className="border px-3 py-1.5 rounded-xl">
            <option value="monatlich">Monatlich</option>
            <option value="jährlich">Jährlich</option>
          </select>
          <div className="flex justify-end gap-4 mt-2">
            <button type="button" onClick={onClose} className="text-[#722f3a] hover:underline text-sm">Abbrechen</button>
            <button type="button" onClick={() => { onSave(formData); onClose(); }} className="bg-[#8C3B4A] text-white px-4 py-1.5 rounded-xl hover:bg-[#722f3a] text-sm">Speichern</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function VertragErfassen() {
  const navigate = useNavigate();
  const [vertraege, setVertraege] = useState([]);
  const [newVertrag, setNewVertrag] = useState({});
  const [showModal, setShowModal] = useState(false);
  const beraterName = 'Max Muster';
  const profilbild = '/default-profile.png';

  const openModal = (produkt) => {
    setNewVertrag({ produkt });
    setShowModal(true);
  };

  const handleSaveVertrag = (formData) => {
    setVertraege((prev) => [...prev, formData]);
    setNewVertrag({});
  };

  const handleDeleteVertrag = (index) => {
    setVertraege((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditVertrag = (index) => {
    setNewVertrag(vertraege[index]);
    setVertraege((prev) => prev.filter((_, i) => i !== index));
    setShowModal(true);
  };

  const produkte = [
    'Vorsorge Versicherung', 'Vorsorge Bank', 'Private Haftpflicht', 'Motorfahrzeug',
    'Rechtsschutz', 'Tierversicherung', 'Hypothek', 'Kredit', 'Sparplan', 'Todesfall',
    'Gebäude', 'Wertsachen', 'Krankenkasse'
  ];

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
        <h2 className="text-2xl sm:text-3xl font-bold text-[#4B2E2B] text-center mb-6">Vertrag hinzufügen</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6 mt-3">
          {produkte.map((produkt, i) => (
            <div key={i} className="flex items-center justify-center min-h-[3rem] w-full text-[#4B2E2B] border-2 border-[#8C3B4A] hover:bg-[#8C3B4A] hover:text-white text-sm px-3 py-2 rounded-md transition cursor-pointer" onClick={() => openModal(produkt)}>
              {produkt}
            </div>
          ))}
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#4B2E2B] text-center mb-2">Vertragsübersicht</h2>
          {vertraege.map((v, i) => (
            <div key={i} className="flex justify-between items-center border-2 border-[#8C3B4A] rounded-lg px-3 py-1.5 hover:bg-[#f4eeee] transition text-sm">
              <div>
                <strong className="text-[#8C3B4A]">{v.produkt}</strong> – {v.gesellschaft} | Pol.-Nr.: {v.vertragsnummer} | Ablauf: {v.ablauf}
              </div>
              <div className="flex gap-2">
                <img src={process.env.PUBLIC_URL + '/stift.png'} alt="Bearbeiten" className="w-4 h-4 cursor-pointer" onClick={() => handleEditVertrag(i)} />
                <img src={process.env.PUBLIC_URL + '/papierkorb.png'} alt="Löschen" className="w-4 h-4 cursor-pointer" onClick={() => handleDeleteVertrag(i)} />
              </div>
            </div>
          ))}
        </section>

        <div className="flex justify-between mt-8 px-4 sm:px-6 md:px-10">
  <button
    onClick={() => navigate('/beratungs-menue')}
    className="bg-gray-200 text-[#4B2E2B] px-5 py-2 rounded-xl hover:bg-[#8C3B4A] hover:text-white text-sm transition"
  >
    ← Zurück
  </button>

  <button
    onClick={() => navigate('/mandat-auswahl', { state: { vertraege: vertraege } })}
    className="bg-[#722f3a] text-white px-5 py-2 rounded-xl hover:bg-[#8C3B4A] text-sm transition"
  >
    Speichern und Weiter
  </button>
</div>

      </main>

      <footer className="w-full flex-shrink-0 flex justify-center items-center py-4 bg-white/10 backdrop-blur-sm mt-auto">
        <p className="text-xs text-gray-700 tracking-wide">© 2025 JB Finanz AG. Alle Rechte vorbehalten.</p>
      </footer>

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveVertrag}
        formData={newVertrag}
        setFormData={setNewVertrag}
      />
    </div>
  );
}

export default VertragErfassen;