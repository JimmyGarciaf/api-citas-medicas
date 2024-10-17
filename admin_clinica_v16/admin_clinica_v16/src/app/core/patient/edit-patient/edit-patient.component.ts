import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { routes } from 'src/app/shared/routes/routes';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-edit-patient',
  templateUrl: './edit-patient.component.html',
  styleUrls: ['./edit-patient.component.scss']
})
export class EditPatientComponent implements OnInit {
  public routes = routes;
  public selectedValue!: string;
  public deleteIcon = true;

  // Variables para los datos del formulario
  public patient = {
    idPacientes: '',
    Nombre_Paciente: '',
    Departamento: '',
    Celular: '',
    Correo: '',
    Genero: ''
  };

  selectedList1 = [
    { value: 'RRHH' },
    { value: 'Vestimoda' },
    // Agrega más departamentos según sea necesario
  ];

  private patientId: string | null = null;

  constructor(
    private http: HttpClient,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.patientId = this.route.snapshot.paramMap.get('idPacientes'); // Obtener el ID del paciente desde la URL
    this.loadPatientData();
  }

  loadPatientData() {
    if (this.patientId) {
      this.http.get(environment.URL_SERVICIOS+environment.GET_PACIENTES + this.patientId).subscribe(
        (response: any) => {
          this.patient = response;
        },
        (error) => {
          console.error('Error al cargar los datos del paciente', error);
        }
      );
    }
  }

  deletePatient() {
    if (this.patientId) {
      this.http.delete(environment.URL_SERVICIOS+environment.GET_PACIENTES + this.patientId).subscribe(
        (response) => {
          console.log('Paciente eliminado exitosamente', response);
          this.router.navigate([this.routes.patientsList]); // Redirigir a la lista de pacientes
          setTimeout(() => {
            window.location.reload();
          }, 1000); // 5000 milisegundos = 5 segundos
        }, 
        (error) => {
          console.error('Error al eliminar el paciente', error);
        }
      );
    } else {
      console.error('patientId no está disponible');
    }
  }

  onSubmit() {
    if (this.patientId) {
      this.http.put(environment.URL_SERVICIOS+environment.GET_PACIENTES +this.patientId, this.patient).subscribe(
        (response) => {
          console.log('Paciente actualizado exitosamente', response);
          this.router.navigate([this.routes.patientsList]); // Redirigir a la lista de pacientes
        },
        (error) => {
          console.error('Error al actualizar el paciente', error);
        }
      );
    }
  }

  deleteIconFunc() {
    this.deleteIcon = !this.deleteIcon;
  }
}
