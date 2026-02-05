import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AdminDesarrolladores } from "../../../administrador/pages/admin-desarrolladores/admin-desarrolladores";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GestionUsuarios } from '../../../../services/gestion-usuarios';
import { CommonModule } from '@angular/common';
import { HoraAsesoria, Proyecto, Tecnologia, Usuario } from '../../../../../models/entitys';
import { GestionProyectos } from '../../../../services/gestion-proyectos';
import { GestionHoras } from '../../../../services/gestion-horas';
import { GestionTecnologias } from '../../../../services/gestion-tecnologias';

@Component({
  selector: 'app-desarrolladores',
  imports: [AdminDesarrolladores,CommonModule],
  templateUrl: './desarrolladores.html',
  styleUrl: './desarrolladores.scss',
})
export class Desarrolladores implements OnInit{
  usuarios:Usuario[]=[]
  proyectos:Proyecto[]=[]
  horas:HoraAsesoria[]=[]
  tecnologias:Tecnologia[]=[]
  
  constructor (private gu:GestionUsuarios,
    private gp:GestionProyectos,
    private gh:GestionHoras,
    private gt:GestionTecnologias,
    private cdr:ChangeDetectorRef
  ){}
  ngOnInit(): void {
    this.gu.getUsuarios().subscribe({next:(resp)=>{
      console.log("DATOS ",resp);
      this.usuarios=resp;
      this.cdr.detectChanges();
    }})
    this.gt.getTecnologias().subscribe({next:(resp)=>{
      console.log("Tecnologias ",resp);
      this.tecnologias=resp;
      this.cdr.detectChanges();
    }})
  }
}
