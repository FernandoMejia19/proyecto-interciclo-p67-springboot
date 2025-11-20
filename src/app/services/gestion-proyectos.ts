import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GestionProyectos {
  proyectos : any []=[]
  add (proyectos : any){
    this.proyectos.push({...proyectos});
  }

  getAll(){
    return this.proyectos;
  }

  
}
