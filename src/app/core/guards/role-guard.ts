import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { UserService } from '../services/user';
import { switchMap, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.auth.getUser().pipe(
      switchMap(user => {

        if (!user) {
          this.router.navigate(['/login']);
          return of(false);
        }

        return this.userService.getUserRole(user.uid).pipe(
          map(role => {
            if (role === 'admin') {
              return true;
            } else {
              this.router.navigate(['/forbidden']);
              return false;
            }
          })
        );
      })
    );
  }
}
