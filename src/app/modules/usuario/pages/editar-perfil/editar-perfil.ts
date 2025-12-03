import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-editar-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-perfil.html',
  styleUrl: './editar-perfil.scss'
})
export class EditarPerfilComponent implements OnInit {
  perfilForm: FormGroup;
  usuario: any = null;
  fotoPreview: string | null = null;
  fotoArchivo: File | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private firestore: Firestore,
    private router: Router
  ) {
    this.perfilForm = this.fb.group({
      nombre: [''],
      ciudad: [''],
      pais: [''],
      descripcion: [''],
      facebook: [''],
      whatsapp: [''],
      instagram: [''],
      linkedin: ['']
    });
  }

  async ngOnInit() {
    this.authService.currentUser$.subscribe(async user => {
      if (user) {
        this.usuario = await this.authService.getUserProfile(user.uid);
        if (this.usuario) {
          this.perfilForm.patchValue({
            nombre: this.usuario.nombre || '',
            ciudad: this.usuario.ciudad || '',
            pais: this.usuario.pais || '',
            descripcion: this.usuario.descripcion || '',
            facebook: this.usuario.contactos?.facebook || '',
            whatsapp: this.usuario.contactos?.whatsapp || '',
            instagram: this.usuario.contactos?.instagram || '',
            linkedin: this.usuario.contactos?.linkedin || ''
          });
          this.fotoPreview = this.usuario.photoURL;
        }
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fotoArchivo = file;
      const reader = new FileReader();
      reader.onload = (e: any) => this.fotoPreview = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  

  cancelar() {
    this.router.navigate(['/perfil']);
  }
  async guardarCambios() {
  if (this.perfilForm.invalid) {
    alert('Por favor completa los campos correctamente');
    return;
  }

  try {
    // OBTENEMOS EL USUARIO ACTUAL (siempre tiene el UID correcto)
    const user = await this.authService.getCurrentUser();
    if (!user) {
      alert('Error: no estás autenticado');
      this.router.navigate(['/login']);
      return;
    }

    const uid = user.uid; // ESTE ES EL ID CORRECTO SIEMPRE

    const datosActualizados: any = {
      nombre: this.perfilForm.get('nombre')?.value?.trim() || '',
      ciudad: this.perfilForm.get('ciudad')?.value?.trim() || '',
      pais: this.perfilForm.get('pais')?.value?.trim() || '',
      descripcion: this.perfilForm.get('descripcion')?.value?.trim() || '',
      contactos: {
        facebook: this.perfilForm.get('facebook')?.value?.trim() || '',
        whatsapp: this.perfilForm.get('whatsapp')?.value?.trim() || '',
        instagram: this.perfilForm.get('instagram')?.value?.trim() || '',
        linkedin: this.perfilForm.get('linkedin')?.value?.trim() || '',
      }
    };

    // Subir foto si hay una nueva
    if (this.fotoArchivo) {
      const url = await this.authService.subirFotoPerfil(this.fotoArchivo, uid);
      datosActualizados.photoURL = url;
    }

    // GUARDAR EN FIRESTORE (siempre con el UID real)
    const userDocRef = doc(this.firestore, 'users', uid);
    await updateDoc(userDocRef, datosActualizados);

    alert('¡Perfil actualizado correctamente!');
    this.router.navigate(['/perfil']);

  } catch (error) {
    console.error('Error al guardar perfil:', error);
    alert('Error al guardar los cambios');
  }
}
}