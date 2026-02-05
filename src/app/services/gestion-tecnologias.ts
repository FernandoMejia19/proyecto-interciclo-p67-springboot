import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tecnologia } from '../../models/entitys';

@Injectable({
  providedIn: 'root',
})
export class GestionTecnologias {
  private baseUrl='http://localhost:8080/api/auth';
  constructor(private http:HttpClient){}
  getTecnologias():Observable<Tecnologia[]>{
    return this.http.get<Tecnologia[]>(this.baseUrl+'/tecnologias');
  }
}

