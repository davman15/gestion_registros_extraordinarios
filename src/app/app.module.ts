import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EstadisticasComponent } from './componentes/estadisticas/estadisticas.component';
import { ChartModule } from 'angular-highcharts';
import { SacardatosService } from './servicios/sacardatos.service';
import { InformesComponent } from './componentes/informes/informes.component';
import { SubirArchivosComponent } from './subir-archivos/subir-archivos.component';
import { BarraNavegacionAdminComponent } from './barra-navegacion-admin/barra-navegacion-admin.component';

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
    ErrorComponent,
    EstadisticasComponent,
    InformesComponent,
    SubirArchivosComponent,
    BarraNavegacionAdminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    FormsModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    FullCalendarModule,
    DataTablesModule,
    BrowserAnimationsModule,
    ChartModule
  ],
  providers: [AuthService, NgxSpinnerService, SacardatosService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
