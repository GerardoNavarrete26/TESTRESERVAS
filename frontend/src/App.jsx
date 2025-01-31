import './App.css'
import EstadoCabañas from './pages/cabanas/EstadoCabañas'
import ListaCabañas from './pages/cabanas/ListaCabañas';
import AñadirReservas from './pages/reservas/AñadirReservas'
import ListaReservas from './pages/reservas/ListaReservas';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {

  return (
    <Router>
      <div>
        {/* Rutas */}
        <Routes>
        <Route path="/AñadirReservas" element={<AñadirReservas />} />
        <Route path="/ListaReservas" element={<ListaReservas />} />
          <Route path="/EstadoCabañas" element={<EstadoCabañas />} />
          <Route path="/ListaCabañas" element={<ListaCabañas />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
