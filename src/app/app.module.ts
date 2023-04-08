import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './servicios/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RecuperarContrasenaComponent } from './componentes/recuperar-contrasena/recuperar-contrasena.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { BarraNavegacionComponent } from './componentes/barra-navegacion/barra-navegacion.component';
import { InformacionComponent } from './componentes/informacion/informacion.component';
import { BautismosComponent } from './componentes/bautismos/bautismos.component';
import { DataTablesModule } from "angular-datatables";
import { TotalResultadosComponent } from './componentes/total-resultados/total-resultados.component';
import { ErrorComponent } from './componentes/error/error.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistroComponent,
    InicioComponent,
    RecuperarContrasenaComponent,
    BarraNavegacionComponent,
    InformacionComponent,
    BautismosComponent,
    TotalResultadosComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    FormsModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    FullCalendarModule,
    DataTablesModule
  ],
  providers: [AuthService, NgxSpinnerService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
