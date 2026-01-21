import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GestionProyectos {
  private baseURL='http://localhost:8080/api';
  constructor (private http:HttpClient){}

  getProyectos(): Observable<any[]> {   
    return this.http.get<any[]>(this.baseURL+'/proyectos');
    };
}