import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TecnolgiaProyecto } from '../../models/entitys';

@Injectable({
  providedIn: 'root',
})
export class GestionTecnologiaProyecto {
  private baseURL='http://localhost:8080/api/auth';
  constructor(private http:HttpClient){}
  getTecnologiasProyecto():Observable<TecnolgiaProyecto[]>{
    return this.http.get<TecnolgiaProyecto[]>(this.baseURL+'/tecnologias-proyecto')
  }
}
