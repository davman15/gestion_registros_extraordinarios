import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
declare var $: any;

@Component({
  selector: 'app-barra-navegacion',
  templateUrl: './barra-navegacion.component.html',
  styleUrls: ['./barra-navegacion.component.css']
})
export class BarraNavegacionComponent {

  constructor(private servicio: AuthService) { }
  ngOnInit(): void {

  }

  cerrarSesion() {
    this.servicio.cerrarSesion();
  }
}
