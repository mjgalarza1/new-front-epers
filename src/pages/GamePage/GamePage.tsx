import React from 'react';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PersonajeAhorcado from '../../components/PersonajeAhorcado/PersonajeAhorcado';
import PalabraAdivinando from '../../components/PalabraAdivinando';
import LetrasEquivocadas from '../../components/LetrasEquivocadas';
import OuijPers from '../../components/OuijPers/OuijPers';
import "./GamePage.css"
import '../../assets/spinner.css';
import ouijpersBox from '../../assets/images/ahorcado/ouijpers-bg.png';
import {API_BASE_URL} from "../../util/util";

const GamePage: React.FC = () => {
    const { idJuego, nombre } = useParams();
    const nombreJugador = nombre ?? '';
    const navigate = useNavigate();

    const [currentRound, setCurrentRound] = useState<number>(1);
    const [attemptsLeft, setAttemptsLeft] = useState<number>(6);
    const [word, setWord] = useState<string>('');
    const [wrongLetters, setWrongLetters] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true); // Asegúrate que inicie en true

    useEffect(() => {
        fetchGameState(); // Llamar a la función para cargar el estado del juego
    }, []);

    useEffect(() => {
        if (currentRound > 3) {
            navigate(`/game-over`, { state: { nombreJugador } });
        }
    }, [currentRound]);

    useEffect(() => {
        if (isLoading) return; // No hacer nada si aún está cargando

        if (attemptsLeft === 0 || !word.includes('_')) {
            setIsLoading(true); // Habilita el spinner antes de avanzar la ronda
            setTimeout(() => {
                avanzarRonda();
            }, 2000);
        }
    }, [attemptsLeft, word, isLoading]);

    const [animateTitle, setAnimateTitle] = useState(false);

    useEffect(() => {
        // Activa la animación cada vez que cambia la ronda
        setAnimateTitle(true);

        // Desactiva la animación después de que termine
        const timer = setTimeout(() => setAnimateTitle(false), 800); // Duración de la animación (800ms en este caso)
        return () => clearTimeout(timer); // Limpieza del temporizador
    }, [currentRound]);


    const fetchGameState = async () => {
        try {
            setIsLoading(true);  // Establecer en true al inicio de la carga de datos

            // Obtener todos los datos simultáneamente
            await Promise.all([
                fetchAttemptsLeft(),
                fetchRound(),
                fetchWord(),
                fetchWrongLetters(),
            ]);
        } catch (error) {
            console.error('Error fetching game state:', error);
        } finally {
            setIsLoading(false); // Establecer en false cuando los datos estén listos
        }
    };

    const fetchAttemptsLeft = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/juego/${idJuego}/cantidadDeIntentos`);
            if (!response.ok) throw new Error('Error al obtener intentos restantes');
            const data = await response.json();
            setAttemptsLeft(data);
        } catch (error) {
            console.error(error);
            setErrorMessage('Error al obtener intentos restantes');
        }
    };

    const fetchRound = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/juego/${idJuego}/rondaActual`);
            if (!response.ok) throw new Error('Error al obtener la ronda actual');
            const data = await response.text();

            const roundMap: { [key: string]: number } = {
                RondaUno: 1,
                RondaDos: 2,
                RondaTres: 3,
                RondaFinalizada: 4,
            };

            const roundNumber = roundMap[data] ?? 0;
            setCurrentRound(roundNumber);
        } catch (error) {
            console.error(error);
            setErrorMessage('Error al obtener la ronda actual');
        }
    };

    const fetchWord = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/juego/${idJuego}/palabraAdivinando`);
            if (!response.ok) throw new Error('Error al obtener la palabra');
            const data = await response.text();
            setWord(data);
        } catch (error) {
            console.error(error);
            setErrorMessage('Error al obtener la palabra');
        }
    };

    const fetchWrongLetters = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/juego/${idJuego}/letrasEquivocadas`);
            if (!response.ok) throw new Error('Error al obtener letras equivocadas');
            const data = await response.text();
            setWrongLetters(data.split(','));
        } catch (error) {
            console.error(error);
            setErrorMessage('Error al obtener letras equivocadas');
        }
    };

    const avanzarRonda = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/juego/${idJuego}/avanzarRonda`, {
                method: 'PUT',
            });
            if (!response.ok) throw new Error('Error al avanzar la ronda');
            setCurrentRound(currentRound + 1);
        } catch (error) {
            console.error('Error al avanzar la ronda:', error);
            setErrorMessage('Error al avanzar la ronda');
        } finally {
            setIsLoading(false); // Finaliza el spinner después de completar la acción
            fetchGameState(); // Actualiza el estado del juego
        }
    };

    const handleLetterSubmit = async (letter: string) => {
        try {
            setErrorMessage(''); // Limpiar mensaje de error antes de intentar enviar
            setIsSubmitting(true);
            const response = await fetch(`${API_BASE_URL}/jugador/${nombreJugador}/adivinarLetra/${letter}`, {
                method: 'PUT',
            });
            if (!response.ok) throw new Error('Error al enviar la letra');
            fetchGameState(); // Actualiza el estado del juego
        } catch (error) {
            console.error(error);
            setErrorMessage('No se pueden repetir letras');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='game-container'>
            <div className='elements-wrapper'>
                <div className='ahorcado'>
                    <PersonajeAhorcado attemptsLeft={attemptsLeft}/>
                    <h1 className={`ronda-title ${animateTitle ? 'fade-in' : ''}`}>Ronda {currentRound}</h1>
                </div>
                <div className='ouijpers-container'>
                <img className='ouijpers-bg' src={ouijpersBox}/>
                    <div className='palabra-adivinando'>
                        <PalabraAdivinando word={word}/>
                    </div>
                    <div className='escribe-una-letra'>
                        {isSubmitting || isLoading ? (
                            <div className="d-flex justify-content-center align-items-center"
                                 style={{height: '100%', position:'relative', top:'0.5em'}}>
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden"></span>
                                </div>
                            </div>
                        ) : (
                            <OuijPers
                                onLetterSubmit={handleLetterSubmit}
                                nombreJugador={nombreJugador}
                                isSubmitting={isSubmitting}
                            />
                        )}
                    </div>
                    <div className='letra-equivocada'>
                        <LetrasEquivocadas wrongLetters={wrongLetters}/>
                    </div>

                    {/* ERROR: No se pueden repetir letras */}
                    {errorMessage && (
                        <p className='error-gray'>
                            {errorMessage}
                        </p>
                    )}

                </div>
            </div>
        </div>
    );
};

export default GamePage;
