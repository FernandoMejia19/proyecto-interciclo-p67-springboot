import { Routes } from '@angular/router';

export const routes: Routes = [
    {path:'',loadChildren:()=> import('./modules/usuario/usuario-module').then(m=>m.UsuarioModule)},
    {path:'administrador',loadChildren:()=>import('./modules/administrador/administrador-module').then(m=>m.AdministradorModule)},
    {path:'programadores',loadChildren:()=>import('./modules/programadores/programadores-module').then(m=>m.ProgramadoresModule)}
];

