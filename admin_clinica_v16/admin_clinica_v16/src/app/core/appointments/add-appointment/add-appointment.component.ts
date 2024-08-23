import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { routes } from 'src/app/shared/routes/routes';
import { DatePipe } from '@angular/common';

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
    idPacientes: '', // Asegúrate de incluir este campo
    Nombre_Paciente: '',
    Genero: '',
    Celular: '',
    Correo: '',
    Fecha_Cita: '',
    Doctor_Consultor: '',
    Diagnostico: '',
    Tratamiento: '',
    Notas: ''
  };

  selectedList = [
    { value: 'Dr.Bernardo James' },
    { value: 'Dr.Andrea Lalema' },
    { value: 'Dr.William Stephin' }
  ];

  constructor(private http: HttpClient, public router: Router, private datePipe: DatePipe) {}


  onIdentityInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const identity = input.value;

    if (identity) {
      this.http.get(`http://127.0.0.1:8000/api/pacientes/${identity}`).subscribe(
        (response: any) => {
          this.patientData = response;
          this.appointment.idPacientes = this.patientData.idPacientes; // Asigna el id del paciente a la cita
          this.appointment.Nombre_Paciente = this.patientData.Nombre_Paciente;
          this.appointment.Genero = this.patientData.Genero;
          this.appointment.Celular = this.patientData.Celular;
          this.appointment.Correo = this.patientData.Correo;
        },
        (error) => {
          console.error('Error al obtener datos del paciente:', error);
          this.patientData = {}; // Limpia los datos en caso de error
        }
      );
    } else {
      this.patientData = {}; // Limpia los datos si la identidad está vacía
      this.appointment.idPacientes = ''; // Limpia el id del paciente
    }
  }

  onSubmit() {
    const formattedDate = this.datePipe.transform(this.appointment.Fecha_Cita, 'yyyy-MM-dd');
    const appointmentData = {
      ...this.appointment,
      Fecha_Cita: formattedDate,
      idPacientes: this.patientData.idPacientes,
      Nombre_Paciente: this.patientData.Nombre_Paciente,
      Genero: this.patientData.Genero,
      Celular: this.patientData.Celular,
      Correo: this.patientData.Correo
    };

    this.http.post('http://127.0.0.1:8000/api/citas', appointmentData).subscribe(
      (response) => {
        console.log('Cita creada exitosamente', response);
        this.router.navigate([this.routes.appointmentList]);
      },
      (error) => {
        console.error('Error al crear cita', error);
      }
    );
  }
  // Nueva función para imprimir la sección
  printSection(): void {
    const printContent = document.getElementById('section-to-print');
    const WindowPrt = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt?.document.write(printContent?.innerHTML || '');
    WindowPrt?.document.close();
    WindowPrt?.focus();
    WindowPrt?.print();
    WindowPrt?.close();
  }
}
