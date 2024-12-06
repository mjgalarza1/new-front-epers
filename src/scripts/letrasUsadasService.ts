import { Observable } from 'rxjs';
import { API_BASE_URL } from "../util/util";

export const obtenerLetrasUsadas = (idPalabra: string): Observable<string[]> => {
    return new Observable<string[]>((subscriber) => {
        const eventSource = new EventSource(`${API_BASE_URL}/palabraRondaUltimate/${idPalabra}/letrasUsadas`);

        eventSource.onmessage = (event) => {
            try {
                const data = event.data.split(',');
                subscriber.next(data);
            } catch (error) {
                console.error('Error al procesar letras equivocadas:', error);
                subscriber.error(error);
            }
        };

        eventSource.onerror = (error) => {
            console.error('Error en el flujo de letras equivocadas:', error);
            subscriber.error(new Error('La conexión con el servidor falló.'));
            eventSource.close();
        };

        return () => eventSource.close();
    });
};
