// FINAL: Voll funktionsfähiger RenderKuendigungPDF mit 100% korrekter Logik
import React, { useRef, useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useNavigate } from 'react-router-dom';
import SignaturePad from 'react-signature-canvas';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const mmToPt = mm => mm * 2.83465;
const mmToPx = (mm, scale) => mm * (scale / A4_WIDTH_MM);

const RenderKuendigungPDF = ({ pdfDatei, antworten, setAntworten, onClose, onPDFGenerated }) => {
  const sigRef = useRef();
  const wrapperRef = useRef(null);
  const [viewerWidth, setViewerWidth] = useState(800);
  const [pageSizes, setPageSizes] = useState({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeSigField, setActiveSigField] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.scrollLeft =
        (wrapperRef.current.scrollWidth - wrapperRef.current.clientWidth) / 2;
    }
  }, [pageSizes]);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth >= 1440) setViewerWidth(1000);
      else if (screenWidth >= 1024) setViewerWidth(900);
      else if (screenWidth >= 768) setViewerWidth(750);
      else setViewerWidth(600);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const handleSigSave = () => {
    const canvas = sigRef.current.getTrimmedCanvas();
    const dataUrl = canvas.toDataURL('image/png');
  
    // 🔧 Aktuell gesetzte Antworten aktualisieren
    const updated = {
      ...antworten,
      signatureData: {
        ...antworten.signatureData,
        [activeSigField]: dataUrl
      }
    };
  
    setAntworten(updated); // ✅ State aktualisieren
    localStorage.setItem('antworten', JSON.stringify(updated)); // ✅ Auch speichern
  
    setActiveSigField(null); // ✅ Modal schließen
  };
  
  const formatDate = (isoString) => {
    if (!isoString) return '';
    const [year, month, day] = isoString.split('-');
    return `${day}.${month}.${year}`;
  };

  const fields = [
    { key: 'AbsenderName', page: 1, x: 20.2078, y: 267.2454, type: 'text' },
    { key: 'AbsenderStrasse', page: 1, x: 19.8383, y: 260.2468, type: 'text' },
    { key: 'AbsenderPlzOrt', page: 1, x: 19.9724, y: 253.7383, type: 'text' },
    { key: 'EmpfängerName', page: 1, x: 125.2368, y: 213.9625, type: 'text' },
    { key: 'EmpfängerStrasse', page: 1, x: 125.2368, y: 206.7787, type: 'text' },
    { key: 'EmpfängerPlzOrt', page: 1, x: 125.0103, y: 199.8635, type: 'text' },
    ...[1, 2, 3, 4, 5, 6].flatMap(i => [
      { key: `NameVorname${i}`, page: 1, x: 19.9813, y: 121.4967 - (i - 1) * 11.8533, type: 'text' },
      { key: `Geburtsdatum${i}`, page: 1, x: 85.6897, y: 121.5192 - (i - 1) * 11.8533, type: 'text' },
      { key: `U${i}`, page: 1, x: 120.1223, y: 122.8418 - (i - 1) * 11.8533, type: 'signature' },
      { key: `KVG${i}`, page: 1, x: 155.0247, y: 122.5127 - (i - 1) * 11.8533, type: 'check' },
      { key: `VVG${i}`, page: 1, x: 155.0247, y: 117.6443 - (i - 1) * 11.8533, type: 'check' },
      { key: `Kündigungsdatum${i}KVG`, page: 1, x: 165.0326, y: 123.6807 - (i - 1) * 11.8533, type: 'text' },
    { key: `Kündigungsdatum${i}VVG`, page: 1, x: 165.0549, y: 118.787  - (i - 1) * 11.8533, type: 'text' },

    ])
  ];

  const getValue = (key) => {
    const sigs = antworten?.signatureData || {};
    const personen = antworten?.personen || [];
  
    // 📌 Datum formatieren
    const formatDate = (iso) => {
      if (!iso || typeof iso !== 'string' || !iso.includes('-')) return iso;
      const [year, month, day] = iso.split('-');
      return `${day}.${month}.${year}`;
    };
  
    // 📌 Felder aus personen[]
    for (let i = 1; i <= 6; i++) {
      const p = personen[i - 1];
      if (!p) continue;
  
      if (key === `NameVorname${i}`) return `${p.vorname} ${p.nachname}`.trim();
      if (key === `Geburtsdatum${i}`) return formatDate(p.geburtsdatum);
      if (key === `Kündigungsdatum${i}KVG`) return formatDate(p.kuendigungsdatumKVG);
      if (key === `Kündigungsdatum${i}VVG`) return formatDate(p.kuendigungsdatumVVG);      
      if (key === `KVG${i}`) return !!p.kuendigungsdatumKVG;
      if (key === `VVG${i}`) return !!p.kuendigungsdatumVVG;
    }
  
    // ✅ Signaturen (U1–U6)
    if (sigs[key]) return sigs[key];
  
    // 📌 Standardfelder wie AbsenderName, EmpfängerName etc.
    if (typeof antworten[key] !== 'undefined') return antworten[key];
  
    return '';
  };
  
  


  const savePDF = async () => {
    const existingPdfBytes = await fetch(pdfDatei).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();
    const signatureExportCoords = {
        U1: { x: 120.1186, y: 115.6836 },
        U2: { x: 120.3532, y: 103.2617 },
        U3: { x: 120.3071, y: 91.5779 },
        U4: { x: 120.2607, y: 79.6632 },
        U5: { x: 120.1223, y: 67.7481 },
        U6: { x: 120.3071, y: 55.7870 }
      };
      
    for (const field of fields) {
      const value = getValue(field.key);
      try {
        const f = form.getFieldMaybe?.(field.key) || form.getField(field.key);
        if (field.type === 'check') {
          value ? f.check() : f.uncheck();
        } else if (field.type === 'text') {
          if (value) f.setText(value.toString());
        }
        f.enableReadOnly();
      } catch (e) {
        console.warn(`Feld ${field.key} konnte nicht gesetzt werden`, e);
      }
    }
  
    for (let i = 1; i <= 6; i++) {
        const sig = antworten?.signatureData?.[`U${i}`];
        if (sig) {
          const bytes = await fetch(sig).then(r => r.arrayBuffer());
          const image = await pdfDoc.embedPng(bytes);
          const coords = signatureExportCoords[`U${i}`]; // 🔄 Jetzt aus separaten Export-Koordinaten
          if (coords) {
            pages[0].drawImage(image, {
              x: mmToPt(coords.x),
              y: mmToPt(coords.y),
              width: mmToPt(30.7),
              height: mmToPt(7.7)
            });
          }
        }
      }
      
  
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    if (onPDFGenerated) onPDFGenerated(url);
    localStorage.setItem('antworten', JSON.stringify(antworten));
    navigate('/kuendigung/unterzeichnen');
  };
  
  return (
    <div className={`z-50 fixed inset-0 ${isFullscreen ? 'bg-black' : 'bg-black/40'} flex justify-center items-center`}>
      <div className={`${isFullscreen ? 'w-full h-screen px-0 py-0' : 'w-[90vw] max-w-[900px] h-[85vh]'} bg-white rounded-xl shadow-2xl overflow-y-auto relative`}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl font-bold z-50">×</button>
        <button onClick={() => setIsFullscreen(prev => !prev)} className="absolute top-4 right-12 z-50">
          <img src="/vollbild.png" alt="Vollbild" className="h-6 w-6" />
        </button>

        <div ref={wrapperRef} className="w-full overflow-x-auto overflow-y-auto">
          <Document file={pdfDatei}>
            {[1].map(page => (
              <div key={page} style={{ width: `${viewerWidth}px`, height: `${Math.round(viewerWidth * 1.414)}px`, position: 'relative', margin: '0 auto' }}>
                <Page
                  pageNumber={page}
                  width={viewerWidth}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  onRenderSuccess={({ width, height }) => {
                    setPageSizes(prev => ({ ...prev, [page]: { width, height } }));
                  }}
                />

                {pageSizes[page] && fields.filter(f => f.page === page).map(f => {
                  const value = getValue(f.key);
                  const top = (A4_HEIGHT_MM - f.y) * (pageSizes[page].height / A4_HEIGHT_MM);
                  const left = f.x * (pageSizes[page].width / A4_WIDTH_MM);
                  let adjustedTop = top;
                  let adjustedLeft = left;

                      // 🔧 Justierung für Absender-Felder
    if (['AbsenderName', 'AbsenderStrasse', 'AbsenderPlzOrt'].includes(f.key)) {
        adjustedTop += mmToPx(-7.5, pageSizes[page].height);
        adjustedLeft += mmToPx(0.5, pageSizes[page].width);
      }
  
      // 🔧 Justierung für Empfänger-Felder
      if (['EmpfängerName', 'EmpfängerStrasse', 'EmpfängerPlzOrt'].includes(f.key)) {
        adjustedTop += mmToPx(-7.5, pageSizes[page].height);
        adjustedLeft += mmToPx(0.5, pageSizes[page].width);
      }

      if (f.key.startsWith('NameVorname')) {
        adjustedTop += mmToPx(1.2, pageSizes[page].height);  // fein nach unten
        adjustedLeft += mmToPx(0, pageSizes[page].width);  // leicht nach rechts
      }

      if (f.key.startsWith('Geburtsdatum')) {
        adjustedTop += mmToPx(1.7, pageSizes[page].height);   // leicht nach unten
        adjustedLeft += mmToPx(0.7, pageSizes[page].width);    // leicht nach rechts
      }
      
      
  
                  if (f.key.startsWith('U')) adjustedTop -= 2;

                  if (f.type === 'text') {
                    return <div key={f.key} style={{ position: 'absolute', top: adjustedTop, left: adjustedLeft, fontSize: '15px', color: 'black', zIndex: 10 }}>{value}</div>;
                  }

                  if (f.type === 'check' && value) {
                    return (
                      <div
                        key={f.key}
                        style={{
                          position: 'absolute',
                          top: adjustedTop + mmToPx(-0.5, pageSizes[page].height), // optional leicht justiert
                          left: adjustedLeft + mmToPx(0.3, pageSizes[page].width), // optional leicht justiert
                          fontSize: '14px',
                          fontWeight: 'bold',
                          color: 'black',
                          zIndex: 10
                        }}
                      >
                        X
                      </div>
                    );
                  }
                  

                  if (f.type === 'signature') {
                    const isSigned = !!value;
                    return isSigned ? (
                      <img key={f.key} src={value} alt="Unterschrift" style={{ position: 'absolute', top: adjustedTop, left: adjustedLeft, width: '100px', height: '30px', objectFit: 'contain', zIndex: 10 }} />
                    ) : (
                      <div key={f.key} onClick={() => setActiveSigField(f.key)} style={{ position: 'absolute', top: adjustedTop, left: adjustedLeft, width: '100px', height: '30px', backgroundColor: 'rgba(140,59,74,0.3)', border: '1px dashed #4B2E2B', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
                        <span>Unterschrift</span>
                      </div>
                    );
                  }
                })}
              </div>
            ))}
          </Document>
        </div>
            
        <div className="absolute top-1 right-20 z-50">
  <button
    onClick={savePDF}
    className="px-5 py-2 bg-white/80 text-[#4B2E2B] border border-[#4B2E2B] rounded-xl shadow-sm backdrop-blur-md hover:bg-white hover:shadow-md transition-all duration-200"
  >
    Kündigung speichern
  </button>
</div>



        {activeSigField && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-[840px]">
              <h2 className="text-lg font-semibold mb-4">Unterschrift: {activeSigField}</h2>
              <div className="w-[800px] h-[200px] border rounded bg-white mb-4 shadow-inner">
                <SignaturePad
                  ref={sigRef}
                  minWidth={1.5}
                  maxWidth={2.5}
                  canvasProps={{ width: 800, height: 200, style: { width: '800px', height: '200px', backgroundColor: '#fff' } }}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => sigRef.current.clear()} className="text-sm px-4 py-1 border rounded">Löschen</button>
                <button onClick={() => setActiveSigField(null)} className="text-sm px-4 py-1 border rounded">Abbrechen</button>
                <button onClick={handleSigSave} className="text-sm px-4 py-1 bg-green-600 text-white rounded">Speichern</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RenderKuendigungPDF;
