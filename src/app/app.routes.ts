import { AuthGuard } from '@angular/fire/auth-guard';
import { Routes } from '@angular/router';
import { RoleGuard } from './core/guards/role-guard';

export const routes: Routes = [
    {path:'',loadChildren:()=> import('./modules/usuario/usuario-module').then(m=>m.UsuarioModule)},
    {
    path: 'administrador',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'admin' },
    loadChildren: () =>
    import('./modules/administrador/administrador-module')
    .then(m => m.AdministradorModule)
},
{
    path: 'programadores',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'dev' },
    loadChildren: () =>
    import('./modules/programadores/programadores-module')
    .then(m => m.ProgramadoresModule)
},
{ path: 'login', loadComponent: () => import('./modules/usuario/pages/inicio-sesion/inicio-sesion').then(c => c.InicioSesion) }



];

