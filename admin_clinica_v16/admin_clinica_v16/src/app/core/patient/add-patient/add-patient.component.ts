import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { routes } from 'src/app/shared/routes/routes';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.scss']
})
export class AddPatientComponent {
  public routes = routes;

  // Variables para los datos del formulario
  public patients = {
    idPacientes: '',
    Nombre_Paciente: '',
    Departamento: '',
    Celular: '',
    Correo: '',
    Genero: ''
  };

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  onSubmit() {
    this.http.post(environment.URL_SERVICIOS+environment.GET_PACIENTES, this.patients).subscribe(
      (response) => {
        console.log('Paciente agregado exitosamente', response);
        this.router.navigate([this.routes.patientsList]); // Redirigir a la lista de pacientes
      },
      (error) => {
        console.error('Error al agregar paciente', error);
      }
    );
  }

  onCancel() {
    // Redirige a la lista de pacientes
    this.router.navigate([this.routes.patientsList]);
  }
}
