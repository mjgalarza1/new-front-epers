import { Observable } from 'rxjs';
import {API_BASE_URL} from "../util/util";

interface Jugador {
    nombre: string;
    puntaje: number;
}

export const obtenerRanking = (): Observable<Jugador> => {
    return new Observable<Jugador>((subscriber) => {
        const eventSource = new EventSource(`${API_BASE_URL}/jugador/ranking`);

        eventSource.onmessage = (event) => {
            console.log('Mensaje recibido:', event.data);
            try {
                const data: Jugador = JSON.parse(event.data); // Procesar los datos recibidos
                subscriber.next(data); // Emitir el jugador al observable
            } catch (error) {
                console.error('Error al procesar los datos recibidos:', error);
                subscriber.error(error); // Notificar error si el JSON no es válido
            }
        };

        eventSource.onerror = (error) => {
            console.error('Error en la conexión EventSource:', error);
            subscriber.error(new Error('La conexión con el servidor falló.')); // Emitir error
            eventSource.close(); // Cerrar la conexión
        };

        // Limpiar la conexión cuando no haya suscriptores
        return () => {
            eventSource.close();
        };
    });
};