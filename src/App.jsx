import "./App.css"
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from "./pages/Home.jsx";
import RankingPage from "./pages/RankingPage/RankingPage.tsx";
import GamePage from "./pages/GamePage/GamePage.tsx";
import SeleccionNombrePage from "./pages/SeleccionNombrePage.tsx";
import GameOverPage from "./pages/GameOverPage.tsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/ranking" element={<RankingPage />} />
                <Route path="/name-character" element={<SeleccionNombrePage />} />
                <Route path="/game/:idJuego/:nombre" element={<GamePage />} />
                <Route path="/game-over" element={<GameOverPage />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    )
}

export default App;
