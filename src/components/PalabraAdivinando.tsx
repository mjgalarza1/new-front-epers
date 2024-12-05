import React from "react";

const PalabraAdivinando: React.FC<{ word: string }> = ({ word }) => {
    return (
        <div>
            <p style={{fontSize: '0.9em', letterSpacing:'0.3em'}}>{word}</p>
        </div>
    );
};

export default PalabraAdivinando; // Asegúrate de usar `export default`