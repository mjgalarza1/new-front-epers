import "./RankingPage.css";
import { useEffect, useState } from 'react';
import { Subscription } from 'rxjs';
import { obtenerRanking } from '../../scripts/rankingService';
import { useNavigate } from 'react-router-dom';
import React from 'react';

interface Jugador {
    nombre: string;
    puntaje: number;
}

const RankingPage: React.FC = () => {
    const [jugadores, setJugadores] = useState<Jugador[]>([]);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const subscription: Subscription = obtenerRanking().subscribe({
            next: (jugador) => {
                setJugadores((prevJugadores) => {
                    const updatedJugadores = [
                        ...prevJugadores.filter((j) => j.nombre !== jugador.nombre),
                        jugador,
                    ];
                    return updatedJugadores.sort((a, b) => b.puntaje - a.puntaje);
                });
            },
            error: (err) => {
                setError('Error al obtener el ranking.');
                console.error(err);
            },
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <div className='container'>
            <h1 className='title'>Ranking en Tiempo Real</h1>
            <div className='ranking-container'>
                {error ? (
                    <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>
                ) : (
                    <ul className='list'>
                        {jugadores.map((jugador) => (
                            <li key={jugador.nombre} className='listItem'>
                                {jugador.nombre}: {jugador.puntaje} puntos
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className='button-container'>
                <button className='button' onClick={() => navigate("/")}>Volver atrás</button>
            </div>
        </div>
    );
};

export default RankingPage;