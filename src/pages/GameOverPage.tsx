import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {API_BASE_URL} from "../util/util";

const GameOverPage: React.FC = () => {
    const location = useLocation();
    const nombreJugador = location.state?.nombreJugador ?? 'Desconocido';
    const [score, setScore] = useState<number | null>(null);

    useEffect(() => {
        const fetchScore = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/jugador/${nombreJugador}/puntaje`);
                if (!response.ok) throw new Error('Error al obtener el puntaje');
                const data = await response.json();
                setScore(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchScore();
    }, [nombreJugador]);

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Juego Terminado</h1>
            {score !== null ? <p>Felicidades {nombreJugador}! Tu puntaje final es: {score}</p> : <p>Cargando puntaje...</p>}
        </div>
    );
};

export default GameOverPage;
