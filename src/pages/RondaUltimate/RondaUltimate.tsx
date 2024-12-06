import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import PersonajeAhorcado from '../../components/PersonajeAhorcado/PersonajeAhorcado';
import PalabraAdivinando from '../../components/PalabraAdivinando';
import LetrasEquivocadas from '../../components/LetrasEquivocadas';
import OuijPers from '../../components/OuijPers/OuijPers';
import "../GamePage/GamePage.css";
import '../../assets/spinner.css';
import ouijpersBox from '../../assets/images/ahorcado/ouijpers-bg.png';
import { API_BASE_URL } from "../../util/util";
import {obtenerLetrasUsadas} from "../../scripts/letrasUsadasService";

const RondaUltimate: React.FC = () => {
    const { idJuego } = useParams<{ idJuego: string }>();
    const location = useLocation();
    const navigate = useNavigate();

    // Extraer el nombre del jugador desde el state
    const { nombre }: { nombre?: string } = location.state || {};

    if (!nombre) {
        navigate('/error', { replace: true, state: { message: 'Jugador no especificado para la Ronda Ultimate' } });
        return null;
    }

    const [currentRound, setCurrentRound] = useState<number>(1);
    const [attemptsLeft, setAttemptsLeft] = useState<number>(6);
    const [word, setWord] = useState<string>('');
    const [wrongLetters, setWrongLetters] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [canSubmit, setCanSubmit] = useState<boolean>(false);

    const [idPalabra, setIdPalabra] = useState<string | null>(null); // ID para palabra adivinando

    useEffect(() => {
        // Obtener el idPalabra del jugador actual
        fetchPlayerData();
    }, []);

    useEffect(() => {
        if (idPalabra) {
            const subscription = obtenerLetrasUsadas(idPalabra).subscribe({
                next: (updatedLetters: string[]) => {
                    console.log('Letras usadas actualizadas:', updatedLetters);
                    fetchGameState(); // Actualiza el resto del estado
                },
                error: (err) => console.error('Error en el flujo de letras usadas:', err),
            });

            return () => subscription.unsubscribe(); // Limpia la suscripción
        }
    }, [idPalabra]);

    useEffect(() => {
        if (!isLoading && word && (attemptsLeft === 0 || !word.includes('_'))) {
            navigate('/resolucion-final', { state: { word } });
        }
    }, [attemptsLeft, word, isLoading, navigate]);

    const fetchPlayerData = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_BASE_URL}/jugador/${nombre}`);
            if (!response.ok) throw new Error('Error al obtener datos del jugador');
            const data = await response.json();
            setIdPalabra(data.idPalabraAdivinando); // Configura el ID de la palabra
            console.log("EL JUGADOR DE FETCH: ", data)
            fetchGameState(); // Carga el estado inicial del juego
        } catch (error) {
            console.error('Error al obtener datos del jugador:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchGameState = async () => {
        try {
            setIsLoading(true);
            const [attempts, round, wrongLetters] = await Promise.all([
                fetchAttemptsLeft(),
                fetchRound(),
                fetchWrongLetters(),
            ]);
            await fetchWord();
            setAttemptsLeft(attempts);
            setCurrentRound(round);
            setWrongLetters(wrongLetters.split(','));
            await checkPlayerTurn();
        } catch (error) {
            console.error('Error fetching game state:', error);
        } finally {
            setIsLoading(false);
        }
    };


    const fetchAttemptsLeft = async (): Promise<number> => {
        try {
            const response = await fetch(`${API_BASE_URL}/juego/${idJuego}/cantidadDeIntentos`);
            if (!response.ok) throw new Error('Error al obtener intentos restantes');
            return await response.json();
        } catch (error) {
            console.error(error);
            setErrorMessage('Error al obtener intentos restantes');
            return attemptsLeft; // Retorna el valor actual si hay error
        }
    };

    const fetchRound = async (): Promise<number> => {
        try {
            const response = await fetch(`${API_BASE_URL}/juego/${idJuego}/rondaActual`);
            if (!response.ok) throw new Error('Error al obtener la ronda actual');
            const data = await response.text();
            const roundMap: { [key: string]: number } = {
                RondaUno: 1,
                RondaDos: 2,
                RondaTres: 3,
                RondaFinalizada: 4,
                RondaUltimate: 5,
            };
            return roundMap[data] ?? currentRound; // Retorna el valor actual si no se encuentra
        } catch (error) {
            console.error(error);
            setErrorMessage('Error al obtener la ronda actual');
            return currentRound; // Retorna el valor actual si hay error
        }
    };

    const fetchWrongLetters = async (): Promise<string> => {
        try {
            const response = await fetch(`${API_BASE_URL}/juego/${idJuego}/letrasEquivocadas`);
            if (!response.ok) throw new Error('Error al obtener letras equivocadas');
            return await response.text();
        } catch (error) {
            console.error(error);
            setErrorMessage('Error al obtener letras equivocadas');
            return wrongLetters.join(','); // Retorna las letras actuales si hay error
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

    const checkPlayerTurn = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/jugador/top`);
            if (!response.ok) throw new Error('Error al obtener el top de jugadores');
            const topPlayers = await response.json();
            const currentPlayer = topPlayers.find(
                (player: any) => player.nombre === nombre && player.esMiTurno
            );
            setCanSubmit(!!currentPlayer);
        } catch (error) {
            console.error('Error al verificar el turno del jugador:', error);
        }
    };

    const handleLetterSubmit = async (letter: string) => {
        try {
            setErrorMessage('');
            setIsSubmitting(true);
            const response = await fetch(`${API_BASE_URL}/jugador/${nombre}/adivinarLetra/${letter}`, {
                method: 'PUT',
            });
            if (!response.ok) throw new Error('Error al enviar la letra');
            fetchGameState();
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
                    <PersonajeAhorcado attemptsLeft={attemptsLeft} />
                    <h1 className={`ronda-title`}>Ronda {currentRound}</h1>
                </div>
                <div className='ouijpers-container'>
                    <img className='ouijpers-bg' src={ouijpersBox} />
                    <div className='palabra-adivinando'>
                        <PalabraAdivinando word={word} />
                    </div>
                    <div className='escribe-una-letra'>
                        {isSubmitting || isLoading || !canSubmit ? (
                            <div className="d-flex justify-content-center align-items-center"
                                 style={{ height: '100%', position: 'relative', top: '0.5em' }}>
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden"></span>
                                </div>
                            </div>
                        ) : (
                            <OuijPers
                                onLetterSubmit={handleLetterSubmit}
                                nombreJugador={nombre ?? ''}
                                isSubmitting={isSubmitting}
                            />
                        )}
                    </div>
                    <div className='letra-equivocada'>
                        <LetrasEquivocadas wrongLetters={wrongLetters} />
                    </div>

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

export default RondaUltimate;
