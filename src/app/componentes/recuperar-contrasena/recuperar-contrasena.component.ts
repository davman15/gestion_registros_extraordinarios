import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/servicios/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.component.html',
  styleUrls: ['./recuperar-contrasena.component.css']
})
export class RecuperarContrasenaComponent {
  constructor(private fb: FormBuilder, private servicio: AuthService, private spinner: NgxSpinnerService) {
  }

  formGroup!: FormGroup;

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}')]]
    })
  }

  recuperarContrasena() {
    let email: any = Object.assign({}, this.formGroup.value);
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    this.servicio.recuperarContrasena(email.email);
  }

  public get f() {
    return this.formGroup.controls;
  }
}
