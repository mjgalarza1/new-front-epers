import React from "react";

const LetrasEquivocadas: React.FC<{ wrongLetters: string[] }> = ({ wrongLetters }) => {
    return (
        <div>
            <p style={{ fontSize: '5vw', color: 'red', letterSpacing: '3px', margin: '0' }}>{wrongLetters.join(', ')}</p>
        </div>
    );
};

export default LetrasEquivocadas; // Asegúrate de usar `export default`