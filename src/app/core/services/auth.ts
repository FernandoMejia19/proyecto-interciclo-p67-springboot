import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Usuario } from '../../../models/entitys';

export interface LoginResponse {
  id: number;
  email: string;
  nombre: string;
  rol: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseURL = 'http://localhost:8080/api/auth';
  
  private currentUserSubject = new BehaviorSubject<LoginResponse | null>(
    this.getUsuarioLogeado()
  );
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  loginBackend(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      this.baseURL + '/login',
      { email, contrasena: password }
    ).pipe(
      tap(resp => {
        localStorage.setItem('usuario', JSON.stringify(resp));
        this.currentUserSubject.next(resp);
      })
    );
  }

  getUserProfile(userId: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseURL}/usuarios/${userId}`);
  }

  getUsuarioLogeado(): LoginResponse | null {
    const data = localStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }

  // Método para verificar rol
  tieneRol(rol: string): boolean {
    const usuario = this.getUsuarioLogeado();
    return usuario?.rol === rol;
  }

  // Método para verificar si tiene alguno de los roles
  tieneAlgunRol(roles: string[]): boolean {
    const usuario = this.getUsuarioLogeado();
    return usuario ? roles.includes(usuario.rol) : false;
  }

  logout() {
    localStorage.removeItem('usuario');
    this.currentUserSubject.next(null);
  }

  estaLogeado(): boolean {
    return !!localStorage.getItem('usuario');
  }

  // Método para obtener el rol actual
  getRolActual(): string | null {
    const usuario = this.getUsuarioLogeado();
    return usuario?.rol || null;
  }
}