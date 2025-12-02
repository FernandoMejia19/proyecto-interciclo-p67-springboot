
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavBarAdmin } from './pages/nav-bar-admin/nav-bar-admin';
import { AdminDesarrolladores } from './pages/admin-desarrolladores/admin-desarrolladores';
import { AdminProyectos } from './pages/admin-proyectos/admin-proyectos';

export const routes:Routes=[
  
  { path:'', component: NavBarAdmin ,children:[  
    { path:'admin-desarrolladores',component:AdminDesarrolladores},
    { path:'admin-proyectos',component:AdminProyectos},
    { path: '', redirectTo: 'admin-proyectos', pathMatch: 'full'}
  ]
    }

  ];
  
@NgModule({
  declarations: [
    
  ],
  
  imports: [
    CommonModule,
    RouterModule.forChild(routes),NavBarAdmin,AdminDesarrolladores
  ],
  exports: [
    RouterModule 
  ]
})
export class AdministradorModule { }
