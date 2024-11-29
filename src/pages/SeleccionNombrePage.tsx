import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChooseNamePage: React.FC = () => {
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (name.length > 15) {
            alert("El nombre no puede superar los 15 caracteres.");
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/juego', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: name,
            });

            if (!response.ok) throw new Error('Error al crear el juego');

            const data = await response.json(); // Obtenemos la respuesta
            const idJuego = data.idJuego; // Accedemos a idJuego
            const nombre = data.nombre;  // Obtener el nombre

            // Navegar a la página del juego, pasando el idJuego y nombre en la URL
            navigate(`/game/${idJuego}/${nombre}`);
        } catch (error) {
            console.error(error);
            alert('Hubo un error al crear el juego. Intenta nuevamente.');
        }
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Elige tu nombre</h1>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={15}
                style={{ padding: '10px', fontSize: '16px', margin: '20px 0' }}
            />
            <button onClick={handleSubmit} style={{ padding: '10px 20px', fontSize: '16px' }}>
                Iniciar Juego
            </button>
        </div>
    );
};

export default ChooseNamePage;