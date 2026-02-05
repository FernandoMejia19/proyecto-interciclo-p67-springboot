import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../../../../models/entitys';
import { GestionUsuarios } from '../../../../services/gestion-usuarios';


@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-usuarios.html',
  styleUrl: './admin-usuarios.scss'
})
export class AdminUsuarios implements OnInit {

  usuarios: any[] = [];
  loading = false;
  errorMsg = '';

  // Modal crear usuario
  modalCrearAbierto = false;

  nuevoUsuario: Partial<Usuario> & { password?: string } = {
    nombre: '',
    email: '',
    rol: 'user',
    ciudad: '',
    pais: '',
    descripcion: '',
    github: '',
    linkedin: '',
    celular: ''
  };

  constructor(private gestionUsuarios: GestionUsuarios,
    private cdr:ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.loading = true;
    this.gestionUsuarios.getUsuarios().subscribe({
      next: data => {
        this.usuarios = data.map(u => ({
          ...u,
          editando: false,
          nuevoNombre: u.nombre,
          nuevoRol: u.rol
        }));
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error(err);
        this.errorMsg = 'Error al cargar usuarios';
        this.loading = false;
      }
      
    });
  }

  activarEdicion(u: any) {
    u.editando = true;
    u.nuevoNombre = u.nombre;
    u.nuevoRol = u.rol;
  }

  cancelarEdicion(u: any) {
    u.editando = false;
    u.nuevoNombre = u.nombre;
    u.nuevoRol = u.rol;
  }

  guardarCambios(u: any) {
    this.gestionUsuarios.actualizarParcial(u.id, {
      nombre: u.nuevoNombre,
      rol: u.nuevoRol
    }).subscribe({
      next: () => {
        u.editando = false;
        this.cargarUsuarios();
      },
      error: () => alert('Error al actualizar usuario')
    });
  }

  eliminarUsuario(id: number) {
    if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;

    this.gestionUsuarios.eliminarUsuario(id).subscribe({
      next: () => this.cargarUsuarios(),
      error: () => alert('Error al eliminar usuario')
    });
  }

  abrirCrearUsuario() {
    this.modalCrearAbierto = true;
    this.nuevoUsuario = {
      nombre: '',
      email: '',
      rol: 'user'
    };
  }

  cerrarCrearUsuario() {
    this.modalCrearAbierto = false;
  }

  crearUsuario() {
    if (!this.nuevoUsuario.nombre || !this.nuevoUsuario.email || !this.nuevoUsuario.password) {
      alert('Completa todos los campos obligatorios');
      return;
    }

    this.gestionUsuarios.crearUsuario(this.nuevoUsuario).subscribe({
      next: () => {
        alert('Usuario creado correctamente');
        this.modalCrearAbierto = false;
        this.cargarUsuarios();
      },
      error: err => {
        console.error(err);
        alert('Error al crear usuario');
      }
    });
  }
}
