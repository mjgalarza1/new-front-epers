import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Observable } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { switchMap, retry, catchError } from 'rxjs/operators';
import PersonajeAhorcado from '../../components/PersonajeAhorcado/PersonajeAhorcado';
import PalabraAdivinando from '../../components/PalabraAdivinando';
import LetrasEquivocadas from '../../components/LetrasEquivocadas';
import OuijPers from '../../components/OuijPers/OuijPers';
import "../GamePage/GamePage.css";
import '../../assets/spinner.css';
import ouijpersBox from '../../assets/images/ahorcado/ouijpers-bg.png';
import { API_BASE_URL } from "../../util/util";

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
            const subscription = subscribeToWordUpdates(idPalabra).subscribe({
                next: (updatedWord) => {
                    setWord(updatedWord); // Actualiza la palabra
                    fetchGameState(); // Refresca el estado del juego
                },
                error: (err) => console.error('Error en el flujo de palabra:', err),
            });

            return () => subscription.unsubscribe(); // Limpia la suscripción
        }
    }, [idPalabra]);

    useEffect(() => {
        if (!isLoading && (attemptsLeft === 0 || !word.includes('_'))) {
            navigate('/resolucion-final', { state: { word } });
        }
    }, [attemptsLeft, word, isLoading, navigate]);

    const fetchPlayerData = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_BASE_URL}/jugador/${nombre}`);
            if (!response.ok) throw new Error('Error al obtener datos del jugador');
            const data = await response.json();
            setIdPalabra(data.idPalabraRondaUltimate); // Configura el ID de la palabra
            fetchGameState(); // Carga el estado inicial del juego
        } catch (error) {
            console.error('Error al obtener datos del jugador:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const subscribeToWordUpdates = (idPalabra: string): Observable<string> => {
        const url = `${API_BASE_URL}/palabraRondaUltimate/${idPalabra}/palabraAdivinando`;

        return fromFetch(url).pipe(
            retry(3), // Reintenta hasta 3 veces si hay error
            switchMap((response) => {
                if (!response.ok) throw new Error('Error al obtener palabra actualizada');
                return response.json(); // Lee el JSON del cuerpo
            }),
            switchMap((data: { palabraAdivinando: string }) => {
                // Extrae solo la palabra
                return new Observable<string>((observer) => {
                    observer.next(data.palabraAdivinando);
                    observer.complete();
                });
            }),
            catchError((err) => {
                console.error('Error en el stream:', err);
                throw err;
            })
        );
    };

    const fetchGameState = async () => {
        try {
            setIsLoading(true);
            await Promise.all([fetchAttemptsLeft(), fetchRound(), fetchWrongLetters()]);
            await checkPlayerTurn();
        } catch (error) {
            console.error('Error fetching game state:', error);
        } finally {
            setIsLoading(false);
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
                RondaUltimate: 5,
            };
            setCurrentRound(roundMap[data] ?? 0);
        } catch (error) {
            console.error(error);
            setErrorMessage('Error al obtener la ronda actual');
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
