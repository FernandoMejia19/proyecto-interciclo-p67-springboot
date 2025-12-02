import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GestionUsuarios } from '../../../../services/gestion-usuarios';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-desarrolladores',
  imports: [CommonModule],
  templateUrl: './admin-desarrolladores.html',
  styleUrl: './admin-desarrolladores.scss',
})
export class AdminDesarrolladores implements OnInit {
  desarrolladores:any[]=[]
  constructor(private router:Router,
    private usuariosService:GestionUsuarios,
    private cdr: ChangeDetectorRef
  ){}
  ngOnInit(): void {
    this.usuariosService.getUsuarios().subscribe(usuarios=>{
      this.desarrolladores=usuarios
      this.cdr.detectChanges();
    });
  }
  abrirPerfil(){
    this.router.navigate(['/perfilUsuario']);
  }
}
