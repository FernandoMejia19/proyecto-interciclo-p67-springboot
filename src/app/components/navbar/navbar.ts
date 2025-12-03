import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from "@angular/router";
import { AuthService } from '../../core/services/auth'; 

@Component({
  selector: 'app-navbar',
  standalone: true, 
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {

  user$;
  menuAbierto = false;
  
  constructor(
    private router: Router,
    public authService: AuthService 
  ) {
    this.user$ = this.authService.currentUser$;

  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  logout() {
    this.authService.logout().then(() => {
      this.menuAbierto = false; 
      this.router.navigate(['/login']); 
    });
  }

  ingresar(){
    this.router.navigate(['/login']); 
  }
}