import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { routes } from 'src/app/shared/routes/routes';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-add-doctor',
  templateUrl: './add-doctor.component.html',
  styleUrls: ['./add-doctor.component.scss']
})
export class AddDoctorComponent {
  public routes = routes;
  public selectedValue!: string;

  // Variables para los datos del formulario
  public doctor = {
    Nombre_Doctor: '',
    Departamento: '',
    Celular: '',
    Correo: '',
    Genero: ''
  };

  selectedList1 = [
    { value: 'Medico General' },
    // Agrega más departamentos según sea necesario
  ];

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  onSubmit() {
    this.http.post(environment.URL_SERVICIOS+environment.GET_DOCTORES, this.doctor).subscribe(
      (response) => {
        console.log('Doctor agregado exitosamente', response);
        this.router.navigate([this.routes.doctorsList]); // Redirigir a la lista de doctores
      },
      (error) => {
        console.error('Error al agregar doctor', error);
      }
    );
  }
  onCancel() {
    // Redirige a la lista de doctores
    this.router.navigate([this.routes.doctorsList]);
  }
}
