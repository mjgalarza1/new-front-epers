import React from "react";

const LetrasEquivocadas: React.FC<{ wrongLetters: string[] }> = ({ wrongLetters }) => {
    return (
        <div>
            <h3 style={{ fontSize: '4vw' }}>Letras incorrectas:</h3>
            <p style={{ fontSize: '5vw' }}>{wrongLetters.join(', ')}</p>
        </div>
    );
};

export default LetrasEquivocadas; // Asegúrate de usar `export default`