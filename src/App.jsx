import "./App.css"
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from "./pages/Home.jsx";
import RankingPage from "./pages/RankingPage/RankingPage.tsx";
import GamePage from "./pages/GamePage/GamePage.tsx";
import SeleccionNombrePage from "./pages/SeleccionNombrePage.tsx";
import GameOverPage from "./pages/GameOverPage.tsx";
import RondaUltimate from "./pages/RondaUltimate/RondaUltimate.tsx";
import RondaUltimateVerifierPage from "./pages/RondaUltimateVerifierPage/RondaUltimateVerifierPage.tsx";
import ConflictResolvedPage from "./pages/ConflictResolvedPage/ConflictResolvedPage.tsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/ranking" element={<RankingPage />} />
                <Route path="/name-character" element={<SeleccionNombrePage />} />
                <Route path="/game/:idJuego/:nombre" element={<GamePage />} />
                <Route path="/game-over" element={<GameOverPage />} />
                <Route path="/ronda-ultimate/:idJuego" element={<RondaUltimate />} />
                <Route path="/verificar-jugador-ultimate" element={<RondaUltimateVerifierPage />} />
                <Route path="/resolucion-final" element={<ConflictResolvedPage />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    )
}

export default App;
