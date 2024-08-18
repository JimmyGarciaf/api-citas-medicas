import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { routes } from 'src/app/shared/routes/routes';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public routes = routes;
  public passwordClass = false;
  public ERROR = false;
  form = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  constructor(
    public auth: AuthService, 
    public router: Router
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('authenticated')) {
      localStorage.removeItem('authenticated');
    }
  }

  loginFormSubmit() {
    // Verifica si el formulario es válido
    if (this.form.valid) {
      this.ERROR = false; // Resetea el estado de error antes de intentar el login

      // Realiza la llamada al servicio de autenticación
      this.auth.login(
        this.form.value.email || '', 
        this.form.value.password || ''
      ).subscribe(
        (resp: any) => {
          // Si la respuesta es válida, verifica el idrole
          if (resp) {
            const userRole = this.auth.getUserRole(); // Obtén el rol del usuario desde AuthService

            // Redirige según el idrole del usuario
            if (userRole === '1') {
              this.router.navigate([routes.patientsList]).then(() => {
                window.location.reload(); // Recarga la página para asegurar que el filtro se aplique
              });
            } else {
              this.router.navigate([routes.adminDashboard]).then(() => {
                window.location.reload(); // Recarga la página para asegurar que el filtro se aplique
              });
            }
          } else {
            // Si el login es inválido, muestra el mensaje de error
            this.ERROR = true;
          }
        },
        (error) => {
          // Maneja cualquier error inesperado que ocurra durante la autenticación
          console.log(error);
          this.ERROR = true; // También puedes mostrar un mensaje de error aquí si es necesario
        }
      );
    }
  }

  togglePassword() {
    this.passwordClass = !this.passwordClass;
  }
}