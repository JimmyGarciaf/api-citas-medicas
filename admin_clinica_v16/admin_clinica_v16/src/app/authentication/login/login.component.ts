import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

  form = new FormGroup({
    email: new FormControl('admin@mcc.hn', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('clinica1234', [Validators.required]),
  });
 
  get f() {
    return this.form.controls;
  }

  constructor(public auth: AuthService) {}
  ngOnInit(): void {
    if (localStorage.getItem('authenticated')) {
      localStorage.removeItem('authenticated');
    }
  }

  loginFormSubmit() {
    if (this.form.valid) {
      this.auth.login(this.form.value.email ? this.form.value.email : '', this.form.value.password ? this.form.value.password : '')
      .subscribe((resp:any) => {
        console.log(resp);
        if(resp){
          // El login es exitoso
        }else {
          // El login es invalido
        }
      },error => {
        console.log(error);
      })
      ;
    }
  }
  togglePassword() {
    this.passwordClass = !this.passwordClass;
  }
}
