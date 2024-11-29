import React from 'react';
import fondoJuego from "../assets/images/fondoJuego.png";
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
                <Parallax y={[-20, 20]} tagOuter="figure">
                    <img
                        src={fondoJuego}
                        alt="Fondo para Juego"
                        style={{width: '100%', height: 'auto'}}
                    />
                </Parallax>

                <h1 style={styles.title}>¡Bienvenido a OuijPers!</h1>
                <p style={styles.description}>
                    En los rincones más oscuros de la existencia, existe un portal de comunicación entre los vivos y los
                    espíritus, un vínculo que pocos se atreven a cruzar: OuijPers. Este juego sella la unión entre
                    médiums y entidades etéreas - ángeles, demonios y espectros vagabundos atrapados en el más allá. El
                    médium, arriesgando su propia esencia, intentará desentrañar las palabras ocultas por estos
                    espíritus. Solo los más valientes pueden resistir la presión de su presencia… y ganar el
                    conocimiento secreto que guardan.
                </p>

                <h2 style={styles.subTitle}>El Desafío del Ahorcado Espiritual</h2>
                <p style={styles.description}>
                    La partida enfrenta a dos seres con papeles definidos: un espíritu, cuya energía se oculta tras
                    palabras arcanas, y un médium, que intenta acceder a su poder. Cada sesión se desarrolla en tres
                    rondas, y cada una representa una conexión con un espíritu distinto, con una palabra que guarda sus
                    secretos.
                </p>

                <p style={styles.rule}>
                    <span style={styles.bold}>1. El Rol del Espíritu</span><br/>
                    En silencio, el espíritu elige una palabra que el médium debe adivinar, un conocimiento sagrado o un
                    enigma oscuro. Si el médium se equivoca al intentar descubrirlo, el espíritu toma forma lentamente,
                    invocando su figura espectral como advertencia. Primero, aparece la cabeza, luego el torso y las
                    extremidades, cada error acercando al médium a la presencia total de la entidad. Un fracaso absoluto
                    puede significar la liberación del espíritu al plano de los vivos.
                </p>

                <p style={styles.rule}>
                    <span style={styles.bold}>2. El Rol del Médium</span><br/>
                    El médium debe ser astuto y audaz, eligiendo letras en la OuijPers para desvelar la palabra oculta.
                    Cada letra acertada abre una ventana al misterio, mientras que cada fallo da más poder al espíritu.
                    Si adivina correctamente la palabra antes de completar la figura del espíritu, el conocimiento
                    arcano pasa al médium y la entidad regresa al plano astral. Sin embargo, si la figura se completa,
                    el espíritu podría liberarse, tomando parte de la esencia del médium antes de romper el vínculo.
                </p>

                <div style={styles.buttonContainer}>
                    <button style={styles.button} onClick={() => navigate("/name-character")}>Iniciar una partida</button>
                    <button style={styles.button} onClick={() => navigate("/ranking")}>Ver Ranking</button>
                </div>
            </div>
        </ParallaxProvider>
    );
}

const styles = {
    container: {
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#000',
        color: 'white',
    },
    title: {
        fontSize: '32px',
        fontFamily: 'Courier New',
        marginBottom: '20px',
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
        backgroundColor: '#A1CEDC',
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        fontSize: '16px',
        cursor: 'pointer',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center', /* Centra horizontalmente */
        alignItems: 'center', /* Centra verticalmente */
        flex: 1,
        gap: '20px',
    }

};