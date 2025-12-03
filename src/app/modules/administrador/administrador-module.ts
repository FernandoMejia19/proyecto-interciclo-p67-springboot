
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavBarAdmin } from './pages/nav-bar-admin/nav-bar-admin';
import { AdminDesarrolladores } from './pages/admin-desarrolladores/admin-desarrolladores';
import { PerfilUsuario } from '../usuario/pages/perfil-usuario/perfil-usuario';

export const routes:Routes=[
  
  { path:'', component: NavBarAdmin ,children:[  
    { path:'perfilUsuario',component:PerfilUsuario},
    { path: '', redirectTo: 'perfilUsuario', pathMatch: 'full'}
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
