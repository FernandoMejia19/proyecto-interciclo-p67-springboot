import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HoraAsesoria } from '../../models/entitys';

@Injectable({
  providedIn: 'root',
})
export class GestionHoras {
  private baseURL='http://localhost:8080/api/auth';
  constructor(private http:HttpClient){}
  getHoras():Observable<HoraAsesoria[]>{
    return this.http.get<HoraAsesoria[]>(this.baseURL+'/hora-asesoria');
  }
}
