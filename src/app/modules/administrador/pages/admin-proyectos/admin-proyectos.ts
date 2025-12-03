import { ChangeDetectorRef, Component } from '@angular/core';
import { combineLatest } from 'rxjs';
import { GestionProyectos } from '../../../../services/gestion-proyectos';
import { GestionUsuarios } from '../../../../services/gestion-usuarios';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-admin-proyectos',
  imports: [CommonModule],
  templateUrl: './admin-proyectos.html',
  styleUrl: './admin-proyectos.scss',
})
export class AdminProyectos {
  proyectos: any[] = [];
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
  saludar(){
    console.log('Hola dvi')
  }
}
