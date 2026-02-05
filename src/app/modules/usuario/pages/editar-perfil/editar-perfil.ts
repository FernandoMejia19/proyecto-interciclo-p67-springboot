import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth';
import Swal from 'sweetalert2';
import { Usuario } from '../../../../../models/entitys';
import { GestionUsuarios } from '../../../../services/gestion-usuarios';

@Component({
  selector: 'app-editar-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-perfil.html',
  styleUrl: './editar-perfil.scss'
})
export class EditarPerfilComponent implements OnInit {
  perfilForm: FormGroup; 
  usuario: Usuario | null = null;
  fotoPreview: string | null = null;
  fotoArchivo: File | null = null;
  usuarioId: number = 0;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private gestionUsuarios: GestionUsuarios,
    private router: Router
  ) {
    this.perfilForm = this.fb.group({
      nombre: ['', Validators.required],
      ciudad: [''],
      pais: [''],
      descripcion: [''],
      facebook: [''],
      celular: [''],
      linkedin: [''],
      github: ['']
    });
  }

  ngOnInit() {
    const usuarioActual = this.authService.getUsuarioLogeado();
    
    if (!usuarioActual) {
      Swal.fire('Error', 'Debes iniciar sesión', 'error');
      this.router.navigate(['/login']);
      return;
    }

    this.usuarioId = usuarioActual.id;

    // Cargar datos del usuario
    this.gestionUsuarios.getUsuario(this.usuarioId).subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        this.perfilForm.patchValue({
          nombre: usuario.nombre || '',
          ciudad: usuario.ciudad || '',
          pais: usuario.pais || '',
          descripcion: usuario.descripcion || '',
          facebook: usuario.facebook || '',
          celular: usuario.celular || '',
          linkedin: usuario.linkedin || '',
          github: usuario.github || ''
        });
        this.fotoPreview = usuario.foto || null;
      },
      error: (err) => {
        console.error('Error al cargar perfil:', err);
        Swal.fire('Error', 'No se pudo cargar tu perfil', 'error');
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        Swal.fire('Error', 'Solo se permiten archivos de imagen', 'error');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        Swal.fire('Error', 'La imagen no debe superar los 5MB', 'error');
        return;
      }

      this.fotoArchivo = file;
      const reader = new FileReader();
      reader.onload = (e: any) => this.fotoPreview = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  cancelar() {
    this.router.navigate(['/perfilUsuario']);
  }

  async guardarCambios() {
    if (this.perfilForm.invalid) {
      Swal.fire('Por favor completa los campos correctamente');
      return;
    }

    try {
      const datosActualizados: Partial<Usuario> = {
        nombre: this.perfilForm.get('nombre')?.value?.trim() || '',
        ciudad: this.perfilForm.get('ciudad')?.value?.trim() || '',
        pais: this.perfilForm.get('pais')?.value?.trim() || '',
        descripcion: this.perfilForm.get('descripcion')?.value?.trim() || '',
        facebook: this.perfilForm.get('facebook')?.value?.trim() || '',
        celular: this.perfilForm.get('celular')?.value?.trim() || '',
        linkedin: this.perfilForm.get('linkedin')?.value?.trim() || '',
        github: this.perfilForm.get('github')?.value?.trim() || ''
      };

      // Si hay una nueva foto, primero subirla
      if (this.fotoArchivo) {
        const formData = new FormData();
        formData.append('foto', this.fotoArchivo);
        
        this.gestionUsuarios.subirFotoPerfil(this.usuarioId, formData).subscribe({
          next: (response) => {
            datosActualizados.foto = response.url;
            this.actualizarDatos(datosActualizados);
          },
          error: (err) => {
            console.error('Error al subir foto:', err);
            Swal.fire('Info', 'Error al subir la foto, guardando otros cambios...', 'info');
            this.actualizarDatos(datosActualizados);
          }
        });
      } else {
        this.actualizarDatos(datosActualizados);
      }

    } catch (error) {
      console.error('Error al guardar perfil:', error);
      Swal.fire('Error al guardar los cambios');
    }
  }

  private actualizarDatos(datos: Partial<Usuario>) {
    this.gestionUsuarios.actualizarUsuario(this.usuarioId, datos).subscribe({
      next: () => {
        Swal.fire('¡Perfil actualizado correctamente!');
        this.router.navigate(['/perfilUsuario']);
      },
      error: (err) => {
        console.error('Error al guardar perfil:', err);
        Swal.fire('Error al guardar los cambios');
      }
    });
  }
}