import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUsuarioRegistro } from 'src/app/models/IUsuarioRegistro';
import { AuthService } from 'src/app/servicios/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {

  constructor(private fb: FormBuilder, private servicio: AuthService, private spinner: NgxSpinnerService) {
  }

  formGroup!: FormGroup;

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      nombreCompleto: ['', [Validators.required, Validators.pattern('^[A-Za-z ]+$')]],
      email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}')]],
      contraseña: ['', [Validators.required, Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$'),
      Validators.minLength(8),
      Validators.maxLength(20)]]
    })
  }

  registrar() {
    let usuario: IUsuarioRegistro = Object.assign({}, this.formGroup.value);
    //Primero aqui en el cliente aplicar validaciones
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    this.spinner.show();

    //Luego llamar a mi metodo registrar que lo registra en firebase pero si da algun error lo capturo
    this.servicio.registrarse(usuario.email, usuario.contraseña, usuario.nombreCompleto).then(() => {
      this.spinner.hide();
    });
  }

  public get f() {
    return this.formGroup.controls;
  }
}
