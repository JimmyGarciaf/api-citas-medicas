import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { routes } from 'src/app/shared/routes/routes';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  public routes = routes;
  private doctorId: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.doctorId = this.route.snapshot.paramMap.get('idDoctores'); // Obtener el ID del doctor desde la URL
    console.log(this.doctorId);
  }
  
  deleteDoctor() {
    if (this.doctorId) {
      this.http.delete(`http://127.0.0.1:8000/api/doctores/${this.doctorId}`).subscribe(
        (response) => {
          console.log('Doctor eliminado exitosamente', response);
          this.router.navigate([this.routes.doctorsList]); // Redirigir a la lista de doctores
        },
        (error) => {
          console.error('Error al eliminar el doctor', error);
        }
      );
    } else {
      console.error('doctorId no está disponible');
    }
  }
}
