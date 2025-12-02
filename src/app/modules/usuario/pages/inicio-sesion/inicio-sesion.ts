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
    this.router.navigate(['/portafolios']);
  }

  async login() {
    if (this.loginForm.invalid) return;

    this.loading = true;

    const { email, password } = this.loginForm.value;

    try {
      await this.authService.login(email, password);

      console.log('Login exitoso');
      this.router.navigate(['/administrador']);
      
    } catch (error: any) {
      console.log(error);
      this.errorMessage = 'Correo o contraseña incorrectos';
    }

    this.loading = false;
  }
}
