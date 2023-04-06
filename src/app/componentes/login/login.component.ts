import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/servicios/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private fb: FormBuilder, private servicio: AuthService, private spinner: NgxSpinnerService) {
  }

  formGroup!: FormGroup;

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}')]],
      contraseña: ['', [Validators.required,
      Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$'),
      Validators.minLength(8),
      Validators.maxLength(20)]]
    })
  }

  validar_Iniciar() {
    let usuario: any = Object.assign({}, this.formGroup.value);
    //Primero aqui en el cliente aplicar validaciones
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    this.spinner.show();

    this.servicio.iniciarSesion(usuario.email, usuario.contraseña).then(() => {
      this.spinner.hide();
    })
  }

  public get f() {
    return this.formGroup.controls;
  }
}
