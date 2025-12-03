import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { GestionUsuarios } from '../../../services/gestion-usuarios';
import { GestionProyectos } from '../../../services/gestion-proyectos';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-progra-proyectos',
  imports: [CommonModule],
  templateUrl: './progra-proyectos.html',
  styleUrl: './progra-proyectos.scss',
})
export class PrograProyectos {
  desarrolladores:any[]=[]
  constructor(private router:Router,
    private proyectosService:GestionProyectos,
    private cdr: ChangeDetectorRef
  ){}
  ngOnInit(): void {
    this.proyectosService.getProyectosByUser('9XpJg5IvlmSCpu6XoO3E6H0kI5s1').subscribe(usuarios=>{
      this.desarrolladores=usuarios
      this.cdr.detectChanges();
    });
  }

}
