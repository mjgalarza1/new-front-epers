import React from 'react';
import { useState } from 'react';
import {useParams} from "react-router-dom";

const Ouija: React.FC<{ onLetterSubmit: (letter: string) => void; nombreJugador: string }> = ({ onLetterSubmit, nombreJugador }) => {
    const [letter, setLetter] = useState<string>('');

    const handleSubmit = () => {
        if (!/^[a-zA-Z]$/.test(letter)) {
            alert('Ingresa una letra válida.');
            return;
        }

        onLetterSubmit(letter); // Enviar la letra al GamePage
        setLetter('');
    };

    return (
        <div>
            <h3>Escribe una letra</h3>
            <input
                type="text"
                value={letter}
                onChange={(e) => setLetter(e.target.value)}
                maxLength={1}
                style={{ padding: '5px', fontSize: '16px' }}
            />
            <button onClick={handleSubmit} style={{ padding: '10px 20px', marginLeft: '10px' }}>
                Enviar
            </button>
        </div>
    );
};

export default Ouija;