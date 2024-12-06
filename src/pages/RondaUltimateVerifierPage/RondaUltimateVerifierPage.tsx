import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../util/util';

const RondaUltimateVerifierPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const nombreJugador = location.state?.nombre ?? 'Desconocido';

    const [esDigno, setEsDigno] = useState<boolean | null>(null);
    const [idJuegoTop1, setIdJuegoTop1] = useState<number | null>(null);

    useEffect(() => {
        const verificarDignidad = async () => {
            try {
                // Obtener los 3 mejores jugadores
                const responseTop = await fetch(`${API_BASE_URL}/jugador/top`, { method: 'GET' });
                if (!responseTop.ok) throw new Error('Error al obtener los mejores jugadores');
                const topPlayers = await responseTop.json();

                // Verificar si el jugador está en el top 3
                const jugadorEnTop = topPlayers.some((player: any) => player.nombre === nombreJugador);

                // Obtener el idJuego del top 1
                const idJuegoTop = topPlayers[0]?.idJuego; // Asumimos que topPlayers está ordenado (lo está)
                setIdJuegoTop1(idJuegoTop);

                if (idJuegoTop) {
                    // Verificar la ronda actual del juego del top 1
                    const responseRonda = await fetch(`${API_BASE_URL}/juego/${idJuegoTop}/rondaActual`, {
                        method: 'GET',
                    });
                    if (!responseRonda.ok) throw new Error('Error al verificar la ronda actual');
                    const rondaActual = await responseRonda.text();

                    // Comparar si la ronda actual es "RondaUltimate"
                    if (jugadorEnTop && rondaActual === 'RondaUltimate') {
                        setEsDigno(true);
                        return;
                    }
                }
                setEsDigno(false);
            } catch (error) {
                console.error('Error en la verificación:', error);
                setEsDigno(false); // Manejo de errores: no digno por defecto
            }
        };

        verificarDignidad();
    }, [nombreJugador]);

    // Manejar redirección a la Ronda Ultimate
    const handleIrARondaUltimate = () => {
        if (idJuegoTop1) {
            navigate(`/ronda-ultimate/${idJuegoTop1}`, { state: { nombre: nombreJugador } });
        }
    };

    // Manejar regreso al GameOverPage
    const handleVolverGameOver = () => {
        navigate('/game-over', { state: { nombreJugador } });
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            {esDigno === null ? (
                <p>Verificando...</p>
            ) : esDigno ? (
                <div>
                    <h1>Eres digno de participar en la Ronda Final</h1>
                    <button className='button-generic' onClick={handleIrARondaUltimate} style={{ marginTop: '20px' }}>
                        Ir a la Ronda Final
                    </button>
                </div>
            ) : (
                <div>
                    <h1>NO ERES DIGNO</h1>
                    <button className='button-generic' onClick={handleVolverGameOver} style={{ marginTop: '20px' }}>
                        Volver
                    </button>
                </div>
            )}
        </div>
    );
};

export default RondaUltimateVerifierPage;