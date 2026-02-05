import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router'; // ← ¡AGREGA ESTO!
import { GestionProyectos } from '../../../../services/gestion-proyectos';
import { GestionUsuarios } from '../../../../services/gestion-usuarios';
import { CommonModule } from '@angular/common';
import { combineLatest } from 'rxjs';
import { Proyecto, Tecnologia } from '../../../../../models/entitys';

@Component({
  selector: 'app-proyectos',
  imports: [CommonModule],
  templateUrl: './proyectos.html',
  styleUrl: './proyectos.scss',
})
export class Proyectos {
  proyectos:Proyecto[]=[]
  tecnologias:Tecnologia[]=[]
  constructor (private gp:GestionProyectos,
    private cdr:ChangeDetectorRef,
    private router:Router
  ){}
  ngOnInit(): void {
    this.gp.obtenerTodos().subscribe({next:(resp)=>{
      console.log("DATOS ",resp);
      this.proyectos=resp;
      this.cdr.detectChanges();
    }});
  }
  verDetalleProyecto(id:number){
    console.log('Id de proyecto ',id)
    this.router.navigate(['/proyecto', id]);

  }
  onImgError(event: any) {
    event.target.src = 'assets/default-project.jpg';
  }
}