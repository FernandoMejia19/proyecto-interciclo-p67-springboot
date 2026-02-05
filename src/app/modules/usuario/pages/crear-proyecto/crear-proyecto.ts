import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth';
import { GestionProyectos, ProyectoRequest } from '../../../../services/gestion-proyectos';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-proyecto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-proyecto.html',
  styleUrls: ['./crear-proyecto.scss']
})
export class CrearProyectoComponent implements OnInit {

  miFormulario: FormGroup;
  idUsuario: number = 0;
  guardando = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private gestionProyectos: GestionProyectos
  ) {
    this.miFormulario = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      tecnologias: [''],
      imagen: ['', Validators.pattern(/^https?:\/\/.+/)],
      linkRepo: ['', Validators.pattern(/^https?:\/\/.+/)]
    });
  }

  ngOnInit() {
    const usuarioActual = this.authService.getUsuarioLogeado();
    this.miFormulario.statusChanges.subscribe(status => {
  console.log(status, this.miFormulario.controls);
});

    if (!usuarioActual) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debes iniciar sesión para crear un proyecto'
      }).then(() => {
        this.router.navigate(['/login']);
      });
      return;
    }

    this.idUsuario = usuarioActual.id;
    console.log('Usuario actual ID:', this.idUsuario);
  }

  cancelar() {
    Swal.fire({
      title: '¿Cancelar creación?',
      text: 'Se perderán los datos ingresados',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, continuar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/perfilUsuario']);
      }
    });
  }

  guardar() {
    // Validar formulario
    if (this.miFormulario.invalid) {
      this.marcarCamposComoTocados();
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor completa todos los campos requeridos'
      });
      return;
    }

    // Validar usuario
    if (!this.idUsuario) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se identificó al usuario'
      }).then(() => {
        this.router.navigate(['/login']);
      });
      return;
    }

    this.guardando = true;

    const formVal = this.miFormulario.value;

    // Preparar datos para el backend
    const nuevoProyecto: ProyectoRequest = {
      titulo: formVal.titulo.trim(),
      descripcion: formVal.descripcion.trim(),
      imagen: formVal.imagen?.trim() || 'https://www.educaciontrespuntocero.com/wp-content/uploads/2016/12/ideas-sobre-proyectos-de-programacion-para.jpg',
      linkRepo: formVal.linkRepo?.trim() || '',
      idProgramador: this.idUsuario,
      fecha: new Date().toISOString().split('T')[0] // Formato: "2024-01-31"
    };

    console.log('Creando proyecto:', nuevoProyecto);

    // Guardar en el backend
    this.gestionProyectos.crearProyecto(nuevoProyecto).subscribe({
      next: (proyectoCreado) => {
        console.log('Proyecto creado exitosamente:', proyectoCreado);
        
        Swal.fire({
          icon: 'success',
          title: '¡Proyecto creado!',
          text: 'Tu proyecto ha sido publicado correctamente',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/perfilUsuario'], {
            state: { 
              toast: { 
                mensaje: 'Proyecto creado correctamente', 
                tipo: 'success' 
              } 
            }
          });
        });
      },
      error: (error) => {
        console.error('Error al crear proyecto:', error);
        
        let mensajeError = 'No se pudo crear el proyecto';
        
        if (error.status === 400) {
          mensajeError = 'Datos del proyecto inválidos';
        } else if (error.status === 401) {
          mensajeError = 'No tienes permisos para crear proyectos';
        } else if (error.status === 404) {
          mensajeError = 'Usuario no encontrado';
        }

        Swal.fire({
          icon: 'error',
          title: 'Error al crear proyecto',
          text: mensajeError
        });

        this.guardando = false;
      }
    });
  }

  // Método auxiliar para validaciones visuales
  private marcarCamposComoTocados() {
    Object.keys(this.miFormulario.controls).forEach(campo => {
      const control = this.miFormulario.get(campo);
      control?.markAsTouched();
    });
  }

  // Métodos para mostrar errores en el template
  campoEsInvalido(campo: string): boolean {
    const control = this.miFormulario.get(campo);
    return !!(control && control.invalid && control.touched);
  }

  obtenerMensajeError(campo: string): string {
    const control = this.miFormulario.get(campo);
    
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Debe tener al menos ${minLength} caracteres`;
    }
    
    if (control?.hasError('pattern')) {
      return 'Debe ser una URL válida (ejemplo: https://...)';
    }
    
    return '';
  }
}