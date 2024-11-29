import React, { useState } from 'react';

const OuijPers: React.FC<{ onLetterSubmit: (letter: string) => void; nombreJugador: string; isSubmitting: boolean }> = ({ onLetterSubmit, isSubmitting }) => {
    const [letter, setLetter] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>(''); // Estado para el mensaje de error

    const handleSubmit = () => {
        const letterToSubmit = letter.toLowerCase(); // Convertir la letra a minúscula

        if (!/^[a-zA-Z]$/.test(letterToSubmit)) {
            setErrorMessage('Ingresa una letra válida (de la a-z en minúscula).');
            return;
        }

        onLetterSubmit(letterToSubmit); // Enviar la letra al GamePage
        setLetter('');
        setErrorMessage(''); // Limpiar el mensaje de error si la letra es válida
    };

    return (
        <div>
            <h3 style={{fontSize: '4vw'}}>Escribe una letra</h3>
            <input
                type="text"
                value={letter}
                onChange={(e) => setLetter(e.target.value)}
                disabled={isSubmitting}
                maxLength={1}
                style={{
                    padding: '6px',      /* Un padding ligeramente mayor */
                    fontSize: '18px',    /* Un tamaño de texto un poco más grande */
                    width: '60px'        /* Ajuste al tamaño mayor */
                }}
            />
            <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{
                    padding: '10px 20px',   /* Un padding más amplio */
                    fontSize: '18px',       /* Un tamaño de texto mayor */
                    marginLeft: '8px'       /* Margen igual que antes */
                }}
            >
                Enviar
            </button>


            {errorMessage && (
                <p style={{color: 'red', fontWeight: 'bold', fontSize: '4vw'}}>
                    {errorMessage}
                </p>
            )}
        </div>
    );
};

export default OuijPers;