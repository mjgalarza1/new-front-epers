import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../util/util';

const GameOverPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { nombreJugador, idJuego } = location.state ?? { nombreJugador: 'Desconocido', idJuego: null };
    const [score, setScore] = useState<number | null>(null);

    // Fetch puntaje del jugador actual
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

    // Maneja la redirección a la página de verificación de la Ronda Ultimate
    const handleVerificarRondaUltimate = () => {
        navigate('/verificar-jugador-ultimate', {
            state: { nombre: nombreJugador }, // Pasamos el nombre como state
        });
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Juego Terminado</h1>
            {score !== null ? (
                <p>Felicidades {nombreJugador}! Tu puntaje final es: {score}</p>
            ) : (
                <p>Cargando puntaje...</p>
            )}

            {/* Botón único para verificar si el jugador puede acceder a la Ronda Final */}
            <button onClick={handleVerificarRondaUltimate} style={{ marginTop: '20px' }}>
                Acceder a la Ronda Final
            </button>
        </div>
    );
};

export default GameOverPage;