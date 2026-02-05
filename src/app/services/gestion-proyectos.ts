import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Proyecto } from '../../models/entitys';

export interface ProyectoRequest {
  titulo: string;
  descripcion: string;
  imagen: string;
  linkRepo: string;
  idProgramador: number;
  fecha: string; // ISO format: "2024-01-31"
}

@Injectable({
  providedIn: 'root'
})
export class GestionProyectos {

  private baseURL = 'http://localhost:8080/api/auth/proyectos';

  constructor(private http: HttpClient) {}

  // ========== MÉTODOS ORIGINALES ==========
  
  obtenerTodos(): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(this.baseURL);
  }

  obtenerPorId(id: number): Observable<Proyecto> {
    return this.http.get<Proyecto>(`${this.baseURL}/${id}`);
  }

  crear(proyecto: ProyectoRequest): Observable<Proyecto> {
    return this.http.post<Proyecto>(this.baseURL, proyecto);
  }

  actualizar(id: number, proyecto: Partial<ProyectoRequest>): Observable<Proyecto> {
    return this.http.put<Proyecto>(`${this.baseURL}/${id}`, proyecto);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseURL}/${id}`);
  }

  // ========== ALIAS PARA COMPATIBILIDAD ==========
  
  getProyectos(): Observable<Proyecto[]> {
    return this.obtenerTodos();
  }

  getProyecto(id: number): Observable<Proyecto> {
    return this.obtenerPorId(id);
  }

  crearProyecto(proyecto: ProyectoRequest): Observable<Proyecto> {
    return this.crear(proyecto);
  }

  actualizarProyecto(id: number, proyecto: Partial<ProyectoRequest>): Observable<Proyecto> {
    return this.actualizar(id, proyecto);
  }

  eliminarProyecto(id: number): Observable<void> {
    return this.eliminar(id);
  }

  // ========== MÉTODOS ADICIONALES ==========

  // Obtener proyectos por programador
  obtenerPorProgramador(idProgramador: number): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(`${this.baseURL}/programador/${idProgramador}`);
  }

  // Buscar proyectos por título
  buscarPorTitulo(titulo: string): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(`${this.baseURL}/buscar?titulo=${titulo}`);
  }
  
}