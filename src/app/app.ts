import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { Footer } from "./components/footer/footer";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, CommonModule, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App {
  titulo="Proyecto Interciclo";
  mostrarNavBar: boolean =true;
  mostrarHeader:boolean=true;
  constructor (private router:Router){
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd)=>{
        if (event.url.includes('/inicio-sesion') || event.url.includes('/administrador')) {
        this.mostrarNavBar = false;
      } else {
        this.mostrarNavBar = true;
      }
      });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd)=>{
        if (event.url.includes('/portafolios') 
          ||event.url.includes('/proyectos') 
        || event.url.includes('/desarrolladores')) {
        this.mostrarHeader = true;
      } else {
        this.mostrarHeader = false;
      }
      });
    }
}

