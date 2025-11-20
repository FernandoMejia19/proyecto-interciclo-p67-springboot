import { Routes } from '@angular/router';
import { Portafolios } from './pages/portafolios/portafolios';
import { Proyectos } from './pages/proyectos/proyectos';
import { Desarrolladores } from './pages/desarrolladores/desarrolladores';
import { InicioSesion } from './pages/inicio-sesion/inicio-sesion';

export const routes: Routes = [
    {path:'',redirectTo:'portafolios',pathMatch:'full'},
    {path:'portafolios',component:Portafolios},
    {path:'proyectos',component:Proyectos},
    {path:'desarrolladores',component:Desarrolladores},
    {path:'inicio-sesion',component:InicioSesion}
];

