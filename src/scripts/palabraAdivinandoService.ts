import { Observable } from 'rxjs';
import { API_BASE_URL } from '../util/util';

export const obtenerPalabraAdivinando = (idPalabra: string): Observable<string> => {
    return new Observable<string>((subscriber) => {
        const url = `${API_BASE_URL}/palabraRondaUltimate/${idPalabra}/palabraAdivinando`;
        const eventSource = new EventSource(url);

        eventSource.onmessage = (event) => {
            console.log('Mensaje recibido del stream:', event.data);
            try {
                // Emitir la palabra al observable
                subscriber.next(event.data);
            } catch (error) {
                console.error('Error al procesar los datos recibidos:', error);
                subscriber.error(error); // Notificar error si ocurre
            }
        };

        eventSource.onerror = (error) => {
            console.error('Error en la conexión EventSource:', error);
            subscriber.error(new Error('La conexión con el servidor falló.')); // Emitir error
            eventSource.close(); // Cerrar la conexión
        };

        // Limpiar la conexión cuando no haya suscriptores
        return () => {
            console.log('Cerrando conexión EventSource para palabraAdivinando');
            eventSource.close();
        };
    });
};