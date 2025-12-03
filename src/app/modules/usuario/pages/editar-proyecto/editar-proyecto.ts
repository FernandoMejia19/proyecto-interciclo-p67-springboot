import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // <--- 1. IMPORTAR ESTO
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
  idProyecto: string | null = '';
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
      imagen: ['']
    });
  }

  async ngOnInit() {
    this.idProyecto = this.route.snapshot.paramMap.get('id');
    console.log("ID para editar:", this.idProyecto);

    if (this.idProyecto) {
      await this.cargarDatosProyecto(this.idProyecto);
    } else {
      console.log("No hay ID, quitando loading de todas formas.");
      this.loading = false;
      this.cdr.detectChanges(); 
    }
  }

  async cargarDatosProyecto(id: string) {
    try {
      const docRef = doc(this.firestore, 'proyectos', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("Datos recuperados:", data); 

        let tecsString = '';
        if (data['tecnologias'] && Array.isArray(data['tecnologias'])) {
          tecsString = data['tecnologias'].join(', ');
        }

        this.miFormulario.patchValue({
          titulo: data['titulo'],
          descripcion: data['descripcion'],
          imagen: data['imagen'],
          tecnologias: tecsString 
        });
        
      } else {
        console.log("No existe el documento");
        alert("Proyecto no encontrado");
      }

    } catch (error) {
      console.error("Error:", error);
    } finally {

      this.loading = false; 
      console.log("Loading es ahora false. Forzando actualización...");
      
      this.cdr.detectChanges();
    }
  }

  async guardar() {
    if (this.miFormulario.invalid) return;

    const formVal = this.miFormulario.value;
    const tecsArray = formVal.tecnologias 
                      ? formVal.tecnologias.split(',').map((t: string) => t.trim()) 
                      : [];

    const datosActualizados = {
      titulo: formVal.titulo,
      descripcion: formVal.descripcion,
      imagen: formVal.imagen,
      tecnologias: tecsArray
    };

    try {
      if (this.idProyecto) {
        const docRef = doc(this.firestore, 'proyectos', this.idProyecto);
        await updateDoc(docRef, datosActualizados);
        alert('Proyecto actualizado correctamente');
        this.router.navigate(['/perfil']);
      }
    } catch (error) {
      alert("Ocurrió un error al guardar.");
    }
  }
  
  cancelar() {
      this.router.navigate(['/perfil']);
  }
}