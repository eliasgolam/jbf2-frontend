// ✅ FINALER MANDAT PDF VIEWER – PERFEKTE QUALITÄT + 0.5MM OFFSET
import React, { useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import SignaturePad from 'react-signature-canvas';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const Y_OFFSET_MM = 2.5;
const SHIFT_Y_MM = -0.5; // ursprünglicher 0.2 + 0.5 mm mehr Offset für alle Elemente

const liveAdjustments = {
  anrede: { dx: 0.9, dy: 0.6 },
  geburtsdatum: { dx: 0.9, dy: 0.6 },
  vorname: { dx: 0.9, dy: 0.6 },
  nachname: { dx: 0.9, dy: 0.6 },
  adresse: { dx: 0.9, dy: 0.6 },
  plz: { dx: 0.9, dy: 0.6 },
  telefonnummer: { dx: 0.9, dy: 0.7 },
  email: { dx: 0.9, dy: 0.8 },
};


const vertragsPositionen = [
  { gesellschaftX: 17.3, produktX: 111.88, y: 119.06 },
  { gesellschaftX: 17.07, produktX: 111.86, y: 108.63 },
  { gesellschaftX: 17.29, produktX: 112.09, y: 98.01 },
  { gesellschaftX: 17.29, produktX: 112.32, y: 87.15 },
  { gesellschaftX: 17.30, produktX: 111.87, y: 77.13 },
  { gesellschaftX: 16.84, produktX: 111.64, y: 66.51 },
  { gesellschaftX: 16.82, produktX: 111.85, y: 55.84 },
  { gesellschaftX: 17.05, produktX: 111.85, y: 45.45 },
];

const fields = [
  { key: 'anrede', page: 1, x: 39.0548, y: 243.6723 + 1.3 - SHIFT_Y_MM },
  { key: 'geburtsdatum', page: 1, x: 127.59, y: 243.6723 + 1.3 - SHIFT_Y_MM },
  { key: 'vorname', page: 1, x: 42.5375, y: 228.1849 + 1.3 - SHIFT_Y_MM },
  { key: 'nachname', page: 1, x: 119.90, y: 228.1849 + 1.3 - SHIFT_Y_MM },
  { key: 'adresse', page: 1, x: 46.5203, y: 212.5171 + 1.3 - SHIFT_Y_MM },
  { key: 'plz', page: 1, x: 116.61, y: 212.5171 + 1.3 - SHIFT_Y_MM },
  { key: 'telefonnummer', page: 1, x: 55.26, y: 196.91 + 1.3 - SHIFT_Y_MM },
  { key: 'email', page: 1, x: 111.15, y: 196.91 + 1.3 - SHIFT_Y_MM },
  { key: 'ortdatum', page: 2, x: 59.4397, y: 80.4795 + 1.3 - SHIFT_Y_MM, w: 60.5944, h: 7.3893 },
  { key: 'unterschriftKunde', page: 2, x: 78.7208, y: 58.0506 + 1.3 - SHIFT_Y_MM, w: 46.0856, h: 8.7746, isSignature: true },
  { key: 'unterschriftBerater', page: 2, x: 78.8267, y: 35.702 + 1.3 - SHIFT_Y_MM, w: 46.0856, h: 8.7746, isSignature: true },
];

const MandatPDFViewer = ({ pdfDatei = "/JBFinanzMandat.pdf", kunde = {}, vertraege = [], onClose, onPDFGenerated }) => {
  const [formData, setFormData] = useState({
    ...kunde,
    geburtsdatum: formatDate(kunde.geburtsdatum),
    datum: formatDate(kunde.datum)
  });
  const [editingField, setEditingField] = useState(null);
  const [pageSizes, setPageSizes] = useState({});
  const [saving, setSaving] = useState(false);
  const sigRef = useRef();
  const [activeSigField, setActiveSigField] = useState(null);
  const [signatureData, setSignatureData] = useState({ kunde: null, berater: null });
  const [ortDatumModalOpen, setOrtDatumModalOpen] = useState(false);
const [ortDatumWerte, setOrtDatumWerte] = useState({ ort: '', datum: '' });


  const handleInputChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSigSave = () => {
    const originalCanvas = sigRef.current.getTrimmedCanvas();
    const key = activeSigField === 'unterschriftKunde' ? 'kunde' : 'berater';
    const f = fields.find(f => f.key === (key === 'kunde' ? 'unterschriftKunde' : 'unterschriftBerater'));
  
    const DPI = 300;
    const MM_PER_INCH = 25.4;
  
    const mmWidth = f.w ?? 46.0856;
    const mmHeight = f.h ?? 8.7746;
  
    const aspectRatio = mmWidth / mmHeight;
    const targetHeight = 200; // px
    const targetWidth = Math.round(targetHeight * aspectRatio); // px
  
    const scaled = document.createElement('canvas');
    scaled.width = targetWidth;
    scaled.height = targetHeight;
  
    const ctx = scaled.getContext('2d');
    ctx.drawImage(originalCanvas, 0, 0, targetWidth, targetHeight);
  
    const dataUrl = scaled.toDataURL('image/png', 1.0);
  
    setSignatureData(prev => ({ ...prev, [key]: dataUrl }));
    setActiveSigField(null);
  };
  

  const mmToPt = mm => mm * 2.83465;

  const savePDF = async () => {
    setSaving(true);
    const existingPdfBytes = await fetch(pdfDatei).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();

    const form = pdfDoc.getForm();

    const pdfFieldMap = {
      anrede: 'Anrede',
      geburtsdatum: 'Geburtsdatum',
      vorname: 'Vorname',
      nachname: 'Nachname',
      adresse: 'Strasse  Nr',     // ← mit 2 Leerzeichen
      plz: 'PLZ  Ort',            // ← mit 2 Leerzeichen
      telefonnummer: 'Telefonnummer',
      email: 'Email',
      ortdatum: 'Ort  Datum',
      unterschriftKunde: 'Unterschrift Kunde',
      unterschriftBerater: 'Unterschrift Berater'
    };
    

fields.forEach(f => {
  const val = formData[f.key];
  if (!f.isSignature && val?.trim()) {
    try {
      const fieldName = pdfFieldMap[f.key];
if (!fieldName) return;
const textField = form.getTextField(fieldName);

      textField.setText(val);
      textField.enableReadOnly(); // optional
    } catch (err) {
      // Fallback (falls Feld nicht existiert)
      pages[f.page - 1].drawText(val, {
        x: mmToPt(f.x),
        y: mmToPt(A4_HEIGHT_MM - f.y),
        size: 12,
        font,
        color: rgb(0, 0, 0)
      });
    }
  }
});


vertraege.slice(0, 8).forEach((v, i) => {
  if (!v || !v.gesellschaft || !v.produkt) return;

  try {
    const gesellschaftField = form.getTextField(`Text${i + 1}`);
    const produktField = form.getTextField(`Text${i + 9}`);

    gesellschaftField.setText(v.gesellschaft);
    produktField.setText(v.produkt);

    gesellschaftField.enableReadOnly();
    produktField.enableReadOnly();
  } catch (err) {
    console.warn(`Formularfeld Text${i + 1} oder Text${i + 9} nicht gefunden`);
  }
});


// Unterschrift Kunde
if (signatureData.kunde) {
  const sigBytes = await fetch(signatureData.kunde).then(res => res.arrayBuffer());
  const sigImage = await pdfDoc.embedPng(sigBytes);

  pages[1].drawImage(sigImage, {
    x: mmToPt(79.6442),
    y: mmToPt(55.9725),
    width: mmToPt(46.0858),
    height: mmToPt(8.7746)
  });
}

// Unterschrift Berater
if (signatureData.berater) {
  const sigBytes = await fetch(signatureData.berater).then(res => res.arrayBuffer());
  const sigImage = await pdfDoc.embedPng(sigBytes);

  pages[1].drawImage(sigImage, {
    x: mmToPt(79.9813),
    y: mmToPt(33.624),
    width: mmToPt(46.0855),
    height: mmToPt(8.7746)
  });
}



const pdfBytes = await pdfDoc.save();
const blob = new Blob([pdfBytes], { type: 'application/pdf' });
const url = URL.createObjectURL(blob);

// 👉 Übergib die PDF-URL an den Eltern-Container
if (onPDFGenerated) {
  onPDFGenerated(url);
}

const a = document.createElement('a');
a.href = url;
a.download = `Mandat_${formData.vorname || 'Vorname'}_${formData.nachname || 'Nachname'}.pdf`;
a.click();

// ❗ wichtig: erst NACH click URL revoken, sonst ist sie ungültig
setTimeout(() => {
  URL.revokeObjectURL(url);
}, 1000);

setSaving(false);

// 👉 Viewer nach Speichern schließen
onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
      <div className="bg-white rounded shadow-xl max-w-[850px] w-full h-[95vh] overflow-y-auto relative p-4">
        <button onClick={onClose} className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-xl font-bold">×</button>
        <Document file={pdfDatei}>
          {[1, 2, 3].map(page => (
            <div key={page} className="relative mx-auto my-6 shadow border" style={{ width: '800px', height: '1123px' }}>
              <Page
                pageNumber={page}
                width={800}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                onRenderSuccess={({ width, height }) => {
                  setPageSizes(prev => ({ ...prev, [page]: { width, height } }));
                }}
              />
              {pageSizes[page] && fields.filter(f => f.page === page).map(f => {
                const value = formData[f.key];
                const hasSignature = f.isSignature && signatureData[f.key === 'unterschriftKunde' ? 'kunde' : 'berater'];
                const adj = liveAdjustments[f.key] || { dx: 0, dy: 0 };
const top = (A4_HEIGHT_MM - (f.y + adj.dy) - Y_OFFSET_MM) * (pageSizes[page].height / A4_HEIGHT_MM);
const left = (f.x + adj.dx) * (pageSizes[page].width / A4_WIDTH_MM);

                const width = f.w ? f.w * (pageSizes[page].width / A4_WIDTH_MM) : undefined;
                const height = f.h ? f.h * (pageSizes[page].height / A4_HEIGHT_MM) : undefined;

                if (f.isSignature) {
                  const adjustedHeight = height || 40; // Fallback in Pixel (je nach Layout)
                
                  return hasSignature ? (
                    <img
                      key={f.key}
                      src={hasSignature}
                      alt="sign"
                      style={{
                        position: 'absolute',
                        left,
                        top,
                        width,
                        height,
                        objectFit: 'contain',
                        imageRendering: 'crisp-edges',
                        aspectRatio: `${f.w} / ${f.h}`, // sorgt für korrektes Seitenverhältnis
                        zIndex: 10
                      }}
                      
                      
                    />
                  ) : (
                    <button
                      key={f.key}
                      onClick={() => setActiveSigField(f.key)}
                      style={{
                        position: 'absolute',
                        left,
                        top,
                        width,
                        height,
                        transform: 'translateY(-50%)', // funktioniert bei Buttons
                        zIndex: 10
                      }}
                      className="bg-blue-100 text-xs rounded border"
                    >
                      Unterschreiben
                    </button>
                  );
                }
                
                if (f.key === 'ortdatum') {
                  if (!value || editingField === f.key) {
                    return (
                      <button
                        key="ortdatum-button"
                        onClick={() => setOrtDatumModalOpen(true)}
                        style={{
                          position: 'absolute',
                          left,
                          top,
                          width,
                          height,
                          transform: 'translateY(-50%)',
                          zIndex: 10
                        }}
                        
                        className="p-1 border rounded text-sm bg-blue-50"
                      >
                        Ort & Datum eingeben
                      </button>
                    );
                  }
                
                  return (
                    <div
                      key="ortdatum-display"
                      onClick={() => setOrtDatumModalOpen(true)}
                      style={{
                        position: 'absolute',
                        left,
                        top,
                        fontSize: '15px',
                        fontWeight: 500,
                        lineHeight: 1,
                        padding: 0,
                        margin: 0,
                        zIndex: 10,
                        cursor: 'pointer'
                      }}
                    >
                      {value}
                    </div>
                  );
                }
                
                

                return editingField === f.key || !value ? (
                  <input
  key={`input-${f.key}`}
  value={formData[f.key] || ''}
  onFocus={() => setEditingField(f.key)}
  onChange={(e) => handleInputChange(f.key, e.target.value)}
  onBlur={() => setEditingField(null)}
  style={{
    position: 'absolute',
    left,
    top,
    width: width || 160,
    height,
    fontSize: '15px',
    lineHeight: 1,
    padding: 0,
    margin: 0,
    transform: 'translateY(-2.5px)', // 👈 das ist der magische Teil!
    zIndex: 10
  }}
  className="p-1 border rounded text-sm"
/>

                ) : (
                  <div
                    key={`div-${f.key}`}
                    onClick={() => setEditingField(f.key)}
                    style={{ position: 'absolute', left, top, fontSize: '15x', fontWeight: 500, zIndex: 10, cursor: 'pointer' }}
                  >
                    {value || ''}
                  </div>
                );
              })}
              {page === 3 && pageSizes[3] && vertraege.slice(0, 8).map((v, i) => {
                const pos = vertragsPositionen[i];
                const scaleX = pageSizes[page].width / A4_WIDTH_MM;
                const scaleY = pageSizes[page].height / A4_HEIGHT_MM;
                const fontSizePx = 15;
const baselineOffset = fontSizePx * 0.8;

const top = (A4_HEIGHT_MM - pos.y - Y_OFFSET_MM) * scaleY - baselineOffset;

                const gesellschaftLeft = pos.gesellschaftX * scaleX;
                const produktLeft = pos.produktX * scaleX;
                return (
                  <React.Fragment key={i}>
                    <div style={{ position: 'absolute', left: gesellschaftLeft, top, fontSize: '15px', zIndex: 10 }}>{v.gesellschaft}</div>
                    <div style={{ position: 'absolute', left: produktLeft, top, fontSize: '15px', zIndex: 10 }}>{v.produkt}</div>
                  </React.Fragment>
                );
              })}
            </div>
          ))}
        </Document>
        <div className="flex justify-end mt-4">
          <button onClick={savePDF} disabled={saving} className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">{saving ? 'Speichern...' : 'PDF speichern'}</button>
        </div>
      </div>
      {ortDatumModalOpen && (
  <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded shadow-xl w-[400px]">
      <h2 className="text-lg font-bold mb-4">Ort & Datum eingeben</h2>
      <input
        type="text"
        placeholder="Ort"
        value={ortDatumWerte.ort}
        onChange={(e) => setOrtDatumWerte(prev => ({ ...prev, ort: e.target.value }))}
        className="w-full border rounded p-2 mb-3"
      />
      <input
        type="text"
        placeholder="Datum (z. B. 17.04.2025)"
        value={ortDatumWerte.datum}
        onChange={(e) => setOrtDatumWerte(prev => ({ ...prev, datum: e.target.value }))}
        className="w-full border rounded p-2 mb-4"
      />
      <div className="flex justify-end gap-3">
        <button onClick={() => setOrtDatumModalOpen(false)}>Abbrechen</button>
        <button
          className="bg-green-600 text-white px-4 py-1 rounded"
          onClick={() => {
            setFormData(prev => ({
              ...prev,
              ortdatum: `${ortDatumWerte.ort}, ${ortDatumWerte.datum}`
            }));
            setOrtDatumModalOpen(false);
          }}
        >
          Übernehmen
        </button>
      </div>
    </div>
  </div>
)}

{activeSigField && (
  <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
    <div
  className="bg-white p-6 rounded-xl shadow-2xl w-full"
  style={{
    maxWidth: '840px',
    width: '100%',
    margin: '0 auto'
  }}
>
      <h2 className="text-lg font-semibold mb-4">
        Unterschrift: {activeSigField === 'unterschriftKunde' ? 'Kunde' : 'Berater'}
      </h2>
      <div
        style={{
          width: '800px', // exakt gleich wie canvas width
          height: '200px', // exakt gleich wie canvas height
          border: '1px solid #ccc',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 4px rgba(0,0,0,0.1)',
          backgroundColor: '#fff',
          marginBottom: '1rem'
        }}
      >
        <SignaturePad
          ref={sigRef}
          minWidth={1.5}
          maxWidth={2.5}
          canvasProps={{
            width: 800,
            height: 200,
            style: {
              width: '800px',   // 💥 identisch zur internen Canvasgröße
              height: '200px',
              display: 'block',
              backgroundColor: '#fff'
            }
          }}
        />
      </div>
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={() => sigRef.current.clear()}
          className="text-sm px-4 py-1 rounded border border-gray-300 hover:bg-gray-100"
        >
          Löschen
        </button>
        <button
          onClick={() => setActiveSigField(null)}
          className="text-sm px-4 py-1 rounded border border-gray-300 hover:bg-gray-100"
        >
          Abbrechen
        </button>
        <button
          onClick={handleSigSave}
          className="text-sm px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Speichern
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear()}`;
};

export default MandatPDFViewer;