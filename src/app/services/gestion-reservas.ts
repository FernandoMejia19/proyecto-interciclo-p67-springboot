import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReservaAsesoria } from '../../models/entitys';

@Injectable({
  providedIn: 'root',
})
export class GestionReservas {
  private baseURL='http://localhost:8080/api/auth';
  constructor(private http:HttpClient){}
  getReservas():Observable<ReservaAsesoria[]>{
    return this.http.get<ReservaAsesoria[]>(this.baseURL+'/reserva-asesoria');
  }
}
