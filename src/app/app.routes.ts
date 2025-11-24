import { Routes } from '@angular/router';

export const routes: Routes = [
    {path:'',loadChildren:()=> import('./modules/usuario/usuario-module').then(m=>m.UsuarioModule)},
    {path:'administrador',loadChildren:()=>import('./modules/administrador/administrador-module').then(m=>m.AdministradorModule)}
    
];

