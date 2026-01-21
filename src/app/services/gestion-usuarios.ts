import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Injector, NgModule, runInInjectionContext } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { Usuario } from '../../models/entitys';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GestionUsuarios {
  private baseURL='http://localhost:8080/api';
  constructor (private http:HttpClient){}

  getUsuarios(): Observable<any[]> {   
    return this.http.get<any[]>(this.baseURL+'/usuarios');
    };
  }
