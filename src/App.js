import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BeraterAuswahl from './pages/BeraterAuswahl';
import BeraterDashboard from './pages/BeraterDashboard';
import NeuerKunde from './pages/NeuerKunde';
import KundenVerwalten from './pages/KundenVerwalten';
import BeratungsSeite from './pages/BeratungsSeite';
import WuenscheUndZiele from './pages/WuenscheUndZiele.js';

import VermoegenSlide1 from './pages/slides/vermoegen/VermoegenSlide1.jsx';
import VermoegenTools from './pages/VermoegenTools';
import Budget from './components/tools/Budget';
import Sparrechner from './components/tools/sparrechner';
import Zinsvergleich from './components/tools/Zinsvergleich';
import StartenOderWarten from './components/tools/StartenOderWarten';
import IVRechner from './components/tools/IVRechner';


import VorsorgeTools from './pages/VorsorgeTools';
import LebenstandardTools from './pages/lebenstandardtools.js';
import Krankenkassentools from './pages/Krankenkassentools.js';
import Immobilien from './pages/Immobilien';
import KinderabsichernTool from './pages/KinderabsichernTool';
import Krankenkassenvergleich from './components/tools/Krankenkassenvergleich';
import Priminfovergleich from './components/tools/PriminfoVergleich.jsx';
import Fazit from './components/tools/Fazit';
import KinderabsichernSlides from './pages/slides/KinderabsichernSlides/KinderabsichernSlides.jsx';
import JBSlides from './pages/slides/JBFinanz/JBSlides.jsx';
import Krankenkassenslides from './pages/slides/Krankenkasse/Krankenkassenslides.jsx';
import LebenstandardSlides from './pages/slides/lebenstandard/LebenstandardSlides.jsx'
import VorsorgeSlides from './pages/slides/vorsorge/VorsorgeSlides.jsx';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminAuswahl from './pages/AdminAuswahl';
import BeratungsMenue from './pages/BeratungsMenue';
import VertragErfassen from './pages/VertragErfassen'; 
import Mandatsauswahl from './pages/Mandatsauswahl';
import SignaturSeite from './pages/SignaturSeite';
import Empfehlung from './pages/Empfehlung';
import ProtokollAuswahl from './pages/ProtokollAuswahl'; 
import StartAnsicht from './pages/beratungsprotokoll/StartAnsicht'; 
import BeratungsFlow from './pages/beratungsprotokoll/BeratungsFlow';
import BrowserUnterzeichnen from './pages/beratungsprotokoll/BrowserUnterzeichnen';
import KuendigungStart from './pages/kuendigung/KuendigungStart';
import KuendigungFlow from './pages/kuendigung/KuendigungFlow';
import KuendigungUnterzeichnen from './pages/kuendigung/KuendigungUnterzeichnen';
import VAGStart from './pages/VAG/VAGStart';
import VAGFlow from './pages/VAG/VAGFlow';
import VAGUnterzeichnen from './pages/VAG/VAGUnterzeichnen';
import BeratungAbschliessen from './pages/BeratungAbschliessen';
import AnalyseAbschliessen from './pages/AnalyseAbschliessen';














function App() { 
  
  return (
    <div>
    <Routes>
      <Route path="/berater-auswahl" element={<BeraterAuswahl />} />
      <Route path="/BeraterDashboard" element={<BeraterDashboard />} />
      <Route path="/neuer-kunde" element={<NeuerKunde />} />
      <Route path="/kunden-verwalten" element={<KundenVerwalten />} />
      <Route path="/beratung-starten" element={<BeratungsSeite />} />
      <Route path="/wuensche-und-ziele" element={<WuenscheUndZiele />} />

      {/* Vermögen */}
      <Route path="/vermoegen" element={<VermoegenSlide1 />} />
      

      {/* Tools */}

      <Route path="/tools/:bereich/budget" element={<Budget />} />
      <Route path="/tools/:bereich/sparrechner" element={<Sparrechner />} />
      <Route path="/tools/:bereich/zinsvergleich" element={<Zinsvergleich />} />
      <Route path="/tools/:bereich/starten-oder-warten" element={<StartenOderWarten />} />
      <Route path="/tools/:bereich/iv-rechner" element={<IVRechner />} />
      <Route path="/tools/:bereich/krankenkassenvergleich" element={<Krankenkassenvergleich />} />
      <Route path="/priminfo" element={<Priminfovergleich />} /> 
      <Route path="/fazit" element={<Fazit />} />





      {/* Vorsorge */}
      <Route path="/vorsorge/slides" element={<VorsorgeSlides />} />

      {/* Lebenstandard beibehalten */}

      <Route path="/lebenstandard/slides" element={<LebenstandardSlides/>} />

  
      

      {/* Krankenkasse  */}
      <Route path="/Krankenkasse/slides" element={<Krankenkassenslides/>} />



      {/* toolseiten */}

      <Route path="/tools/:bereich/kinderabsichern" element={<KinderabsichernTool />} />
      <Route path="/tools/:bereich/krankenkasse" element={<Krankenkassentools />} />
      <Route path="/tools/:bereich/lebenstandard" element={<LebenstandardTools />} />
      <Route path="/tools/:bereich/vorsorge" element={<VorsorgeTools />} />
      <Route path="/tools/:bereich/immobilien" element={<Immobilien />} />
      <Route path="/tools/:bereich/vermoegen" element={<VermoegenTools />} />

    {/* Immobilien */}

    

    {/* Kinderabsichern */}

    <Route path="/tools/kinder/kinderabsichern" element={<KinderabsichernSlides />} />

    {/* JB Slides */}

    <Route path="/jbslides" element={<JBSlides />} />

    {/* Login */}

    <Route path="/" element={<Login />} />

    {/* Admin */}

    <Route path="/admin-dashboard" element={<AdminDashboard />} />
    <Route path="/admin-auswahl" element={<AdminAuswahl />} />

    {/* Menue */}
  
    <Route path="/beratungs-menue" element={<BeratungsMenue />} />

    {/* Mandat und Empfehlungen */}

    <Route path="/vertrag-erfassen" element={<VertragErfassen />} />  
    <Route path="/mandat-auswahl" element={<Mandatsauswahl />} />
    <Route path="/mandat/signieren" element={<SignaturSeite />} />
    <Route path="/empfehlung" element={<Empfehlung />} />

    {/* Beratungabschliessen */}

    <Route path="/beratung-abschliessen" element={<ProtokollAuswahl />} />
    <Route path="/beratung-fertig" element={<BeratungAbschliessen />} />
    <Route path="/analyse-abschliessen" element={<AnalyseAbschliessen />} />


    {/* Protokolle Beratungsprotokoll */}

    <Route path="/beratung" element={<BeratungsFlow />} />
    <Route path="/beratung/start" element={<StartAnsicht />} />
    <Route path="/browserunterzeichnen" element={<BrowserUnterzeichnen />} />

    {/* Protokolle Krankenkasse Kündigung */}
    <Route path="/kuendigung-start" element={<KuendigungStart />} />
    <Route path="/kuendigung/formular" element={<KuendigungFlow />} />
    <Route path="/kuendigung/unterzeichnen" element={<KuendigungUnterzeichnen />} />

    {/* Protokolle VAG45 */}
    <Route path="/vag/start" element={<VAGStart />} />
    <Route path="/vag/flow" element={<VAGFlow />} />
    <Route path="/vag/unterzeichnen" element={<VAGUnterzeichnen />} />







    </Routes>
    </div>
  );
}

export default App;
