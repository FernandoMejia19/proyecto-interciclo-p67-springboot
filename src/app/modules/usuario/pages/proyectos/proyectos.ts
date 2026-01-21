import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router'; // ← ¡AGREGA ESTO!
import { GestionProyectos } from '../../../../services/gestion-proyectos';
import { GestionUsuarios } from '../../../../services/gestion-usuarios';
import { CommonModule } from '@angular/common';
import { combineLatest } from 'rxjs';
import { Proyecto } from '../../../../../models/entitys';

@Component({
  selector: 'app-proyectos',
  imports: [CommonModule],
  templateUrl: './proyectos.html',
  styleUrl: './proyectos.scss',
})
export class Proyectos {
  proyectos:Proyecto[]=[]
  constructor (private gp:GestionProyectos,
    private cdr:ChangeDetectorRef
  ){}
  ngOnInit(): void {
    this.gp.getProyectos().subscribe({next:(resp)=>{
      console.log("DATOS ",resp);
      this.proyectos=resp;
      this.cdr.detectChanges();
    }})
  }
}