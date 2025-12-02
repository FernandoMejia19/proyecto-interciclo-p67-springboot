
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { Proyectos } from './pages/proyectos/proyectos';
import { Portafolios } from './pages/portafolios/portafolios';
import { Desarrolladores } from './pages/desarrolladores/desarrolladores';
import { InicioSesion } from './pages/inicio-sesion/inicio-sesion';
import { PerfilUsuario } from './pages/perfil-usuario/perfil-usuario';

export const routes:Routes=[
  
  { path: 'proyectos', component: Proyectos },
  { path: 'portafolios', component: Portafolios },
  { path: 'desarrolladores', component: Desarrolladores },
  { path: 'inicio-sesion', component: InicioSesion },
  { path: 'perfilUsuario', component: PerfilUsuario},
  { path: '', redirectTo: 'proyectos', pathMatch: 'full' }
    ];
  
@NgModule({
  declarations: [
    
  ],
  
  imports: [
    CommonModule,
    RouterModule.forChild(routes),Proyectos,Portafolios,Desarrolladores,InicioSesion 
  ],
  exports: [
    RouterModule 
  ]
})
export class UsuarioModule { }
