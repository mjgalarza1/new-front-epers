import React from 'react';
import fondoJuego from "../assets/images/intro-bg3.png";
import { useNavigate } from 'react-router-dom';
import {Parallax, ParallaxProvider} from 'react-scroll-parallax';

export default function HomeScreen() {
    const navigate = useNavigate();

    const handleStartGame = () => {
        navigate("/game");
    };

    return (
        <ParallaxProvider>
            <div style={styles.container}>
                <Parallax speed={-10}>
                    <img
                        src={fondoJuego}
                        alt="Fondo para Juego"
                        style={{ width: '100vw', height: 'auto', maxWidth: '700px' }}
                    />
                </Parallax>

                <Parallax speed={10}>
                <div style={{
                    backgroundColor:'black',
                    paddingTop:'0.6em',
                    color: '#ffffff',
                    fontFamily: 'Georgia, serif',
                    padding: '0.5em 0.5em',
                }}>
                    <h1 style={styles.homeTitle}>
                        ¡Bienvenido a OuijPers!
                    </h1>
                    <p style={{
                        fontSize: '1.3em',
                        lineHeight: '1.6',
                        letterSpacing: '0.5px',
                        marginBottom: '20px',
                        textShadow: '2px 2px 5px rgba(0, 0, 0, 0.5)',
                        fontWeight: '300'
                    }}>
                        Enfréntate a los espíritus en un macabro juego de ahorcado. El destino de tu alma y el brazo de RDJ están en juego.
                        Supera 3 rondas llenas de misterios y peligros, acumula puntos y lucha por tu humanidad.
                    </p>

                    <h3 style={{
                        fontSize: '2em',
                        fontWeight: 'bold',
                        margin: '30px 0',
                        textDecoration: 'underline',
                        textTransform: 'uppercase',
                        color: '#ffffff', // Títulos grandes en blanco
                    }}>
                        Reglas del Juego
                    </h3>

                    <div style={styles.description}>
                        <p><strong style={{ color: '#ff0000' }}>Objetivo:</strong><br />
                            Salvar tu alma y recuperar el brazo de RDJ enfrentando a los espíritus en un macabro juego de ahorcado. Para ganar, debes superar las 3 rondas del desafío, acumulando puntos y evitando que los espíritus se apoderen de tu cuerpo.
                        </p>

                        <p><strong style={{ color: '#ff0000' }}>Mecánica del Juego:</strong><br />
                            Cada jugador intenta adivinar una palabra, letra por letra. Si aciertas, ganas puntos. Si fallas, pierdes puntos. Si llegas a perder los 6 intentos, los espíritus tomarán parte de tu alma.
                        </p>

                        <p><strong style={{ color: '#ff0000' }}>Puntaje:</strong><br />
                            +1 punto por cada letra acertada.<br />
                            -1 punto por cada letra fallida.<br />
                            +5 puntos por la última letra que completa la palabra.<br />
                            -5 puntos si pierdes todos los intentos.
                        </p>

                        <p><strong style={{ color: '#ff0000' }}>Errores:</strong><br />
                            Si fallas al adivinar la palabra completa quedándote sin intentos, los espíritus corrompen tu alma. Si fallas en todas las rondas, los espíritus se apoderan de tu cuerpo, y tu alma quedará atrapada en el mundo de los muertos.
                        </p>

                        <p><strong style={{ color: '#ff0000' }}>Rondas:</strong><br />
                            El juego consta de 3 rondas. Los espíritus se vuelven más agresivos y las palabras más difíciles a medida que avanzas.
                        </p>

                        <p><strong style={{ color: '#ff0000' }}>Condiciones de Victoria:</strong><br />
                            <strong>Individual:</strong> Los jugadores deben completar todas las palabras de las rondas. Solo los tres mejores con mayor puntaje avanzan al enfrentamiento final.<br />
                            <strong>Enfrentamiento Final:</strong> Los mejores jugadores unirán fuerzas para resolver la última palabra en un desafío especial. Si aciertan, ganan el brazo de RDJ. Si fallan, RDJ quedará incompleto y los espíritus prevalecerán.
                        </p>

                        <p><strong style={{ color: '#ff0000' }}>Nota Especial:</strong><br />
                            Ten cuidado, los espíritus pueden intentar distraerte y manipularte. Mantén la concentración o perderás tu humanidad y el brazo de RDJ.
                        </p>
                    </div>

                        <div style={styles.buttonContainer}>
                            <button style={styles.button} onClick={() => navigate("/name-character")}>Iniciar una partida</button>
                            <button style={styles.button} onClick={() => navigate("/ranking")}>Ver Ranking</button>
                        </div>
                    </div>
                </Parallax>
            </div>
        </ParallaxProvider>
    );

}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        padding: '0.5em 0',
        margin: '0 0.5em',
        backgroundColor: '#000',
        color: 'white',
        width: '1280px',
    },
    homeTitle: {
        fontSize: '32px',
        fontFamily: 'Courier New',
        marginBottom: '20px',
        color: '#ffffff',
        textShadow: '4px 4px 15px rgba(0, 0, 0, 0.8)',
    },
    description: {
        fontSize: '18px',
        fontFamily: 'Courier New',
        marginBottom: '20px',
    },
    subTitle: {
        fontSize: '20px',
        fontWeight: 'bold',
        marginTop: '20px',
        marginBottom: '10px',
    },
    rule: {
        fontSize: '16px',
        fontFamily: 'Courier New',
        marginBottom: '10px',
        paddingHorizontal: '20px',
    },
    bold: {
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#8B0000', // Rojo oscuro
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease', // Transición suave al pasar el ratón
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center', /* Centra horizontalmente */
        alignItems: 'center', /* Centra verticalmente */
        flex: 1,
        gap: '20px',
    }

};
