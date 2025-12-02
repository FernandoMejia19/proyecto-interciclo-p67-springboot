import { ChangeDetectorRef, Component } from '@angular/core';
import { AdminProyectos } from "../../../administrador/pages/admin-proyectos/admin-proyectos";
import { collectionData, Firestore } from '@angular/fire/firestore';
import { combineLatest, Observable } from 'rxjs';
import { collection } from 'firebase/firestore';
import { GestionProyectos } from '../../../../services/gestion-proyectos';
import { GestionUsuarios } from '../../../../services/gestion-usuarios';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-proyectos',
  imports: [ CommonModule],
  templateUrl: './proyectos.html',
  styleUrl: './proyectos.scss',
})
export class Proyectos {
  proyectos: any[] = [];  // Aquí se guardarán los proyectos
  usuarios: any[]=[]
  constructor(private proyectosService: GestionProyectos,
    private usuariosService:GestionUsuarios,
    private cdr: ChangeDetectorRef

  ) {}

  ngOnInit(): void {
  combineLatest([
    this.proyectosService.getProyectos(),
    this.usuariosService.getUsuarios()
  ]).subscribe(([proyectos, usuarios]) => {

    this.proyectos = proyectos.map(p => {
      const usuarioEncontrado = usuarios.find(u => u.id === p.creador);
      
      return {
        ...p,

        usuarioNombre: usuarioEncontrado ? usuarioEncontrado.nombre : 'Desconocido'
      };
    });
    this.cdr.detectChanges(); 
  });
}
}
