import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from "@angular/router";
import { AuthService } from '../../core/services/auth'; 
import { map, of, switchMap } from 'rxjs';

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
    this.user$ = this.authService.currentUser$.pipe(
  switchMap((user) => {
    if (!user) return of(null);

    return this.authService.getUserFirestoreData$(user.uid).pipe(
      map((data: any) => ({
        ...user,
        photoURL: data?.photoURL || user.photoURL
      }))
    );
  })
);

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