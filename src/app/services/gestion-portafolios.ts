import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GestionPortafolios {
  portafilios : any[]=[];


  add(portafilio:any){
    this.portafilios.push({...portafilio});

  }
  getAll(){
    return this.portafilios;
  }
}
