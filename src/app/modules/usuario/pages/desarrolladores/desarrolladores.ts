import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AdminDesarrolladores } from "../../../administrador/pages/admin-desarrolladores/admin-desarrolladores";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GestionUsuarios } from '../../../../services/gestion-usuarios';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-desarrolladores',
  imports: [AdminDesarrolladores,CommonModule],
  templateUrl: './desarrolladores.html',
  styleUrl: './desarrolladores.scss',
})
export class Desarrolladores implements OnInit{
  usuarios:any[]=[]
  constructor (private gu:GestionUsuarios,
    private cdr:ChangeDetectorRef
  ){}
  ngOnInit(): void {
    this.gu.getUsuarios().subscribe({next:(resp:any)=>{
      console.log("DATOS ",resp);
      this.usuarios=resp;
      this.cdr.detectChanges();
    }})
  }
}
