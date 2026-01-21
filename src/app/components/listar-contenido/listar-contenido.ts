// proyectos.component.ts
import { Component, OnInit } from '@angular/core';
import { GestionProyectos } from '../../services/gestion-proyectos';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { GestionUsuarios } from '../../services/gestion-usuarios';
import { combineLatest } from 'rxjs';
import { Usuario } from '../../../models/entitys';

@Component({
  selector: 'app-listar-contenido',
  imports: [CommonModule],
  templateUrl: './listar-contenido.html',
  styleUrl: './listar-contenido.scss',
})
export class ListarContenido implements OnInit {

  proyectos: any[] = []; 
  usuarios: Usuario[]=[]
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

