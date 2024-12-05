import React from "react";

const PalabraAdivinando: React.FC<{ word: string }> = ({ word }) => {
    return (
        <div>
            <p>{word.split('').join(' ')}</p>
        </div>
    );
};

export default PalabraAdivinando; // Asegúrate de usar `export default`