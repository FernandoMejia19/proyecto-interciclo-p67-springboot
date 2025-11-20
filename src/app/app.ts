import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,Navbar,CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  titulo="Proyecto Interciclo";
  mostrarNavBar: boolean =true;
  constructor (private router:Router){
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd)=>{
        if (event.url.includes('/inicio-sesion') || event.url.includes('/register')) {
        this.mostrarNavBar = false;
      } else {
        this.mostrarNavBar = true;
      }
      });
  }
}
