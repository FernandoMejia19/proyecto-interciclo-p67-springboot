import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GestionProyectos } from '../../../../services/gestion-proyectos';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-proyecto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-proyecto.html',
  styleUrls: ['./editar-proyecto.scss']
})
export class EditarProyecto implements OnInit {

  miFormulario: FormGroup;
  idProyecto!: number;
  loading = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private gestionProyectos: GestionProyectos,
    private cdr:ChangeDetectorRef
  ) {
    this.miFormulario = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      tecnologias: [''],
      imagen: [''],
      linkRepo: ['']
    });
  }

  ngOnInit() {
    this.idProyecto = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.idProyecto) {
      Swal.fire('Error', 'Proyecto no válido', 'error');
      this.router.navigate(['/perfilUsuario']);
      return;
    }

    this.cargarProyecto();
    this.cdr.detectChanges();
  }

  cargarProyecto() {
    this.gestionProyectos.getProyecto(this.idProyecto).subscribe({
      next: (proyecto) => {
        this.miFormulario.patchValue({
          titulo: proyecto.titulo,
          descripcion: proyecto.descripcion,
          tecnologias: '',
          imagen: proyecto.imagen || '',
          linkRepo: proyecto.linkRepo || ''
        });
        this.loading = false;
      },
      error: () => {
        Swal.fire('Error', 'Proyecto no encontrado', 'error');
        this.router.navigate(['/perfilUsuario']);
      }
    });
  }

  guardar() {
    if (this.miFormulario.invalid) return;

    const formVal = this.miFormulario.value;

    const datosActualizados = {
      titulo: formVal.titulo.trim(),
      descripcion: formVal.descripcion.trim(),
      tecnologias: formVal.tecnologias,
      imagen: formVal.imagen,
      linkRepo: formVal.linkRepo
    };

    this.gestionProyectos.actualizarProyecto(this.idProyecto, datosActualizados).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Proyecto actualizado',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/perfilUsuario']);
        });
      },
      error: () => {
        Swal.fire('Error', 'No se pudo actualizar el proyecto', 'error');
      }
    });
  }

  cancelar() {
    this.router.navigate(['/perfilUsuario']);
  }
}
