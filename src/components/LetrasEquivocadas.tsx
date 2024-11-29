import React from "react";

const LetrasEquivocadas: React.FC<{ wrongLetters: string[] }> = ({ wrongLetters }) => {
    return (
        <div>
            <h3>Letras incorrectas:</h3>
            <p>{wrongLetters.join(', ')}</p> {/* Mostrar las letras equivocadas */}
        </div>
    );
};

export default LetrasEquivocadas; // Asegúrate de usar `export default`