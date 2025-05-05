// RenderBeratungsprotokoll.jsx – FINAL 100% funktionierend mit Platzhaltern für fields[] & pdfFieldMap
import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle
} from 'react';

import { Document, Page, pdfjs } from 'react-pdf';
import { useNavigate } from 'react-router-dom';
import SignaturePad from 'react-signature-canvas';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const mmToPt = mm => mm * 2.83465;
const mmToPx = (mm, scale) => mm * (scale / A4_WIDTH_MM);






const RenderBeratungsprotokoll = ({
  pdfDatei,
  setSignatureData,
  setOrtDatum,
  onClose,
  onPDFGenerated,
  antworten,
  setAntworten
}) => {

  const sigRef = useRef();
  const wrapperRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pageSizes, setPageSizes] = useState({});
  const [viewerWidth, setViewerWidth] = useState(800);
  const [activeSigField, setActiveSigField] = useState(null);
  const [ortDatumModalOpen, setOrtDatumModalOpen] = useState(false);
  const [ortDatumWerte, setOrtDatumWerte] = useState({ ort: '', datum: '' });
  const [beraterName, setBeraterName] = useState(antworten?.beraterName || '');
  const [nameBeraterModalOpen, setNameBeraterModalOpen] = useState(false);
  const [nameBeraterWert, setNameBeraterWert] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.scrollLeft =
        (wrapperRef.current.scrollWidth - wrapperRef.current.clientWidth) / 2;
    }
  }, [pageSizes]); // oder: [showViewer] wenn du das aus BrowserUnterzeichnen steuerst
  
  useEffect(() => {
    const screenWidth = window.innerWidth;
    const maxViewerWidth = 1000;
    const minViewerWidth = 320; // untere Grenze fürs Handy
  
    const idealWidth = Math.min(screenWidth * 0.95, maxViewerWidth);
    setViewerWidth(Math.max(idealWidth, minViewerWidth));
  }, []);


  
  


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

const saveAntworten = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user?.email) return; // Schutz falls user fehlt
    await fetch(`/api/antworten/${user.email}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
  } catch (error) {
    console.error('❌ Fehler beim Speichern der Antworten:', error);
  }
};

saveAntworten();

setActiveSigField(null);

  };
  
  

  const savePDF = async () => {
    setSaving(true);
    const existingPdfBytes = await fetch(pdfDatei).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();
    const form = pdfDoc.getForm();
    

    const pdfFieldMap = {
      // ✅ Kundendaten
      Anrede: antworten?.kundendaten?.anrede,
      Geburtsdatum: antworten?.kundendaten?.geburtsdatum,
      Vorname: antworten?.kundendaten?.vorname,
      Nachname: antworten?.kundendaten?.nachname,
      'Strasse  Nr': antworten?.kundendaten?.adresse,
      'PLZ  Ort': antworten?.kundendaten?.plzOrt,
      Telefonnummer: antworten?.kundendaten?.telefon,
      Email: antworten?.kundendaten?.email,
    
      // ✅ Vertragsdaten
      Gesellschaft: antworten?.vertraege?.[0]?.gesellschaft,
      Sparte: antworten?.vertraege?.[0]?.sparte,
      Gesellschaft_2: antworten?.vertraege?.[1]?.gesellschaft,
      Sparte_2: antworten?.vertraege?.[1]?.sparte,
      Gesellschaft_3: antworten?.vertraege?.[2]?.gesellschaft,
      Sparte_3: antworten?.vertraege?.[2]?.sparte,
    
      // ✅ Gesprächsarten
      Art1: antworten?.gespraechsarten?.includes('Datenerhebung'),
      Art2: antworten?.gespraechsarten?.includes('Beratungsgespräch'),
      Art3: antworten?.gespraechsarten?.includes('Servicetermin'),
    
      // ✅ Beratungsthemen
      Themen1: antworten?.themen?.includes('Vorsorge'),
      Themen2: antworten?.themen?.includes('Gesundheitsvorsorge'),
      Themen3: antworten?.themen?.includes('Vermögensanlagen'),
      Themen4: antworten?.themen?.includes('Sach – und Vermögensversicherungen'),
    
      // ✅ Fragen (global fortlaufend gezählt)
      ja_1: antworten?.fragen?.['Wurden Verträge abgeschlossen?'] === 'ja',
      nein_1: antworten?.fragen?.['Wurden Verträge abgeschlossen?'] === 'nein',
    
      ja_2: antworten?.fragen?.['Waren Sie mit der Beratung zufrieden?'] === 'ja',
      nein_2: antworten?.fragen?.['Waren Sie mit der Beratung zufrieden?'] === 'nein',
    
      ja_3: antworten?.fragen?.['Wurden alle Fragen vollständig geklärt?'] === 'ja',
      nein_3: antworten?.fragen?.['Wurden alle Fragen vollständig geklärt?'] === 'nein',
    
      ja_4: antworten?.fragen?.['Haben Sie die Angaben wahrheitsgetreu gemacht?'] === 'ja',
      nein_4: antworten?.fragen?.['Haben Sie die Angaben wahrheitsgetreu gemacht?'] === 'nein',
    
      ja_5: antworten?.fragen?.['Wurden Sie über Kosten informiert?'] === 'ja',
      nein_5: antworten?.fragen?.['Wurden Sie über Kosten informiert?'] === 'nein',
    
      ja_6: antworten?.fragen?.['Entsprechen die Produkte Ihren Zielen?'] === 'ja',
      nein_6: antworten?.fragen?.['Entsprechen die Produkte Ihren Zielen?'] === 'nein',
    
      ja_7: antworten?.fragen?.['Wurden AGB und Produktinfos erklärt?'] === 'ja',
      nein_7: antworten?.fragen?.['Wurden AGB und Produktinfos erklärt?'] === 'nein',
    
      ja_8: antworten?.fragen?.['Wurden Beginn/Dauer/Kündigung besprochen?'] === 'ja',
      nein_8: antworten?.fragen?.['Wurden Beginn/Dauer/Kündigung besprochen?'] === 'nein',
    
      ja_9: antworten?.fragen?.['Sind Sie sich über die Verbindlichkeit bewusst?'] === 'ja',
      nein_9: antworten?.fragen?.['Sind Sie sich über die Verbindlichkeit bewusst?'] === 'nein',
    
      // ✅ Gesundheitsvorsorge
      ja_10: antworten?.fragen?.['Wurden Sie über versicherte Risiken informiert?'] === 'ja',
      nein_10: antworten?.fragen?.['Wurden Sie über versicherte Risiken informiert?'] === 'nein',
    
      ja_11: antworten?.fragen?.['Wurden mögliche Karenzfristen erklärt?'] === 'ja',
      nein_11: antworten?.fragen?.['Wurden mögliche Karenzfristen erklärt?'] === 'nein',
    
      ja_12: antworten?.fragen?.['Wurde ein Überblick über Leistungen gegeben?'] === 'ja',
      nein_12: antworten?.fragen?.['Wurde ein Überblick über Leistungen gegeben?'] === 'nein',
    
      // ✅ Vermögensanlagen
      ja_13: antworten?.fragen?.['Ist Ihnen der langfristige Anlagehorizont bewusst?'] === 'ja',
      nein_13: antworten?.fragen?.['Ist Ihnen der langfristige Anlagehorizont bewusst?'] === 'nein',
    
      ja_14: antworten?.fragen?.['Wissen Sie, dass Anlagen von Faktoren abhängen?'] === 'ja',
      nein_14: antworten?.fragen?.['Wissen Sie, dass Anlagen von Faktoren abhängen?'] === 'nein',
    
      ja_15: antworten?.fragen?.['Ist Ihnen Volatilität bei Anlagen bewusst?'] === 'ja',
      nein_15: antworten?.fragen?.['Ist Ihnen Volatilität bei Anlagen bewusst?'] === 'nein',
    
      // ✅ Sachversicherung
      ja_16: antworten?.fragen?.['Stimmt das versicherte Risiko mit Ihrem Bedarf überein?'] === 'ja',
      nein_16: antworten?.fragen?.['Stimmt das versicherte Risiko mit Ihrem Bedarf überein?'] === 'nein',
    
      // ✅ Motivtexte
      Motiv1: antworten?.motiv1,
      Motiv2: antworten?.motiv2,
      Motiv3: antworten?.motiv3,
    
      // ✅ Kündigung
      'Check Box1': antworten?.kuendigung === 'Checkbox1',
      'Check Box2': antworten?.kuendigung === 'Checkbox2',
      'Check Box3': antworten?.kuendigung === 'Checkbox3',
    };
    
    console.log('✅ DEBUG: antworten', antworten);
console.log('✅ DEBUG: pdfFieldMap', pdfFieldMap);
      
      Object.entries(pdfFieldMap).forEach(([fieldName, value]) => {
        try {
          console.log(`🧾 PDF-Feld "${fieldName}" bekommt Wert:`, value);
          const field = form.getFieldMaybe?.(fieldName) || form.getField(fieldName);
      
          if (typeof value === 'boolean') {
            value ? field.check() : field.uncheck();
          } else if (typeof value === 'string') {
            field.setText(value);
          }
      
          field.enableReadOnly();
        } catch (e) {
          console.warn(`Feld ${fieldName} konnte nicht verarbeitet werden`, e);
        }
      });
      
      if (antworten.signatureData?.UnterschriftKunde)
        {
          const sigBytes = await fetch(antworten.signatureData.UnterschriftKunde).then(r => r.arrayBuffer());
        const sigImage = await pdfDoc.embedPng(sigBytes);
      
        const heightMm = 11.6866;
        const yMm = 160.816 - (heightMm * 1.0); // statt vorher 1.5x → jetzt 1.0x
      
        pages[3].drawImage(sigImage, {
          x: mmToPt(92.8259),
          y: mmToPt(yMm),
          width: mmToPt(49.6839),
          height: mmToPt(heightMm)
        });
      }
      
      
      
      
      

 // ✅ Signatur Berater
 if (antworten.signatureData?.UnterschriftBerater) {
  const sigBytes = await fetch(antworten.signatureData.UnterschriftBerater).then(r => r.arrayBuffer());
  const sigImage = await pdfDoc.embedPng(sigBytes);
  pages[3].drawImage(sigImage, {
    x: mmToPt(141.0703),
    y: mmToPt(135.1049),
    width: mmToPt(33.0737),
    height: mmToPt(10.16)
  });
}



if (antworten.ortDatum){
  try {
    const ortDatumField = form.getTextField('Ort_Datum');
    ortDatumField.setText(antworten.ortDatum || '');
    ortDatumField.enableReadOnly(); // optional: schützt Feld vor nachträglicher Bearbeitung
  } catch (e) {
    console.warn('OrtDatum-Feld konnte nicht gesetzt werden', e);
  }
}


if (beraterName) {
  try {
    const nameField = form.getTextField('NameBerater'); // Name muss exakt stimmen!
    nameField.setText(beraterName);
    nameField.enableReadOnly(); // optional
  } catch (e) {
    console.warn('NameBerater-Feld konnte nicht gesetzt werden', e);
  }
}

      

const pdfBytes = await pdfDoc.save();
const blob = new Blob([pdfBytes], { type: 'application/pdf' });
const url = URL.createObjectURL(blob);

// ✅ Gib PDF-URL an Parent zurück (Viewer)
if (onPDFGenerated) onPDFGenerated(url);

// ✅ Speichere für späteren Zugriff (BrowserUnterzeichnen)
localStorage.setItem('lastGeneratedPDFUrl', url);

// ✅ Speichere im Backend (optional)
const user = JSON.parse(localStorage.getItem('loggedInUser'));
if (user?.email) {
  fetch(`/api/antworten/${user.email}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(antworten)
  }).catch(err => console.error('❌ Fehler beim Speichern der Antworten:', err));
}

// ✅ Viewer schließen & weiterleiten – exakt wie bei Kuendigung
setSaving(false);
navigate('/browserunterzeichnen');




 };

  const fields = [
    // Seite 1
    { key: 'anrede', page: 1, x: 62.3993, y: 252.73, type: 'text' },
    { key: 'geburtsdatum', page: 1, x: 141.3087, y: 252.73, type: 'text' },
    { key: 'vorname', page: 1, x: 62.3993, y: 243.967, type: 'text' },
    { key: 'nachname', page: 1, x: 134.0274, y: 243.9247, type: 'text' },
    { key: 'adresse', page: 1, x: 62.3993, y: 235.1617, type: 'text' },
    { key: 'plzOrt', page: 1, x: 130.81, y: 235.1617, type: 'text' },
    { key: 'telefon', page: 1, x: 62.3147, y: 226.3987, type: 'text' },
    { key: 'email', page: 1, x: 124.079, y: 226.3564, type: 'text' },
    { key: 'Art1', page: 1, x: 24.7842, y: 198.3394, type: 'check' },
    { key: 'Art2', page: 1, x: 24.7939, y: 192.0473, type: 'check' },
    { key: 'Art3', page: 1, x: 24.9093, y: 185.9859, type: 'check' },
    { key: 'Themen1', page: 1, x: 24.9767, y: 171.2807, type: 'check' },
    { key: 'Themen2', page: 1, x: 24.9767, y: 165.3117, type: 'check' },
    { key: 'Themen3', page: 1, x: 24.9767, y: 159.3003, type: 'check' },
    { key: 'Themen4', page: 1, x: 25.0344, y: 153.3314, type: 'check' },    
    { key: 'ja_1', page: 1, x: 24.9343, y: 135.7207, type: 'check' },
    { key: 'nein_1', page: 1, x: 33.274, y: 135.7207, type: 'check' },
    { key: 'gesellschaft', page: 1, x: 48.768, y: 114.0883, type: 'text' },
    { key: 'sparte', page: 1, x: 113.1993, y: 113.3828, type: 'text' },
    { key: 'gesellschaft_2', page: 1, x: 48.768, y: 102.8277, type: 'text' },
    { key: 'sparte_2', page: 1, x: 113.1993, y: 102.1221, type: 'text' },
    { key: 'gesellschaft_3', page: 1, x: 48.768, y: 92.329, type: 'text' },
    { key: 'sparte_3', page: 1, x: 113.1993, y: 91.6234, type: 'text' },
    { key: 'ja_2', page: 1, x: 24.9343, y: 66.04, type: 'check' },
    { key: 'nein_2', page: 1, x: 33.274, y: 66.04, type: 'check' },
    { key: 'ja_3', page: 1, x: 24.9767, y: 51.2657, type: 'check' },
    { key: 'nein_3', page: 1, x: 33.274, y: 42.4603, type: 'check' },
    { key: 'ja_4', page: 1, x: 24.9767, y: 42.4603, type: 'check' },
    { key: 'nein_4', page: 1, x: 33.274, y: 21.717, type: 'check' },
    { key: 'ja_5', page: 1, x: 24.9767, y: 21.717, type: 'check' },
    { key: 'nein_5', page: 1, x: 32.766, y: 51.2657, type: 'check' },
  
    // Seite 2
    { key: 'ja_6', page: 2, x: 24.9767, y: 271.6953, type: 'check' },
    { key: 'nein_6', page: 2, x: 33.274, y: 271.6953, type: 'check' },
    { key: 'ja_7', page: 2, x: 24.9767, y: 256.921, type: 'check' },
    { key: 'nein_7', page: 2, x: 33.274, y: 256.921, type: 'check' },
    { key: 'ja_8', page: 2, x: 24.9767, y: 236.1353, type: 'check' },
    { key: 'nein_8', page: 2, x: 33.274, y: 236.1353, type: 'check' },
    { key: 'ja_9', page: 2, x: 24.9767, y: 215.392, type: 'check' },
    { key: 'nein_9', page: 2, x: 33.274, y: 215.392, type: 'check' },
    { key: 'ja_10', page: 2, x: 24.9767, y: 171.1113, type: 'check' },
    { key: 'nein_10', page: 2, x: 33.274, y: 171.1113, type: 'check' },
    { key: 'ja_11', page: 2, x: 24.9767, y: 144.399, type: 'check' },
    { key: 'nein_11', page: 2, x: 33.274, y: 144.399, type: 'check' },
    { key: 'ja_12', page: 2, x: 24.9767, y: 123.6133, type: 'check' },
    { key: 'nein_12', page: 2, x: 33.274, y: 123.6133, type: 'check' },
    { key: 'motiv1', page: 2, x: 24.9767, y: 89.1117, type: 'text' },
    { key: 'ja_13', page: 2, x: 24.9767, y: 50.0803, type: 'check' },
    { key: 'nein_13', page: 2, x: 33.274, y: 50.0803, type: 'check' },
    { key: 'ja_14', page: 2, x: 24.9767, y: 35.306, type: 'check' },
    { key: 'nein_14', page: 2, x: 33.274, y: 35.306, type: 'check' },
  
    // Seite 3
    { key: 'ja_15', page: 3, x: 24.9767, y: 256.921, type: 'check' },
    { key: 'nein_15', page: 3, x: 33.274, y: 256.921, type: 'check' },
    { key: 'motiv2', page: 3, x: 24.9767, y: 222.377, type: 'text' },
    { key: 'ja_16', page: 3, x: 24.9767, y: 174.5404, type: 'check' },
    { key: 'nein_16', page: 3, x: 33.274, y: 174.5404, type: 'check' },
    { key: 'motiv3', page: 3, x: 24.9767, y: 139.9963, type: 'text' },
    { key: 'Checkbox1', page: 3, x: 23.3987, y: 116.9444, type: 'check' },
    { key: 'Checkbox2', page: 3, x: 23.2448, y: 101.8582, type: 'check' },
    { key: 'Checkbox3', page: 3, x: 23.2448, y: 93.5457, type: 'check' },
  
    // Seite 4
    { key: 'ort_datum', page: 4, x: 47.0747, y: 180.2977, type: 'text' },
    { key: 'UnterschriftKunde', page: 4, x: 61.214, y: 162.687, type: 'signature' },
    { key: 'NameBerater', page: 4, x: 98.8295, y: 140.6499, type: 'text' },
    { key: 'UnterschriftBerater', page: 4, x: 141.0703, y: 145.2649, type: 'signature' },
 ];

  const kunde = antworten?.kundendaten || {};

  
  const isChecked = (feldname) => {
    if (!antworten?.themenauswahl) return false;
  
    // Spezialfall: Zeichen in PDF-Feldname ≠ Zeichen im gespeicherten Wert
    if (feldname === 'Sach  und Vermögensversicherungen') {
      return antworten.themenauswahl.themen?.includes('Sach – und Vermögensversicherungen');
    }
  
    return (
      antworten.themenauswahl.gespraechsarten?.includes(feldname) ||
      antworten.themenauswahl.themen?.includes(feldname)
    );
  };
  
  const getValue = (key) => {
    const fragen = antworten?.fragen || {};
    const themen = antworten?.themen || [];
    const gespraechsarten = antworten?.gespraechsarten || [];
    const vertragsDaten = antworten?.vertraege || [];
    const kunde = antworten?.kundendaten || {};
  
    // Ja/Nein-Fragen global (ja_1 bis ja_16)
    if (key.startsWith('ja_') || key.startsWith('nein_')) {
      const nr = key.split('_')[1];
      const allFragen = [
        'Wurden Verträge abgeschlossen?',
        'Waren Sie mit der Beratung zufrieden?',
        'Wurden alle Fragen vollständig geklärt?',
        'Haben Sie die Angaben wahrheitsgetreu gemacht?',
        'Wurden Sie über Kosten informiert?',
        'Entsprechen die Produkte Ihren Zielen?',
        'Wurden AGB und Produktinfos erklärt?',
        'Wurden Beginn/Dauer/Kündigung besprochen?',
        'Sind Sie sich über die Verbindlichkeit bewusst?',
        'Wurden Sie über versicherte Risiken informiert?',
        'Wurden mögliche Karenzfristen erklärt?',
        'Wurde ein Überblick über Leistungen gegeben?',
        'Ist Ihnen der langfristige Anlagehorizont bewusst?',
        'Wissen Sie, dass Anlagen von Faktoren abhängen?',
        'Ist Ihnen Volatilität bei Anlagen bewusst?',
        'Stimmt das versicherte Risiko mit Ihrem Bedarf überein?'
      ];
      
      // Spezialfall für Frage 1 (Vertragsabschluss) – separat gespeichert
      if (nr === '1' && antworten?.vertragsabschluss?.abgeschlossen) {
        const wert = antworten.vertragsabschluss.abgeschlossen;
        return key === 'ja_1' && wert === 'ja' ? 'X'
             : key === 'nein_1' && wert === 'nein' ? 'X'
             : '';
      }
      
      // Alle anderen Fragen wie bisher
      const frageText = allFragen[parseInt(nr) - 1];
      const antwort = fragen?.[frageText];
      return key.startsWith('ja_') && antwort === 'ja' ? 'X'
           : key.startsWith('nein_') && antwort === 'nein' ? 'X'
           : '';
    }
  
    // Gesprächsarten
    if (key === 'Art1') return gespraechsarten.includes('Datenerhebung') ? 'X' : '';
    if (key === 'Art2') return gespraechsarten.includes('Beratungsgespräch') ? 'X' : '';
    if (key === 'Art3') return gespraechsarten.includes('Servicetermin') ? 'X' : '';
  
    // Themen
    if (key === 'Themen1') return themen.includes('Vorsorge') ? 'X' : '';
    if (key === 'Themen2') return themen.includes('Gesundheitsvorsorge') ? 'X' : '';
    if (key === 'Themen3') return themen.includes('Vermögensanlagen') ? 'X' : '';
    if (key === 'Themen4') return themen.includes('Sach – und Vermögensversicherungen') ? 'X' : '';
  
    // Kündigung Checkbox
    if (key === 'Checkbox1') return antworten?.kuendigung === 'Checkbox1' ? 'X' : '';
    if (key === 'Checkbox2') return antworten?.kuendigung === 'Checkbox2' ? 'X' : '';
    if (key === 'Checkbox3') return antworten?.kuendigung === 'Checkbox3' ? 'X' : '';
  
    // Vertragsfelder
    if (key === 'gesellschaft') return vertragsDaten[0]?.gesellschaft || '';
    if (key === 'sparte') return vertragsDaten[0]?.sparte || '';
    if (key === 'gesellschaft_2') return vertragsDaten[1]?.gesellschaft || '';
    if (key === 'sparte_2') return vertragsDaten[1]?.sparte || '';
    if (key === 'gesellschaft_3') return vertragsDaten[2]?.gesellschaft || '';
    if (key === 'sparte_3') return vertragsDaten[2]?.sparte || '';
    
  
    // Motivfelder
    if (key === 'motiv1') return antworten?.motiv1 || '';
    if (key === 'motiv2') return antworten?.motiv2 || '';
    if (key === 'motiv3') return antworten?.motiv3 || '';
    
  
    // Ort/Datum
    if (key === 'ort_datum') return antworten?.ortDatum || '';

    if (key === 'NameBerater') return beraterName || '';

  
    // Kundendaten direkt (Feldnamen wie im PDF!)
    const directFields = {
      anrede: kunde.anrede,
      geburtsdatum: kunde.geburtsdatum,
      vorname: kunde.vorname,
      nachname: kunde.nachname,
      adresse: kunde.adresse,
      plzOrt: kunde.plzOrt,
      telefon: kunde.telefon,
      email: kunde.email
    };
    if (directFields[key] !== undefined) return directFields[key];
  
    return '';
  };
  

  return (
    <div
      className={`z-50 fixed inset-0 ${
        isFullscreen ? 'bg-black' : 'bg-black/40'
      } flex justify-center items-center`}
    >
      <div
        className={`${
          isFullscreen
            ? 'w-full h-screen px-0 py-0'
            : 'w-[90vw] max-w-[900px] h-[85vh]'
        } bg-white rounded-xl shadow-2xl overflow-y-auto relative`}
      >
        {/* X-Button */}
        <button
  onClick={() => navigate('/browserunterzeichnen')}
  className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl font-bold z-50"
>
  ×
</button>

  
        {/* Vollbild-Icon */}
        <button
          onClick={() => setIsFullscreen(prev => !prev)}
          className="absolute top-4 right-12 z-50"
        >
          <img src="/vollbild.png" alt="Vollbild" className="h-6 w-6" />
        </button>
        
        <div
  ref={wrapperRef}
  className="w-full overflow-x-auto overflow-y-auto"
  style={{ maxWidth: '100%', maxHeight: '100%' }}
>

      
          <Document file={pdfDatei}>
            {[1, 2, 3, 4].map(page => (
              <div
                key={page}
                style={{
                  width: `${viewerWidth}px`,
                  height: `${Math.round(viewerWidth * 1.414)}px`,
                  position: 'relative',
                  display: 'inline-block'
                }}
              >
                <Page
                  pageNumber={page}
                  width={viewerWidth}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  onRenderSuccess={({ width, height }) => {
                    setPageSizes(prev => ({
                      ...prev,
                      [page]: { width, height }
                    }));
                  }}
                />
  


{pageSizes[page] &&
  fields
    .filter(f => f.page === page)
    .map(f => {
      const value = getValue(f.key);
      const top =
        (A4_HEIGHT_MM - f.y) *
        (pageSizes[page].height / A4_HEIGHT_MM);
      const left =
        f.x * (pageSizes[page].width / A4_WIDTH_MM);

      let adjustedTop = top;
      let adjustedLeft = left;
      let fieldFontSize = '12px';

      const kundenfelder = [
        'anrede', 'vorname', 'nachname', 'geburtsdatum',
        'adresse', 'plzOrt', 'telefon', 'email'
      ];

      const gespraechsartenFelder = ['Art1', 'Art2', 'Art3'];
      const themenFelder = ['Themen1', 'Themen2', 'Themen3', 'Themen4'];

      const jaNeinFelder = [];
      for (let i = 1; i <= 20; i++) {
      jaNeinFelder.push(`ja_${i}`);
      jaNeinFelder.push(`nein_${i}`);
      }
      
      const vertragsfelder = [
        'gesellschaft', 'gesellschaft_2', 'gesellschaft_3',
        'sparte', 'sparte_2', 'sparte_3'
      ];

      const motivFelder = ['motiv1', 'motiv2', 'motiv3'];

      const checkboxFelder = ['Checkbox1', 'Checkbox2', 'Checkbox3'];


      


      if (kundenfelder.includes(f.key)) {
        adjustedTop += mmToPx(3.2, pageSizes[page].height);
        adjustedLeft += mmToPx(1.5, pageSizes[page].width);
      }

      
      if (gespraechsartenFelder.includes(f.key)) {
        adjustedTop += mmToPx(4, pageSizes[page].height); // z. B. 1 mm nach unten
        adjustedLeft += mmToPx(0.8, pageSizes[page].width); // z. B. 1 mm nach rechts
      }


      if (themenFelder.includes(f.key)) {
        adjustedTop -= mmToPx(0.2, pageSizes[page].height); // leicht nach unten
        adjustedLeft += mmToPx(0.5, pageSizes[page].width);   // deutlicher nach rechts
      }

      if (jaNeinFelder.includes(f.key)) {
        adjustedTop += mmToPx(-0.2, pageSizes[page].height);
        adjustedLeft += mmToPx(0.5, pageSizes[page].width);
      }

      if (vertragsfelder.includes(f.key)) {
        adjustedTop += mmToPx(3, pageSizes[page].height);    // z. B. leicht nach unten
        adjustedLeft += mmToPx(1.2, pageSizes[page].width); 
        fieldFontSize = '13px';   // z. B. leicht nach rechts
      }
      
      if (motivFelder.includes(f.key)) {
        adjustedTop += mmToPx(4, pageSizes[page].height);     // leicht nach unten
        adjustedLeft += mmToPx(1.0, pageSizes[page].width);     // leicht nach rechts
        fieldFontSize = '13px';                                 // größerer Text falls gewünscht
      }

      if (checkboxFelder.includes(f.key)) {
        adjustedTop -= mmToPx(0.4, pageSizes[page].height);  // leicht nach unten
        adjustedLeft -= mmToPx(-1.2, pageSizes[page].width);  // leicht nach rechts
      }
      
      

      if (f.type === 'check' && !!value) {
        return (
          <div
            key={f.key}
            style={{
              position: 'absolute',
              top: adjustedTop,
              left: adjustedLeft,
              fontSize: checkboxFelder.includes(f.key) ? '26px' : '14px',
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
        const sigData = antworten?.signatureData?.[f.key];
        const isSigned = typeof sigData === 'string' && sigData.startsWith('data:image/');
      
        const isBerater = f.key === 'UnterschriftBerater';
        const widthMm = isBerater ? 50 : 113.6227;
        const heightMm = 10.16;
        const fullWidth = mmToPx(widthMm, pageSizes[page].width);
        const fullHeight = mmToPx(heightMm, pageSizes[page].height);
      
        if (isSigned) {
          return (
            <img
              key={f.key}
              src={sigData}
              alt={`Unterschrift ${f.key}`}
              style={{
                position: 'absolute',
                top: adjustedTop,
                left: adjustedLeft,
                width: fullWidth,
                height: fullHeight,
                objectFit: 'contain',
                zIndex: 10
              }}
            />
          );
        }
      
        return (
          <div
            key={f.key}
            onClick={() => setActiveSigField(f.key)}
            style={{
              position: 'absolute',
              top: isBerater
                ? adjustedTop + mmToPx(1, pageSizes[page].height)
                : adjustedTop - mmToPx(-1.8, pageSizes[page].height),
              left: isBerater
                ? adjustedLeft - mmToPx(8, pageSizes[page].width)
                : adjustedLeft + fullWidth / 4,
              width: isBerater ? fullWidth : fullWidth / 2,
              height: isBerater ? fullHeight * 0.6 : fullHeight / 2,
              backgroundColor: 'rgba(140, 59, 74, 0.5)',
              border: '1px dashed #4B2E2B',
              borderRadius: '4px',
              cursor: 'pointer',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span
              style={{
                color: '#000',
                fontWeight: 'bold',
                fontSize: '12px',
                whiteSpace: 'nowrap'
              }}
            >
              {isBerater ? 'Unterschrift Berater' : 'Unterschrift Kunde'}
            </span>
          </div>
        );
      }
       
    })}


  
    </div>
  ))}
</Document>
<div className="absolute top-1 right-20 z-50">
  <button
    onClick={savePDF}
    disabled={saving}
    className="px-5 py-2 bg-white/80 text-[#4B2E2B] border border-[#4B2E2B] rounded-xl shadow-sm backdrop-blur-md hover:bg-white hover:shadow-md transition-all duration-200"
  >
    {saving ? 'Speichern...' : 'PDF speichern'}
  </button>
</div>
</div>



        {ortDatumModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-xl w-[400px]">
              <h2 className="text-lg font-bold mb-4">Ort & Datum eingeben</h2>
              <input type="text" placeholder="Ort" value={ortDatumWerte.ort} onChange={(e) => setOrtDatumWerte(prev => ({ ...prev, ort: e.target.value }))} className="w-full border rounded p-2 mb-3" />
              <input type="text" placeholder="Datum" value={ortDatumWerte.datum} onChange={(e) => setOrtDatumWerte(prev => ({ ...prev, datum: e.target.value }))} className="w-full border rounded p-2 mb-4" />
              <div className="flex justify-end gap-3">
                <button onClick={() => setOrtDatumModalOpen(false)}>Abbrechen</button>
                <button className="bg-green-600 text-white px-4 py-1 rounded" onClick={() => {
                const combined = `${ortDatumWerte.ort}, ${ortDatumWerte.datum}`;

                const updated = {
                  ...antworten,
                  ortDatum: combined
                };
                
                setAntworten(updated);

                // NEU: Speichern ins Backend
                const user = JSON.parse(localStorage.getItem('loggedInUser'));
                if (user?.email) {
                  fetch(`/api/antworten/${user.email}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updated),
                  }).catch(err => console.error('❌ Fehler beim Speichern der Antworten:', err));
                }
                
                setOrtDatumModalOpen(false);
                                 
                }}>Übernehmen</button>
              </div>
            </div>
          </div>
        )}

{nameBeraterModalOpen && (
  <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded shadow-xl w-[400px]">
      <h2 className="text-lg font-bold mb-4">Name des Beraters</h2>
      <input
        type="text"
        placeholder="Vor- und Nachname"
        value={nameBeraterWert}
        onChange={(e) => setNameBeraterWert(e.target.value)}
        className="w-full border rounded p-2 mb-4"
      />
      <div className="flex justify-end gap-3">
        <button onClick={() => setNameBeraterModalOpen(false)}>Abbrechen</button>
        <button
  className="bg-green-600 text-white px-4 py-1 rounded"
  onClick={() => {
    setBeraterName(nameBeraterWert);
    const updated = {
      ...antworten,
      beraterName: nameBeraterWert,
    };
    setAntworten(updated);

    // NEU: Statt localStorage jetzt ins Backend speichern
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (user?.email) {
      fetch(`/api/antworten/${user.email}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      }).catch(err => console.error('❌ Fehler beim Speichern des Beraternamens:', err));
    }
    
    setNameBeraterModalOpen(false);
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

export default RenderBeratungsprotokoll;