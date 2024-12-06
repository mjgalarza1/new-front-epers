import React from 'react';
import { useLocation } from 'react-router-dom';
import './ConflictResolvedPage.css'; // Asegúrate de tener un archivo CSS para estilos

const ConflictResolvedPage: React.FC = () => {
    const location = useLocation();
    const { word }: { word?: string } = location.state || {};

    if (!word) {
        // Si no se proporciona una palabra, muestra un mensaje de error o redirige
        return <h1 className="center-text">Error: Palabra no especificada</h1>;
    }

    const message = word.includes('_')
        ? 'SUS CUERPOS FUERON POSEÍDOS POR LOS ESPÍRITUS'
        : 'Han recuperado el brazo de RDJ';

    return (
        <div className="conflict-resolved-container">
            <h1 className="center-text">{message}</h1>
        </div>
    );
};

export default ConflictResolvedPage;


