import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { routes } from 'src/app/shared/routes/routes';

@Component({
  selector: 'app-edit-doctor',
  templateUrl: './edit-doctor.component.html',
  styleUrls: ['./edit-doctor.component.scss']
})
export class EditDoctorComponent implements OnInit {
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

  private doctorId: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.doctorId = this.route.snapshot.paramMap.get('idDoctores'); // Obtener el ID del doctor desde la URL
    this.loadDoctorData();
  }

  loadDoctorData() {
    if (this.doctorId) {
      this.http.get(`http://127.0.0.1:8000/api/doctores/${this.doctorId}`).subscribe(
        (response: any) => {
          this.doctor = response;
        },
        (error) => {
          console.error('Error al cargar los datos del doctor', error);
        }
      );
    }
  }

  onSubmit() {
    if (this.doctorId) {
      this.http.put(`http://127.0.0.1:8000/api/doctores/${this.doctorId}`, this.doctor).subscribe(
        (response) => {
          console.log('Doctor actualizado exitosamente', response);
          this.router.navigate([this.routes.doctorsList]); // Redirigir a la lista de doctores
        },
        (error) => {
          console.error('Error al actualizar el doctor', error);
        }
      );
    }
  }
}
