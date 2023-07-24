import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { RecuperarContrasenaComponent } from './componentes/recuperar-contrasena/recuperar-contrasena.component';
import { InformacionComponent } from './componentes/informacion/informacion.component';
import { BautismosComponent } from './componentes/bautismos/bautismos.component';
import { map } from 'rxjs/operators';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';
import { ErrorComponent } from './componentes/error/error.component';
import { EstadisticasComponent } from './componentes/estadisticas/estadisticas.component';
import { InformesComponent } from './componentes/informes/informes.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo('error');
const uidAdmin = '';
const soloAdmin = () => map((usuario: any) => !!usuario && usuario.uid === uidAdmin);

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'inicio', component: InicioComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  { path: 'recuperar-contrasena', component: RecuperarContrasenaComponent },
  { path: 'informacion', component: InformacionComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  { path: 'bautismos', component: BautismosComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  { path: 'estadisticas', component: EstadisticasComponent },
  { path: 'informes', component: InformesComponent },
  { path: 'error', component: ErrorComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'error', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
