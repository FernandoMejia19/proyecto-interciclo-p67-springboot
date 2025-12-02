import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth: Auth, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const user = this.auth.currentUser;

    if (user) {
      // Está logueado → permitir acceso
      return true;
    }

    // No logueado → redirigir a login
    this.router.navigate(['/login']);
    return false;
  }
}

