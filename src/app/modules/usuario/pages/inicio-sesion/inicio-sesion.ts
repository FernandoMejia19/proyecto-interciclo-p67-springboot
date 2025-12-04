import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio-sesion',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './inicio-sesion.html',
  styleUrl: './inicio-sesion.scss',
})
export class InicioSesion {

  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  salir() {
    this.router.navigate(['/proyectos']);
  }

  async login() {
  if (this.loginForm.invalid) {
        this.errorMessage = 'Por favor completa los campos correctamente'; 
        return;
    }
  this.loading = true;
  this.errorMessage = '';
  const { email, password } = this.loginForm.value;
  try {
    const userCredential = await this.authService.login(email, password);
    const uid = userCredential.user?.uid;

    if (uid) {
      const role = await this.authService.getUserRole(uid); 
      
      console.log('Login exitoso. Rol:', role);
      switch (role) {
        case 'admin':
          this.router.navigate(['/administrador']);
          break;
        case 'dev': 
          this.router.navigate(['/perfilUsuario']);
          break;
        case 'user':
        default:
          this.router.navigate(['/proyectos']); 
          break;
      }
    }

  } catch (error: any) {
    console.log(error);
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          this.errorMessage = 'Correo o contraseña incorrectos.';
      } else if (error.code === 'auth/too-many-requests') {
          this.errorMessage = 'Demasiados intentos fallidos. Intenta más tarde.';
      } else {
          this.errorMessage = 'Ocurrió un error al iniciar sesión.';
      }
  }
  this.loading = false;
}
async loginGoogle() {
    this.loading = true;
    this.errorMessage = '';
    try {
        const userCredential = await this.authService.loginWithGoogle();
        if (userCredential.user?.uid) {
            await this.redirigirSegunRol(userCredential.user.uid);
        }
    } catch (error) {
        console.error(error);
        this.errorMessage = 'Error al iniciar con Google';
    }
    this.loading = false;
  }
  async redirigirSegunRol(uid: string) {
    const role = await this.authService.getUserRole(uid); 
    console.log('Login exitoso. Rol:', role);
    switch (role) {
      case 'admin':
        this.router.navigate(['/administrador']);
        break;
      case 'dev': 
        this.router.navigate(['/perfilUsuario']);
        break;
      case 'user':
      default:
        this.router.navigate(['/proyectos']); 
        break;
    }
  }

}
