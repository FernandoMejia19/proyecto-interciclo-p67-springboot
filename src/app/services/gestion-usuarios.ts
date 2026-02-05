import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../../models/entitys';

@Injectable({
  providedIn: 'root',
})
export class GestionUsuarios {
  private baseURL = 'http://localhost:8080/api/auth';
  
  constructor(private http: HttpClient) {}

  // ========== MÉTODOS EXISTENTES ==========
  getUsuarios(): Observable<Usuario[]> {   
    return this.http.get<Usuario[]>(this.baseURL + '/usuarios');
  }
  
  getUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(this.baseURL + '/usuarios/' + id);
  }

  // ========== NUEVOS MÉTODOS ==========

  // Crear usuario
  crearUsuario(usuario: Partial<Usuario>): Observable<Usuario> {
    return this.http.post<Usuario>(this.baseURL + '/usuarios', usuario);
  }

  // Actualizar usuario
  actualizarUsuario(id: number, usuario: Partial<Usuario>): Observable<Usuario> {
    return this.http.put<Usuario>(this.baseURL+'/usuarios/'+id, usuario);
  }

  // Actualización parcial (solo campos específicos)
  actualizarParcial(id: number, datos: Partial<Usuario>): Observable<Usuario> {
    return this.http.patch<Usuario>(this.baseURL+'/usuarios/'+id, datos);
  }

  // Eliminar usuario
  eliminarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(this.baseURL+'/usuarios/'+id);
  }

  // Subir foto de perfil (cuando implementes el endpoint)
  subirFotoPerfil(id: number, formData: FormData): Observable<{ url: string }> {
    return this.http.post<{ url: string }>(
      this.baseURL+'/usuarios/'+id+'/foto',
      formData
    );
  }

  // Buscar usuarios por rol
  obtenerPorRol(rol: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.baseURL+'/usuarios/rol/'+rol);
  }

  // Buscar usuarios por ciudad/país
  buscarPorUbicacion(ciudad?: string, pais?: string): Observable<Usuario[]> {
    let params = '';
    if (ciudad) params += `ciudad=${ciudad}&`;
    if (pais) params += `pais=${pais}`;
    
    return this.http.get<Usuario[]>(this.baseURL+'/usuarios/buscar?'+params);
  }
  getReporteGeneral() {
  return this.http.get(this.baseURL+'/admin/reportes/resumen');
}

}