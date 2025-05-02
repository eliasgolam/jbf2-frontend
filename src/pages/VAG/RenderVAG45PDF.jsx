// FINAL: RenderVAG45PDF – 3 Seiten + Vollbild + Popup-Eingabe für Textfelder
import React, { useRef, useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import SignaturePad from 'react-signature-canvas';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { useNavigate } from 'react-router-dom';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const mmToPt = mm => mm * 2.83465;
const mmToPx = (mm, scale) => mm * (scale / A4_WIDTH_MM);

const RenderVAG45PDF = ({ antworten, setAntworten, onClose, onPDFGenerated }) => {
  const sigRef = useRef();
  const wrapperRef = useRef(null);
  const [viewerWidth, setViewerWidth] = useState(800);
  const [pageSizes, setPageSizes] = useState({});
  const [activeSigField, setActiveSigField] = useState(null);
  const [activeTextField, setActiveTextField] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tempTextValue, setTempTextValue] = useState('');
  const navigate = useNavigate();

  const fields = [
    { key: 'KundenBerater', page: 3, x: 78.663, y: 252.4145, type: 'text' },
    { key: 'Ort_Datum', page: 3, x: 46.7766, y: 75.6001, type: 'text' },
    { key: 'UnterschriftBerater', page: 3, x: 86.2072, y: 63.6664, type: 'signature' },
    { key: 'UnterschriftKunde', page: 3, x: 56.371, y: 49.6853, type: 'signature' }
  ];

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

  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.scrollLeft =
        (wrapperRef.current.scrollWidth - wrapperRef.current.clientWidth) / 2;
    }
  }, [pageSizes]);
  
  const handleSigSave = () => {
    const canvas = sigRef.current.getTrimmedCanvas();
    const dataUrl = canvas.toDataURL('image/png');
    const updated = {
      ...antworten,
      signatureData: {
        ...antworten.signatureData,
        [activeSigField]: dataUrl
      }
    };
    setAntworten(updated);
    localStorage.setItem('antworten', JSON.stringify(updated));
    setActiveSigField(null);
  };

  const getValue = key => {
    if (antworten?.signatureData?.[key]) return antworten.signatureData[key];
    return antworten?.[key] || '';
  };

  const savePDF = async () => {
    const existingPdfBytes = await fetch('/Vag45.pdf').then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();


    // 📦 Neue Koordinaten NUR für PDF-Export
const exportCoords = {
  UnterschriftBerater: { x: 86.4382, y: 57.201 }, // Neue Position laut Screenshot 1
  UnterschriftKunde: { x: 56.1402, y: 43.2197 }   // Neue Position laut Screenshot 2
};

    for (const field of fields) {
      const value = getValue(field.key);
      try {
        const f = form.getFieldMaybe?.(field.key) || form.getField(field.key);
        if (field.type === 'text' && value) {
          f.setText(value.toString());
        }
        f.enableReadOnly();
      } catch (e) {
        console.warn(`Feld ${field.key} konnte nicht gesetzt werden`, e);
      }
    }
    for (const field of fields.filter(f => f.type === 'signature')) {
      const sig = antworten?.signatureData?.[field.key];
      if (sig) {
        const bytes = await fetch(sig).then(r => r.arrayBuffer());
        const image = await pdfDoc.embedPng(bytes);
    
        // 👇 Nutze Export-Koordinaten (wenn vorhanden), sonst Standard
        const coords = exportCoords[field.key] || { x: field.x, y: field.y };
    
        pages[field.page - 1].drawImage(image, {
          x: mmToPt(coords.x),
          y: mmToPt(coords.y),
          width: mmToPt(40),
          height: mmToPt(10)
        });
      }
    }
    

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    if (onPDFGenerated) onPDFGenerated(url);
    localStorage.setItem('antworten', JSON.stringify(antworten));
    navigate('/vag/unterzeichnen');
  };

  const totalPages = 3;

  return (
    <div className={`z-50 fixed inset-0 ${isFullscreen ? 'bg-black' : 'bg-black/40'} flex justify-center items-center`}>
      <div className={`${isFullscreen ? 'w-full h-screen px-0 py-0' : 'w-[90vw] max-w-[900px] h-[85vh]'} bg-white rounded-xl shadow-xl overflow-y-auto relative`}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl font-bold z-50">×</button>
        <button onClick={() => setIsFullscreen(prev => !prev)} className="absolute top-4 right-12 z-50">
          <img src="/vollbild.png" alt="Vollbild" className="h-6 w-6" />
        </button>

        <div ref={wrapperRef} className="w-full overflow-x-auto">
          <Document file="/Vag45.pdf">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <div key={page} style={{ width: `${viewerWidth}px`, height: `${Math.round(viewerWidth * 1.414)}px`, position: 'relative', margin: '0 auto' }}>
                <Page
                  pageNumber={page}
                  width={viewerWidth}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  onRenderSuccess={({ width, height }) => setPageSizes(prev => ({ ...prev, [page]: { width, height } }))}
                />

                {pageSizes[page] && fields.filter(f => f.page === page).map(f => {
                  const value = getValue(f.key);
                  const top = (A4_HEIGHT_MM - f.y) * (pageSizes[page].height / A4_HEIGHT_MM);
                  const left = f.x * (pageSizes[page].width / A4_WIDTH_MM);

                  let adjustedTop = top;
                  let adjustedLeft = left;

                  if (f.key === 'KundenBerater') {
                    adjustedTop -= mmToPx(419, pageSizes[page].height);
                    adjustedLeft += mmToPx(5, pageSizes[page].width);
                  }

                  if (f.key === 'Ort_Datum') {
                    adjustedTop += mmToPx(-1, pageSizes[page].height);   // leicht nach unten
                    adjustedLeft += mmToPx(0.3, pageSizes[page].width);   // leicht nach rechts
                  }

                  if (f.type === 'text') {
                    return (
                      <div
                        key={f.key}
                        onClick={() => {
                          setActiveTextField(f.key);
                          setTempTextValue(value);
                        }}
                        style={{ position: 'absolute', top: adjustedTop, left: adjustedLeft, fontSize: '14px', color: value ? 'black' : '#aaa', zIndex: 10, backgroundColor: '#fff', border: '1px dashed #999', padding: '2px 4px', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        {value || f.key}
                      </div>
                    );
                  }
                  if (f.type === 'signature') {
                    return value ? (
                      <img key={f.key} src={value} alt="Unterschrift" style={{ position: 'absolute', top: adjustedTop, left: adjustedLeft, width: '100px', height: '30px', objectFit: 'contain', zIndex: 10 }} />
                    ) : (
                      <div key={f.key} onClick={() => setActiveSigField(f.key)} style={{ position: 'absolute', top: adjustedTop, left: adjustedLeft, width: '100px', height: '30px', backgroundColor: '#eee', border: '1px dashed #999', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
                        Unterschrift
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            ))}
          </Document>
        </div>

        <div className="absolute top-1 right-20 z-50">
          <button
            onClick={savePDF}
            className="px-5 py-2 bg-white text-[#4B2E2B] border border-[#4B2E2B] rounded-xl shadow hover:bg-gray-100"
          >
            VAG speichern
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

        {activeTextField && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-[500px]">
              <h2 className="text-lg font-semibold mb-4">Eingabe: {activeTextField}</h2>
              <input
                className="w-full p-2 border rounded mb-4"
                value={tempTextValue}
                onChange={e => setTempTextValue(e.target.value)}
              />
              <div className="flex justify-end gap-3">
                <button onClick={() => setActiveTextField(null)} className="text-sm px-4 py-1 border rounded">Abbrechen</button>
                <button
                  onClick={() => {
                    const updated = { ...antworten, [activeTextField]: tempTextValue };
                    setAntworten(updated);
                    localStorage.setItem('antworten', JSON.stringify(updated));
                    setActiveTextField(null);
                  }}
                  className="text-sm px-4 py-1 bg-green-600 text-white rounded"
                >
                  Speichern
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RenderVAG45PDF;
