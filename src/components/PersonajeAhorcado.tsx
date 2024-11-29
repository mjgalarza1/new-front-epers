import hangman07 from '../assets/images/ahorcado/hangman07.png';
import hangman06 from '../assets/images/ahorcado/hangman06.png';
import hangman05 from '../assets/images/ahorcado/hangman05.png';
import hangman04 from '../assets/images/ahorcado/hangman04.png';
import hangman03 from '../assets/images/ahorcado/hangman03.png';
import hangman02 from '../assets/images/ahorcado/hangman02.png';
import hangman01 from '../assets/images/ahorcado/hangman01.png';
import React from 'react';

const PersonajeAhorcado: React.FC<{ attemptsLeft: number }> = ({ attemptsLeft }) => {
    const images = [
        hangman01, // 0 intentos restantes (completo)
        hangman02, // 1 intento restante
        hangman03, // 2 intentos restantes
        hangman04, // 3 intentos restantes
        hangman05, // 4 intentos restantes
        hangman06, // 5 intentos restantes
        hangman07, // 6 intentos restantes (vacío o inicial)
    ];

    const currentImage = images[6 - attemptsLeft];

    return (
        <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '3vw' }}>Intentos restantes: {attemptsLeft}</h2>
            <img
                src={currentImage}
                alt={`Intentos restantes: ${attemptsLeft}`}
                style={{ width: '60%', height: 'auto', maxWidth: '300px', margin: '20px auto' }}
            />
        </div>
    );
};

export default PersonajeAhorcado;