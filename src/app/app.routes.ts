import { AuthGuard } from '@angular/fire/auth-guard';
import { Routes } from '@angular/router';
import { RoleGuard } from './core/guards/role-guard';
import { EditarProyecto } from './modules/usuario/pages/editar-proyecto/editar-proyecto';

export const routes: Routes = [

    {
        path: 'perfil',
        loadComponent: () => import('./modules/usuario/pages/perfil-usuario/perfil-usuario').then(m => m.PerfilUsuario),
        canActivate: [AuthGuard]
    },
    { 
        path: 'editar-proyecto/:id', 
        loadComponent: () => import('./modules/usuario/pages/editar-proyecto/editar-proyecto').then(m => m.EditarProyecto),
        canActivate: [AuthGuard] 
    },
    { 
        path: 'login',  
        loadComponent: () => import('./modules/usuario/pages/inicio-sesion/inicio-sesion').then(c => c.InicioSesion) 
    },
    {
        path: 'administrador',
        canActivate: [AuthGuard, RoleGuard],
        data: { role: 'admin' },
        loadChildren: () => import('./modules/administrador/administrador-module').then(m => m.AdministradorModule)
    },
    {
        path: 'programadores',
        canActivate: [AuthGuard, RoleGuard],
        data: { role: 'dev' },
        loadChildren: () => import('./modules/programadores/programadores-module').then(m => m.ProgramadoresModule)
    },
    {
        path: 'forbidden',
        redirectTo: '', 
        pathMatch: 'full'
    },
    {
    path: 'ver-programador/:id',
    loadComponent: () => import('../app/modules/usuario/pages/perfil-publico/perfil-publico').then(m => m.PerfilPublico),
    canActivate: [AuthGuard]
    },
    {
    path: 'proyecto/:id',
    loadComponent: () => import('./modules/usuario/pages/detalle-proyecto/detalle-proyecto').then(m => m.DetalleProyectoComponent)
    },
    { 
        path: 'crear-proyecto', 
        loadComponent: () => import('./modules/usuario/pages/crear-proyecto/crear-proyecto').then(m => m. CrearProyectoComponent),
        canActivate: [AuthGuard] 
    },
    {
    path: 'editar-perfil',
    loadComponent: () => import('./modules/usuario/pages/editar-perfil/editar-perfil')
    .then(m => m.EditarPerfilComponent)
    },
    { 
        path: '', 
        loadChildren: () => import('./modules/usuario/usuario-module').then(m => m.UsuarioModule) 
    }
];