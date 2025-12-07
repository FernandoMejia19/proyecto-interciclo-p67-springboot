import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-crear-proyecto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-proyecto.html',
  styleUrls: ['./crear-proyecto.scss']
})
export class CrearProyectoComponent implements OnInit {

  miFormulario: FormGroup;
  uidUsuario: string = '';
  guardando = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private firestore: Firestore,
    private authService: AuthService,
  ) {
    this.miFormulario = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      tecnologias: [''],
      imagen: [''],
      linkCodigo: ['']
    });
  }

  ngOnInit() {
    console.log('CrearProyecto - ngOnInit subscribe currentUser$');
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.uidUsuario = user.uid;
        console.log('CrearProyecto - uidUsuario set:', this.uidUsuario);
      } else {
        console.log('CrearProyecto - no user in currentUser$');
      }
    });
  }

  cancelar() {
    console.log('CrearProyecto - cancelar() -> navegar a /perfil');
    this.router.navigate(['/perfil']);
  }

  async guardar() {
    if (this.miFormulario.invalid) {
      console.warn('CrearProyecto - formulario inválido');
      return;
    }
    if (!this.uidUsuario) {
      this.router.navigate(['/perfil'], {
        state: { toast: { mensaje: 'No se identificó al usuario', tipo: 'error' } }
      });
      return;
    }

    this.guardando = true;

    const formVal = this.miFormulario.value;

    const nuevoProyecto = {
      creador: this.uidUsuario,
      titulo: formVal.titulo,
      descripcion: formVal.descripcion,
      imagen: formVal.imagen || 'https://www.educaciontrespuntocero.com/wp-content/uploads/2016/12/ideas-sobre-proyectos-de-programacion-para.jpg',
      tecnologias: formVal.tecnologias ? formVal.tecnologias.split(',').map((t: string) => t.trim()) : [],
      linkCodigo: formVal.linkCodigo || ''
    };

    try {
      console.log('CrearProyecto - intentando addDoc', nuevoProyecto);
      const colRef = collection(this.firestore, 'proyectos');
      await addDoc(colRef, nuevoProyecto);
      console.log('CrearProyecto - addDoc OK');

      this.router.navigate(['/perfil'], {
        state: { toast: { mensaje: 'Proyecto creado correctamente', tipo: 'success' } }
      });

    } catch (error) {
      console.error('CrearProyecto - error al guardar', error);
      this.router.navigate(['/perfil'], {
        state: { toast: { mensaje: 'Error al crear el proyecto', tipo: 'error' } }
      });
    } finally {
      this.guardando = false;
    }
  }
}
