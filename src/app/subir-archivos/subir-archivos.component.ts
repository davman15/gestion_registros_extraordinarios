import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-subir-archivos',
  templateUrl: './subir-archivos.component.html',
  styleUrls: ['./subir-archivos.component.css']
})
export class SubirArchivosComponent {
  formGroup1!: FormGroup;
  archivosArray: File[] = []
  nombreUsuario!: string;
  constructor(private db: AngularFirestore, private formBuilder1: FormBuilder, private dbStorage: AngularFireStorage) { }

  ngOnInit(): void {
    this.formGroup1 = this.formBuilder1.group({
      archivosSubidos: [[]]
    })
  }

  aniadirArchivo(event: Event) {
    const seleccionador = event.target as HTMLInputElement;
    //Si hay archivos seleccionados
    if (seleccionador.files) {
      //Se recorren todos los archivos que puso el usuario y los añade a mi array que luego lo usare
      for (let i = 0; i < seleccionador.files.length; i++) {
        this.archivosArray.push(seleccionador.files[i]);
      }
    }
    seleccionador.value = '';
  }

  eliminarArchivo(index: number) {
    this.archivosArray.splice(index, 1);
  }

  subirArchivos() {
    const fecha = new Date();
    const mes = fecha.getMonth() + 1;
    const anio = fecha.getFullYear();

    const archivos: FileList | null = this.formGroup1.get('archivosSubidos')!.value;

    if (archivos && archivos.length > 0) {
      //En mi localStorge hay un Json enorme con muchos datos entre ellos saco el nombre del usuario actual
      this.nombreUsuario = JSON.parse(localStorage.getItem('user') ?? "").displayName;
      this.archivosArray.forEach((archivo: File) => {
        const ficheroPath = `usuarios/${this.nombreUsuario}/${mes}-${anio}/${archivo.name}`;
        //Aqui se sube
        this.dbStorage.upload(ficheroPath, archivo);
        // Maneja el progreso y los estados de carga si es necesario
        /*tarea.snapshotChanges().subscribe((snapshot) => {
          
        });*/
      });
    }
    //Se vacia el array de Ficheros y se muestra una alerta la usuario
    this.archivosArray = [];
    Swal.fire('Subida Completada', 'Los archivos se subieron correctamente', 'success');
  }

  public get f() {
    return this.formGroup1.controls;
  }
}
