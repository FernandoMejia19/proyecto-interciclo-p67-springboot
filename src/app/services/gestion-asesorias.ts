import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FASTAPI_URL } from '../../environments/fastapi.config';

/* =======================
  MODELOS
======================= */

export interface ReservaCreate {
  motivo: string;
  estado: string;
  asesoria_id: number;
  hora_asesoria_id: number;
  solicitante_id: number;
  programador_id: number;
}

export interface Reserva {
  id: number;
  motivo: string;
  estado: string;
  asesoria_id: number;
  hora_asesoria_id: number;
  solicitante_id: number;
  programador_id: number;
}

/* =======================
  SERVICIO
======================= */

@Injectable({
  providedIn: 'root'
})
export class GestionAsesorias {
  
  private urlAsesorias = FASTAPI_URL+ '/asesorias';
  private urlHoras = FASTAPI_URL+ '/horas-asesoria';

  private apiUrl =FASTAPI_URL+ '/reservas';

  constructor(private http: HttpClient) {}

  /** Crear reserva */
  crearReserva(data: ReservaCreate): Observable<Reserva> {
    return this.http.post<Reserva>(this.apiUrl + '/', data);
  }

  /** Reservas del solicitante */
  obtenerPorSolicitante(id: number): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(
      this.apiUrl + '/solicitante/' + id
    );
  }

  /** Reservas del programador */
  obtenerPorProgramador(id: number): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(
      this.apiUrl + '/programador/' + id
    );
  }

  /** Cambiar estado */
  cambiarEstado(
    reservaId: number,
    estado: string
  ): Observable<Reserva> {
    return this.http.put<Reserva>(
      this.apiUrl + '/' + reservaId + '/estado?estado=' + estado,
      {}
    );
  }

  /** Cancelar reserva */
  cancelarReserva(reservaId: number): Observable<any> {
    return this.http.put(
      this.apiUrl + '/' + reservaId + '/cancelar',
      {}
    );
  }

  /** Detalle de reserva */
  obtenerDetalle(reservaId: number): Observable<any> {
    return this.http.get(
      this.apiUrl + '/detalle/' + reservaId
    );
  }
  crearDisponibilidad(data: {
    idProgramador: number;
    fecha: string;
    horaInicio: string;
    horaFin: string;
  }): Observable<any> {
    return this.http.post(
      this.apiUrl + '/disponibilidad',
      data
    );
  }
  obtenerAsesoriasPorProgramador(idProgramador: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlAsesorias}/programador/${idProgramador}`);
  }

  /** * Trae las horas disponibles (no reservadas) para una fecha específica
   * Endpoint: GET /horas-asesoria/{asesoria_id}
   */
  obtenerHorasDisponibles(asesoriaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlHoras}/${asesoriaId}`);
  }

}
