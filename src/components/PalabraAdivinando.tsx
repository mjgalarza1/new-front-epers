import React from "react";

const PalabraAdivinando: React.FC<{ word: string }> = ({ word }) => {
    return (
        <div>
            <h3 style={{ fontSize: '4vw' }}>Palabra a adivinar:</h3>
            <p style={{ fontSize: '6vw' }}>{word.split('').join(' ')}</p>
        </div>
    );
};

export default PalabraAdivinando; // Asegúrate de usar `export default`