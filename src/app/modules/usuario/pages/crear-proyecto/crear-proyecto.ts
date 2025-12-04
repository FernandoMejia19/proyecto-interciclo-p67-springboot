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
    private authService: AuthService
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
    this.authService.currentUser$.subscribe(user => {
      if (user) this.uidUsuario = user.uid;
    });
  }

  async guardar() {
    if (this.miFormulario.invalid) return;
    if (!this.uidUsuario) {
      alert('Error: No se identificó al usuario. Intenta recargar.');
      return;
    }

    this.guardando = true;
    const formVal = this.miFormulario.value;
    const tecsArray = formVal.tecnologias 
                      ? formVal.tecnologias.split(',').map((t: string) => t.trim()) 
                      : [];

    const nuevoProyecto = {
      creador: this.uidUsuario, 
      titulo: formVal.titulo,
      descripcion: formVal.descripcion,
      imagen: formVal.imagen || 'https://www.educaciontrespuntocero.com/wp-content/uploads/2016/12/ideas-sobre-proyectos-de-programacion-para.jpg',
      tecnologias: tecsArray,
      linkCodigo: formVal.linkCodigo || '' 
    };

    try {
      const colRef = collection(this.firestore, 'proyectos');
      await addDoc(colRef, nuevoProyecto);
      
      alert('¡Proyecto creado con éxito!');
      this.router.navigate(['/perfil']); 
    } catch (error) {
      console.error(error);
      alert("Error al guardar.");
    } finally {
      this.guardando = false;
    }
  }

  cancelar() {
    this.router.navigate(['/perfil']);
  }
}