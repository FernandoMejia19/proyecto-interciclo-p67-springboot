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
      facebook: ['', Validators.pattern(/^(?!\d+$).+/)], // no solo números
      celular: ['', Validators.pattern(/^\d{7,15}$/)],     // solo números 7-15 dígitos
      linkedin: ['', Validators.pattern(/^(?!\d+$).+/)],
      github: ['', Validators.pattern(/^(?!\d+$).+/)],
      instagram: ['', Validators.pattern(/^(?!\d+$).+/)]
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
    if (!file) return;

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

  cancelar() {
    this.router.navigate(['/perfilUsuario']);
  }

  guardarCambios() {
    // Validar campos manualmente para mostrar mensajes específicos
    if (this.perfilForm.invalid) {
      const errores = [];
      if (this.perfilForm.get('facebook')?.errors?.['pattern']) errores.push('Facebook no puede ser solo números');
      if (this.perfilForm.get('linkedin')?.errors?.['pattern']) errores.push('LinkedIn no puede ser solo números');
      if (this.perfilForm.get('github')?.errors?.['pattern']) errores.push('GitHub no puede ser solo números');
      if (this.perfilForm.get('instagram')?.errors?.['pattern']) errores.push('Instagram no puede ser solo números');
      if (this.perfilForm.get('celular')?.errors?.['pattern']) errores.push('WhatsApp debe contener solo números (7-15 dígitos)');

      Swal.fire('Campos inválidos', errores.join('<br>'), 'error');
      return;
    }

    const datosActualizados: Partial<Usuario> = {
      nombre: this.perfilForm.get('nombre')?.value.trim() || '',
      ciudad: this.perfilForm.get('ciudad')?.value.trim() || '',
      pais: this.perfilForm.get('pais')?.value.trim() || '',
      descripcion: this.perfilForm.get('descripcion')?.value.trim() || '',
      facebook: this.perfilForm.get('facebook')?.value.trim() || '',
      celular: this.perfilForm.get('celular')?.value.trim() || '',
      linkedin: this.perfilForm.get('linkedin')?.value.trim() || '',
      github: this.perfilForm.get('github')?.value.trim() || ''
    };

    if (this.fotoArchivo) {
      const formData = new FormData();
      formData.append('foto', this.fotoArchivo);
      this.gestionUsuarios.subirFotoPerfil(this.usuarioId, formData).subscribe({
        next: (res) => {
          datosActualizados.foto = res.url;
          this.actualizarDatos(datosActualizados);
        },
        error: () => this.actualizarDatos(datosActualizados)
      });
    } else {
      this.actualizarDatos(datosActualizados);
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
