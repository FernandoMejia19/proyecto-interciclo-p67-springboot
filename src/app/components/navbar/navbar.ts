import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive,Router } from "@angular/router";

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  constructor(private router: Router){

  }
  registrar(){
    console.log("Te quieres registrar ");
  }
  ingresar(){
    console.log("quieres iniciar ");
    this.router.navigate(['/inicio-sesion']);
  }

}
