import { Observable } from 'rxjs';
import { API_BASE_URL } from "../util/util";

export const palabra = (): Observable<string> => {
    return new Observable<string>((subscriber) => {
        const eventSource = new EventSource(`${API_BASE_URL}jugador/palabra/stream?nombreJugador=Juan`);

        // Manejar los mensajes entrantes
        eventSource.onmessage = (event) => {
            subscriber.next(event.data); // Emitir el valor recibido
        };

        // Manejar errores
        eventSource.onerror = (error) => {
            subscriber.error("Error en la conexión SSE: " + error);
            eventSource.close(); // Cerrar la conexión en caso de error
        };

        // Limpiar recursos cuando el Observable se complete o cancele
        return () => {
            eventSource.close();
        };
    });
};
