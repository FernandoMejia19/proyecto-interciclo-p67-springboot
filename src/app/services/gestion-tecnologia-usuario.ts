import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioTecnologia } from '../../models/entitys';

@Injectable({
  providedIn: 'root',
})
export class GestionTecnologiaUsuario {
  private baseUrl='http://localhost:8080/api/auth';
  constructor(private http:HttpClient){}
  getTecnologiaUsuario():Observable<UsuarioTecnologia[]>{
    return this.http.get<UsuarioTecnologia[]>(this.baseUrl+'/tecnologia-usuario');
  }
}
