import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GestionUsuarios } from '../../../../services/gestion-usuarios';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../../../models/entitys';

@Component({
  selector: 'app-admin-desarrolladores',
  imports: [CommonModule],
  templateUrl: './admin-desarrolladores.html',
  styleUrl: './admin-desarrolladores.scss',
})
export class AdminDesarrolladores implements OnInit {
  
  desarrolladores: Usuario[] = [];
  
  constructor(
    private router: Router,
    private gu: GestionUsuarios,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.gu.getUsuarios().subscribe(usuarios => {
    const lista = Array.isArray(usuarios) ? usuarios : [];
    this.desarrolladores = lista.filter(user => 
      user.rol === 'dev' || 
      user.rol === 'dev' || 
      user.rol === 'admin'
    );

    console.log('Desarrolladores finales:', this.desarrolladores); 
    this.cdr.detectChanges();
  });
  }

  abrirPerfil(id: number) {
    console.log('click xd',id) 
    this.router.navigate(['/ver-programador', id]);
    
    /*if (id) {
      this.router.navigate(['/ver-programador', id]);
    } else {
      console.error("Error: El usuario no tiene ID");
  }*/
  }
}