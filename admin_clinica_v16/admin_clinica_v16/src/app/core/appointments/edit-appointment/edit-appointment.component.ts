import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { routes } from 'src/app/shared/routes/routes';

@Component({
  selector: 'app-edit-appointment',
  templateUrl: './edit-appointment.component.html',
  styleUrls: ['./edit-appointment.component.scss']
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
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.appointmentId = this.route.snapshot.paramMap.get('idCitas'); // Obtener el ID de la cita desde la URL
    this.loadAppointmentData();
  }

  loadAppointmentData() {
    if (this.appointmentId) {
      this.http.get(`http://127.0.0.1:8000/api/citas/${this.appointmentId}`).subscribe(
        (response: any) => {
          // Asignar los datos de la cita al formulario
          this.appointment = {
            ...response,
            // Convertir la fecha a un FormControl
          };
          console.log(response)
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
      // Preparar los datos para la solicitud PUT

      this.http.put(`http://127.0.0.1:8000/api/citas/${this.appointmentId}`, this.appointment).subscribe(
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

  deleteIconFunc(){
    this.deleteIcon = !this.deleteIcon;
  }
}
