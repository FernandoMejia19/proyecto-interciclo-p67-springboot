import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav-bar-admin',
  imports: [RouterOutlet],
  templateUrl: './nav-bar-admin.html',
  styleUrl: './nav-bar-admin.scss',
})
export class NavBarAdmin {
  constructor( private router:Router){

  }
  
  salir(){
    this.router.navigate(['/portafolios']);
  }
}
