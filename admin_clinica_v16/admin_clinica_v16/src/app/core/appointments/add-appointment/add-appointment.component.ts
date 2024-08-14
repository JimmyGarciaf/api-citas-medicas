import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { routes } from 'src/app/shared/routes/routes';

@Component({
  selector: 'app-add-appointment',
  templateUrl: './add-appointment.component.html',
  styleUrls: ['./add-appointment.component.scss']
})
export class AddAppointmentComponent {
  public routes = routes;
  public selectedValue!: string;
  public patientData: any = {}; // Datos del paciente
  public appointment = {
    Fecha_Cita: '',
    Doctor_Consultor: '',
    Tratamiento: '',
    Notas: ''
  };

  selectedList = [
    { value: 'Dr.Bernardo James' },
    { value: 'Dr.Andrea Lalema' },
    { value: 'Dr.William Stephin' }
  ];

  constructor(private http: HttpClient, public router: Router) {}

  onIdentityInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const identity = input.value;

    if (identity) {
      this.http.get(`http://127.0.0.1:8000/api/pacientes/${identity}`).subscribe(
        (response: any) => {
          this.patientData = response;
          // Puedes ajustar los valores automáticamente si es necesario
          // this.appointment.Fecha_Cita = response.Fecha_Cita;
          // this.appointment.Doctor_Consultor = response.Doctor_Consultor;
        },
        (error) => {
          console.error('Error al obtener datos del paciente:', error);
          this.patientData = {}; // Limpia los datos en caso de error
        }
      );
    } else {
      this.patientData = {}; // Limpia los datos si la identidad está vacía
    }
  }
}
