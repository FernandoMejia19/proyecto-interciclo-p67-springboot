import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AuthService, LoginResponse } from '../../../../core/services/auth';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio-sesion',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './inicio-sesion.html',
  styleUrl: './inicio-sesion.scss',
})
export class InicioSesion implements OnInit{

  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  ngOnInit() {
  const token = this.route.snapshot.queryParamMap.get('token');
  if(token) {
    localStorage.setItem('token', token);
    this.router.navigate(['/proyectos']);
  }
}


  salir() {
    this.router.navigate(['/proyectos']);
  }

  login() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor completa los campos correctamente';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.authService.loginBackend(email, password).subscribe({
      next: (resp: LoginResponse) => {
        console.log('Login exitoso:', resp);

        // Redirigir según rol
        switch (resp.rol) {
          case 'admin':
            this.router.navigate(['/administrador']);
            break;
          case 'dev':
            this.router.navigate(['/perfil']);
            break;
          default:
            this.router.navigate(['/proyectos']);
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Error en login:', err);
        
        // Mensajes de error más específicos según el código de estado
        if (err.status === 401) {
          this.errorMessage = 'Correo o contraseña incorrectos';
        } else if (err.status === 404) {
          this.errorMessage = 'Usuario no encontrado';
        } else if (err.status === 0) {
          this.errorMessage = 'No se puede conectar al servidor';
        } else {
          this.errorMessage = 'Error al iniciar sesión. Intenta nuevamente';
        }
        
        this.loading = false;
      }
    });
  }

  // TODO: Implementar login con Google cuando tengas el backend configurado
  loginGoogle() {
    //console.log('Login con Google - Pendiente de implementar');
    //this.errorMessage = 'Función no disponible aún';
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    // Cuando lo implementes, deberías hacer algo como:
    // this.authService.loginWithGoogle().subscribe({
    //   next: (resp) => {
    //     // Manejar respuesta
    //   },
    //   error: (err) => {
    //     this.errorMessage = 'Error al iniciar sesión con Google';
    //   }
    // });
  }
}