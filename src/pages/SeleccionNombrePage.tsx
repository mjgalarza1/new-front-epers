import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {API_BASE_URL} from "../util/util";

const ChooseNamePage: React.FC = () => {
    const [name, setName] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // Para mostrar el mensaje de error
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (name.length > 15) {
            setErrorMessage("El nombre no puede superar los 15 caracteres.");
            return;
        }

        try {
            // Verificar si el jugador con ese nombre ya existe
            const checkResponse = await fetch(`${API_BASE_URL}/jugador/${name}`);
            if (checkResponse.ok) {
                // Si el jugador ya existe, mostrar mensaje de error
                setErrorMessage('¡Este nombre ya está en uso! Por favor elige otro.');
                return; // No proceder con la creación del juego
            }

            // Si no existe, proceder a crear el juego
            const response = await fetch(`${API_BASE_URL}/juego`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: name, // Enviar nombre en el body
            });

            if (!response.ok) throw new Error('Error al crear el juego');

            const data = await response.json(); // Obtenemos la respuesta
            const idJuego = data.idJuego; // Accedemos a idJuego
            const nombre = data.nombre;  // Obtener el nombre

            // Navegar a la página del juego, pasando el idJuego y nombre en la URL
            navigate(`/game/${idJuego}/${nombre}`);
        } catch (error) {
            console.error(error);
            setErrorMessage('Hubo un error al crear el juego. Intenta nuevamente.'); // Mostrar error
        }
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Elige tu nombre</h1>
            <input
                type="text"
                value={name}
                onChange={(e) => {
                    setName(e.target.value);
                    setErrorMessage(''); // Limpiar mensaje de error cuando cambian el nombre
                }}
                maxLength={15}
                style={{ padding: '10px', fontSize: '16px', margin: '20px 0' }}
            />
            <button onClick={handleSubmit} style={{ padding: '10px 20px', fontSize: '16px' }}>
                Iniciar Juego
            </button>

            {/* Mostrar mensaje de error si el nombre ya existe */}
            {errorMessage && (
                <p style={{ color: 'red', fontWeight: 'bold' }}>{errorMessage}</p>
            )}
        </div>
    );
};

export default ChooseNamePage;