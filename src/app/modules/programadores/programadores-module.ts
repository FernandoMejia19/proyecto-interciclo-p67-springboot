import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NavBarAdmin } from '../administrador/pages/nav-bar-admin/nav-bar-admin';
import { PrograProyectos } from './progra-proyectos/progra-proyectos';


export const routes:Routes=[
  
  { path:'', component: NavBarAdmin ,children:[  
    { path:'progra-proyectos',component:PrograProyectos},
    { path: '', redirectTo: 'progra-proyectos', pathMatch: 'full'},
    { path: 'forbidden', redirectTo: 'progra-proyectos', pathMatch: 'full' }
  ]
    }

  ];
  
@NgModule({
  declarations: [
    
  ],
  
  imports: [
    CommonModule,
    RouterModule.forChild(routes),NavBarAdmin,PrograProyectos
  ],
  exports: [
    RouterModule 
  ]
})
export class ProgramadoresModule { }
