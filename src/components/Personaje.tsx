import React from "react";

const Personaje: React.FC<{ attemptsLeft: number }> = ({ attemptsLeft }) => {
    const parts = ['Cabeza', 'Torso', 'Brazo izquierdo', 'Brazo derecho', 'Pierna izquierda', 'Pierna derecha'];

    return (
        <div>
            <h2>Intentos restantes: {attemptsLeft}</h2>
            <ul>
                {parts.slice(0, 6 - attemptsLeft).map((part, index) => (
                    <li key={index}>{part}</li>
                ))}
            </ul>
        </div>
    );
};

export default Personaje;