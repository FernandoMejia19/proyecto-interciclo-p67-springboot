import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-editar-proyecto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-proyecto.html',
  styleUrls: ['./editar-proyecto.scss']
})
export class EditarProyecto implements OnInit {

  miFormulario: FormGroup;
  idProyecto: string | null = null;
  loading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private firestore: Firestore,
    private cdr: ChangeDetectorRef
  ) {
    this.miFormulario = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      tecnologias: [''],
      imagen: [''],
      linkCodigo: ['']
    });
  }

  async ngOnInit() {
    this.idProyecto = this.route.snapshot.paramMap.get('id');

    if (this.idProyecto) {
      await this.cargarDatosProyecto(this.idProyecto);
    }

    this.loading = false;
    this.cdr.detectChanges();
  }

  async cargarDatosProyecto(id: string) {
    try {
      const docRef = doc(this.firestore, 'proyectos', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        this.miFormulario.patchValue({
          titulo: data['titulo'],
          descripcion: data['descripcion'],
          imagen: data['imagen'],
          tecnologias: data['tecnologias']?.join(', ') || '',
          linkCodigo: data['linkCodigo'] || ''
        });
      } else {
        alert("Proyecto no encontrado");
      }

    } catch (error) {
      console.error(error);
    }
  }

  async guardar() {
    if (this.miFormulario.invalid || !this.idProyecto) return;

    const formVal = this.miFormulario.value;
    const tecsArray = formVal.tecnologias
      ? formVal.tecnologias.split(',').map((x: string) => x.trim())
      : [];

    const datosActualizados = {
      titulo: formVal.titulo,
      descripcion: formVal.descripcion,
      imagen: formVal.imagen || '',
      tecnologias: tecsArray,
      linkCodigo: formVal.linkCodigo || ''
    };

    try {
      const docRef = doc(this.firestore, 'proyectos', this.idProyecto);
      await updateDoc(docRef, datosActualizados);

      // 🔥 ENVIAR MENSAJE A PERFIL-USUARIO
      this.router.navigate(['/perfil'], {
        state: {
          toast: {
            mensaje: 'Proyecto editado correctamente',
            tipo: 'success'
          }
        }
      });

    } catch (error) {
      this.router.navigate(['/perfil'], {
        state: {
          toast: {
            mensaje: 'Error al guardar los cambios',
            tipo: 'error'
          }
        }
      });
    }
  }

  cancelar() {
    this.router.navigate(['/perfil']);
  }
}
