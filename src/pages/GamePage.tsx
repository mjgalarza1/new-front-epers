import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Personaje from '../components/Personaje';
import PalabraAdivinando from '../components/PalabraAdivinando';
import LetrasEquivocadas from '../components/LetrasEquivocadas';
import Ouija from '../components/OuijPers';
import React from 'react';

const GamePage: React.FC = () => {
    const { idJuego, nombre } = useParams();
    const nombreJugador = nombre ?? '';
    console.log("EL IDJUEGO DEL GAMEPAGE (con useParams): ", idJuego, " Nombre del jugador: ", nombre);

    const [currentRound, setCurrentRound] = useState<number>(1);
    const [attemptsLeft, setAttemptsLeft] = useState<number>(6);
    const [word, setWord] = useState<string>(''); // Palabra adivinando
    const [wrongLetters, setWrongLetters] = useState<string[]>([]); // Letras equivocadas
    const navigate = useNavigate();

    const fetchAttemptsLeft = async () => {
        try {
            const response = await fetch(`http://localhost:8080/juego/${idJuego}/cantidadDeIntentos`);
            if (!response.ok) throw new Error('Error al obtener intentos restantes');
            const data = await response.json();
            setAttemptsLeft(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchRound = async () => {
        try {
            const response = await fetch(`http://localhost:8080/juego/${idJuego}/rondaActual`);
            if (!response.ok) throw new Error('Error al obtener la ronda actual');
            const data = await response.text(); // Usamos .text() porque la respuesta es un string

            // Mapear los valores de texto a números
            const roundMap: { [key: string]: number } = {
                "RondaUno": 1,
                "RondaDos": 2,
                "RondaTres": 3,
                "RondaFinalizada": 4
            };

            // Asignar el número correspondiente o un valor predeterminado si no se encuentra
            const roundNumber = roundMap[data] ?? 0;
            setCurrentRound(roundNumber);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchWord = async () => {
        try {
            const response = await fetch(`http://localhost:8080/juego/${idJuego}/palabraAdivinando`);
            if (!response.ok) throw new Error('Error al obtener la palabra');
            const data = await response.text(); // Usar .text() ya que es una cadena de texto
            setWord(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchWrongLetters = async () => {
        try {
            const response = await fetch(`http://localhost:8080/juego/${idJuego}/letrasEquivocadas`);
            if (!response.ok) throw new Error('Error al obtener letras equivocadas');
            const data = await response.text(); // Usar .text() para obtener el string
            setWrongLetters(data.split(',')); // Convertir el string a un array de letras
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchAttemptsLeft();
        fetchRound();
        fetchWord();
        fetchWrongLetters();
    }, []);

    useEffect(() => {
        if (currentRound > 3) {
            navigate(`/game-over`, { state: { nombreJugador } });
        }
    }, [currentRound]);

    const handleLetterSubmit = async (letter: string) => {
        try {
            const response = await fetch(`http://localhost:8080/jugador/${nombreJugador}/adivinarLetra/${letter}`, { method: 'PUT' });
            if (!response.ok) throw new Error('Error al enviar la letra');
            // Actualizar la palabra y las letras equivocadas después de adivinar una letra
            fetchWord();
            fetchWrongLetters();
            fetchAttemptsLeft(); // Si los intentos cambian, actualiza el estado
            fetchRound(); // Actualizar la ronda
        } catch (error) {
            console.error(error);
            alert('Error al procesar la letra.');
        }
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Juego - Ronda {currentRound}</h1>
            <Personaje attemptsLeft={attemptsLeft} />
            <PalabraAdivinando word={word} /> {/* Aquí pasa la palabra */}
            <LetrasEquivocadas wrongLetters={wrongLetters} /> {/* Pasa las letras equivocadas */}
            <Ouija onLetterSubmit={handleLetterSubmit} nombreJugador={nombreJugador} /> {/* Aquí */}
        </div>
    );
};

export default GamePage;