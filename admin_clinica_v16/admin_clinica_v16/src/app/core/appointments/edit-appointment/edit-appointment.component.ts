import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { routes } from 'src/app/shared/routes/routes';
import { DatePipe } from '@angular/common'; // Importa DatePipe

@Component({
  selector: 'app-edit-appointment',
  templateUrl: './edit-appointment.component.html',
  styleUrls: ['./edit-appointment.component.scss'],
  providers: [DatePipe] // Proporciona DatePipe
})
export class EditAppointmentComponent implements OnInit {
  public routes = routes;
  public selectedValue!: string;
  public deleteIcon = true;

  // Variables para los datos del formulario
  public appointment = {
    Nombre_Paciente: '',
    Celular: '',
    Correo: '',
    Fecha_Cita: '',  // Usamos FormControl para manejar la fecha
    Doctor_Consultor: '',
    Tratamiento: '',
    Notas: ''
  };

  selectedList = [
    { value: 'Dr.Bernardo James' },
    { value: 'Dr.Andrea Lalema' },
    // Agrega más doctores según sea necesario
  ];

  private appointmentId: string | null = null;

  constructor(
    private http: HttpClient,
    public router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe // Inyecta DatePipe
  ) {}

  ngOnInit() {
    this.appointmentId = this.route.snapshot.paramMap.get('idCitas'); // Obtener el ID de la cita desde la URL
    this.loadAppointmentData();
  }

  loadAppointmentData() {
    if (this.appointmentId) {
      this.http.get(`http://127.0.0.1:8000/api/citas/${this.appointmentId}`).subscribe(
        (response: any) => {
          // Convierte la fecha recibida a un formato 'YYYY-MM-DD'
          this.appointment = {
            ...response,
            Fecha_Cita: this.datePipe.transform(new Date(response.Fecha_Cita), 'yyyy-MM-dd') || ''
          };
        },
        (error) => {
          console.error('Error al cargar los datos de la cita', error);
        }
      );
    }
  }

  deleteAppointment() {
    if (this.appointmentId) {
      this.http.delete(`http://127.0.0.1:8000/api/citas/${this.appointmentId}`).subscribe(
        (response) => {
          console.log('Cita eliminada exitosamente', response);
          this.router.navigate([this.routes.appointmentList]); // Redirigir a la lista de citas
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }, 
        (error) => {
          console.error('Error al eliminar la cita', error);
        }
      );
    } else {
      console.error('appointmentId no está disponible');
    }
  }

  onSubmit() {
    if (this.appointmentId) {
      // Convertir la fecha a un formato 'YYYY-MM-DD'
      const updatedAppointment = {
        ...this.appointment,
        Fecha_Cita: this.formatDate(this.appointment.Fecha_Cita)
      };
  
      this.http.put(`http://127.0.0.1:8000/api/citas/${this.appointmentId}`, updatedAppointment).subscribe(
        (response) => {
          console.log('Cita actualizada exitosamente', response);
          this.router.navigate([this.routes.appointmentList]); // Redirigir a la lista de citas
        },
        (error) => {
          console.error('Error al actualizar la cita', error);
        }
      );
    }
  }
  
  private formatDate(date: string): string {
    // Asegúrate de que la fecha esté en el formato 'YYYY-MM-DD'
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }

  deleteIconFunc() {
    this.deleteIcon = !this.deleteIcon;
  }
}
