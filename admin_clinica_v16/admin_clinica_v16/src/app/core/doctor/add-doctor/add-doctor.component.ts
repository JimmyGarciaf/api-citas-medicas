import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { routes } from 'src/app/shared/routes/routes';

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

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.http.post('http://127.0.0.1:8000/api/doctores/', this.doctor).subscribe(
      (response) => {
        console.log('Doctor agregado exitosamente', response);
        this.router.navigate([this.routes.doctorsList]); // Redirigir a la lista de doctores
      },
      (error) => {
        console.error('Error al agregar doctor', error);
      }
    );
  }
}
