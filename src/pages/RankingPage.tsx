import { useEffect, useState } from 'react';
import { Subscription } from 'rxjs';
import { obtenerRanking } from '../scripts/rankingService';
import {useNavigate} from "react-router-dom";
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
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Ranking en Tiempo Real</h1>
            {error ? (
                <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>
            ) : (
                <ul style={{ listStyleType: 'none', padding: '0' }}>
                    {jugadores.map((jugador) => (
                        <li key={jugador.nombre} style={{ marginBottom: '10px' }}>
                            <span style={{ fontSize: '18px' }}>
                                {jugador.nombre}: {jugador.puntaje} puntos
                            </span>
                        </li>
                    ))}
                </ul>
            )}
            <div style={styles.buttonContainer}>
                <button style={styles.button} onClick={() => navigate("/")}>Volver atrás</button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        textAlign: 'center',
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '20px',
    },
    list: {
        listStyleType: 'none',
        padding: '0',
    },
    listItem: {
        marginBottom: '10px',
        fontSize: '18px',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px',
        marginTop: '20px',
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s ease',
    },
    buttonHover: {
        backgroundColor: '#0056b3',
    },
};

export default RankingPage;