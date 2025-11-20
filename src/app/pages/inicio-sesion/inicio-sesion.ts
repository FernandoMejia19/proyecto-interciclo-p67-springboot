import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio-sesion',
  imports: [],
  templateUrl: './inicio-sesion.html',
  styleUrl: './inicio-sesion.scss',
})
export class InicioSesion {
  constructor(private router:Router){

  }
  salir(){
    console.log('ir a portafolios');
    this.router.navigate(['/portafolios']);
  }
}
