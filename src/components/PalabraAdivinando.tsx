import React from "react";

const PalabraAdivinando: React.FC<{ word: string }> = ({ word }) => {
    return (
        <div>
            <h3>Palabra a adivinar:</h3>
            <p>{word.split('').join(' ')}</p> {/* Mostrar la palabra con espacios entre las letras */}
        </div>
    );
};

export default PalabraAdivinando; // Asegúrate de usar `export default`