import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/compat/firestore";
import { Router } from '@angular/router';
import { IUsuario } from '../models/IUsuario';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  usuarioData: any;
  constructor(private firestore: AngularFirestore, private auth: AngularFireAuth, private router: Router) {
    this.auth.authState.subscribe(usuario => {
      if (usuario) {
        this.usuarioData = usuario;
        localStorage.setItem('user', JSON.stringify(this.usuarioData));
        JSON.parse(localStorage.getItem('user')!)
      }
      else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!)
      }
    })
  }

  agregarUsuarioFirestore(usuario: any) {
    const userReferencia: AngularFirestoreDocument<any> = this.firestore.doc('usuarios/' + usuario.uid);
    const userData: IUsuario = {
      uid: usuario.uid,
      email: usuario.email,
      displayName: usuario.displayName,
      photoURL: usuario.photoURL,
      emailVerified: usuario.emailVerified
    }

    return userReferencia.set(userData, {
      merge: true
    });
  }

  async iniciarSesion(email: string, contraseña: string) {
    try {
      let resultado = await this.auth.signInWithEmailAndPassword(email, contraseña);
      if (!resultado.user?.emailVerified) {
        Swal.fire('Revise su email', 'Valide su email electrónico', 'success');
      }
      else {
        this.agregarUsuarioFirestore(resultado.user);
        this.auth.authState.subscribe(usuario_1 => {
          if (usuario_1) {
            this.router.navigate(['inicio']);
          }
        });
      }

    } catch (error) {
      this.validacionesEspañol(error);
    }
  }

  async registrarse(email: string, contraseña: string, nombreCompleto: string) {
    try {
      const resultado = await this.auth.createUserWithEmailAndPassword(email, contraseña);
      resultado.user?.sendEmailVerification().then(valor => {
        Swal.fire('Revise su email', 'Valide su email electrónico', 'success');
      });
      await resultado.user?.updateProfile({
        displayName: nombreCompleto
      });

      this.agregarUsuarioFirestore(resultado.user);
      this.router.navigate(['login']);
    } catch (error) {
      this.validacionesEspañol(error);
    }
  }

  recuperarContrasena(email: string) {
    this.auth.sendPasswordResetEmail(email).then(valor => {
      Swal.fire('Revise su email', 'Se le envio un enlace a su email para restablecer su contraseña', 'success');
      this.router.navigate(['/login']);
    }).catch(error => {
      this.validacionesEspañol(error)
    });
  }

  cerrarSesion() {
    this.auth.signOut().then(() => {
      this.router.navigate(['/login']);
    })
  }

  private validacionesEspañol(error: any) {
    switch (error.code) {
      case 'auth/invalid-email':
        Swal.fire('Error', 'El correo introducido tiene un formato incorrecto', 'error');
        break;
      case 'auth/email-already-in-use':
        Swal.fire('Error', 'El correo introducido ya está en uso', 'error');
        break;
      case 'auth/weak-password':
        Swal.fire('Error', 'La contraseña introducida es muy corta', 'error');
        break;
      case 'invalid-argument':
        console.error(error.message);
        break;
      case 'auth/wrong-password':
        Swal.fire('Error', 'Las credenciales introducidas son incorrectas', 'error');
        break;
      case 'auth/user-not-found':
        Swal.fire('Error', 'Las credenciales introducidas son incorrectas', 'error');
        break;
      default:
        Swal.fire('Error', error.code, 'error');
        break;
    }
  }
}
