import React from "react";
import './PersonajeAhorcado.css'; // Archivo CSS para el diseño de la grilla

const PersonajeAhorcado: React.FC<{ attemptsLeft: number }> = ({ attemptsLeft }) => {
    // Rutas de las imágenes
    const parts = [
        { id: 'head', src: 'public/vite.svg', alt: 'Cabeza', gridArea: '1 / 2' },
        { id: 'torso', src: 'public/vite.svg', alt: 'Torso', gridArea: '2 / 2' },
        { id: 'left-arm', src: 'public/vite.svg', alt: 'Brazo izquierdo', gridArea: '2 / 1' },
        { id: 'right-arm', src: 'public/vite.svg', alt: 'Brazo derecho', gridArea: '2 / 3' },
        { id: 'left-leg', src: 'public/vite.svg', alt: 'Pierna izquierda', gridArea: '3 / 1' },
        { id: 'right-leg', src: 'public/vite.svg', alt: 'Pierna derecha', gridArea: '3 / 3' },
    ];

    // Determinar qué partes mostrar según los intentos restantes
    const visibleParts = parts.slice(0, 6 - attemptsLeft);

    return (
        <div>
            <h2 style={{ fontSize: '3vw' }}>Intentos restantes: {attemptsLeft}</h2>
            <div className="character-grid">
                {visibleParts.map((part) => (
                    <img
                        key={part.id}
                        src={part.src}
                        alt={part.alt}
                        style={{ gridArea: part.gridArea }}
                        className="body-part"
                    />
                ))}
            </div>
        </div>
    );
};

export default PersonajeAhorcado;