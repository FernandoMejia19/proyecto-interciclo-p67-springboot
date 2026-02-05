import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GestionNotificacion {
  private URL = 'http://localhost:8090/api-portafolios/api/notificaciones';

  constructor(private http: HttpClient) { }

  enviarNotificacion(email: string, mensaje: string): Observable<any> {
    const body = {
      emailDestinatario: email,
      descripcion: mensaje
    };
    return this.http.post(this.URL, body, { responseType: 'text' });
  }
}
