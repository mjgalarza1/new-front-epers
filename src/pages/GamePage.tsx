import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PersonajeAhorcado from '../components/PersonajeAhorcado';
import PalabraAdivinando from '../components/PalabraAdivinando';
import LetrasEquivocadas from '../components/LetrasEquivocadas';
import OuijPers from '../components/OuijPers';
import React from 'react';

const GamePage: React.FC = () => {
    const { idJuego, nombre } = useParams();
    const nombreJugador = nombre ?? '';
    const navigate = useNavigate();

    const [currentRound, setCurrentRound] = useState<number>(1);
    const [attemptsLeft, setAttemptsLeft] = useState<number>(6);
    const [word, setWord] = useState<string>('');
    const [wrongLetters, setWrongLetters] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>(''); // Estado para manejar el error

    // Nuevos: Estados temporales
    const [tempAttemptsLeft, setTempAttemptsLeft] = useState<number>(6);
    const [tempWrongLetters, setTempWrongLetters] = useState<string[]>([]);
    const [tempRound, setTempRound] = useState<number>(currentRound);

    const fetchGameState = async () => {
        try {
            await Promise.all([fetchAttemptsLeft(), fetchRound(), fetchWord(), fetchWrongLetters()]);
        } catch (error) {
            console.error('Error fetching game state:', error);
        }
    };

    const fetchAttemptsLeft = async () => {
        try {
            const response = await fetch(`http://localhost:8080/juego/${idJuego}/cantidadDeIntentos`);
            if (!response.ok) throw new Error('Error al obtener intentos restantes');
            const data = await response.json();
            setAttemptsLeft(data);
        } catch (error) {
            console.error(error);
            setErrorMessage('Error al obtener intentos restantes'); // Mostrar error
        }
    };

    const fetchRound = async () => {
        try {
            const response = await fetch(`http://localhost:8080/juego/${idJuego}/rondaActual`);
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
            setErrorMessage('Error al obtener la ronda actual'); // Mostrar error
        }
    };

    const fetchWord = async () => {
        try {
            const response = await fetch(`http://localhost:8080/juego/${idJuego}/palabraAdivinando`);
            if (!response.ok) throw new Error('Error al obtener la palabra');
            const data = await response.text();
            setWord(data);
        } catch (error) {
            console.error(error);
            setErrorMessage('Error al obtener la palabra'); // Mostrar error
        }
    };

    const fetchWrongLetters = async () => {
        try {
            const response = await fetch(`http://localhost:8080/juego/${idJuego}/letrasEquivocadas`);
            if (!response.ok) throw new Error('Error al obtener letras equivocadas');
            const data = await response.text();
            setWrongLetters(data.split(','));
        } catch (error) {
            console.error(error);
            setErrorMessage('Error al obtener letras equivocadas'); // Mostrar error
        }
    };

    useEffect(() => {
        fetchGameState();
    }, []);

    useEffect(() => {
        if (currentRound > 3) {
            navigate(`/game-over`, { state: { nombreJugador } });
        }
    }, [currentRound]);

    const handleLetterSubmit = async (letter: string) => {
        try {
            setIsSubmitting(true);
            const response = await fetch(`http://localhost:8080/jugador/${nombreJugador}/adivinarLetra/${letter}`, {
                method: 'PUT',
            });
            if (!response.ok) throw new Error('Error al enviar la letra');

            const attemptsResponse = await fetch(`http://localhost:8080/juego/${idJuego}/cantidadDeIntentos`);
            if (!attemptsResponse.ok) throw new Error('Error al obtener intentos restantes');
            const attemptsLeftFromServer = await attemptsResponse.json();

            const palabraActual = await fetch(`http://localhost:8080/juego/${idJuego}/palabraAdivinando`);
            if (!palabraActual.ok) throw new Error('Error al obtener la palabra');
            const palabraActualDelServer = await palabraActual.text();

            if (attemptsLeft === 1 && attemptsLeftFromServer === 6 ) {
                handleTransition();
            } else {
                await fetchGameState();
            }

        } catch (error) {
            console.error(error);
            setErrorMessage('Error al procesar la letra <br />(no se pueden repetir letras)'); // Mostrar error
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTransition = async () => {
        setIsTransitioning(true);

        setTempAttemptsLeft(0);
        setTempWrongLetters([...wrongLetters]);
        setTempRound(currentRound); // Congelar la ronda

        setTimeout(async () => {
            try {
                await fetchGameState();
                setWrongLetters([]);
                setAttemptsLeft(6);
            } catch (error) {
                console.error('Error durante la transición:', error);
                setErrorMessage('Error durante la transición'); // Mostrar error
            } finally {
                setIsTransitioning(false);
            }
        }, 2000);
    };

    const displayAttemptsLeft = isTransitioning ? tempAttemptsLeft : attemptsLeft;
    const displayWrongLetters = isTransitioning ? tempWrongLetters : wrongLetters;
    const displayRound = isTransitioning ? tempRound : currentRound; // Nuevo: Mostrar la ronda congelada

    return (
        <div style={{ padding: '5vw', textAlign: 'center' }}>
            <h1 style={{ fontSize: '6vw' }}>Juego - Ronda {displayRound}</h1>
            <PersonajeAhorcado attemptsLeft={displayAttemptsLeft} />
            {isTransitioning && (
                <p style={{ fontSize: '7vw', fontWeight: 'bold', color: 'red' }}>
                    ¡Perdiste la ronda!
                </p>
            )}
            <PalabraAdivinando word={word} />
            <LetrasEquivocadas wrongLetters={displayWrongLetters} />
            {/* Mostrar el mensaje de error si existe */}
            {errorMessage && (
                <p
                    style={{ color: 'red', fontWeight: 'bold', fontSize: '0.75rem', lineHeight: '1.2', }}
                    dangerouslySetInnerHTML={{ __html: errorMessage }}
                />
            )}
            <OuijPers
                onLetterSubmit={handleLetterSubmit}
                nombreJugador={nombreJugador}
                isSubmitting={isSubmitting || isTransitioning}
            />
        </div>
    );
};

export default GamePage;
