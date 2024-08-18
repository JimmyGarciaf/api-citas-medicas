import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';
import { routes } from '../routes/routes';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: any;
  token: any;

  constructor(private router: Router, public http: HttpClient) {
    this.getLocalStorage();
  }

  getLocalStorage() {
    if (localStorage.getItem('token') && localStorage.getItem('user')) {
      let USER = localStorage.getItem('user');
      this.user = JSON.parse(USER ? USER : '');
      this.token = localStorage.getItem('token');
    } else {
      this.user = null;
      this.token = null;
    }
  }

  // Modifica el método para que devuelva idrole
  getUserRole(): string {
    return this.user ? this.user.idrole : '1'; // Devuelve el idrole o 1 por defecto
  }

  login(email: string, password: string) {
    let URL = URL_SERVICIOS + '/auth/login';
    return this.http.post(URL, { email: email, password: password }).pipe(
      map((auth: any) => {
        const result = this.saveLocalStorage(auth);
        return result;
      }),
      catchError((error: any) => {
        console.log(error);
        return of(undefined);
      })
    );
  }

  saveLocalStorage(auth: any) {
    if (auth && auth.access_token) {
      localStorage.setItem('token', auth.access_token);
      localStorage.setItem('user', JSON.stringify(auth.user));
      localStorage.setItem('authenticated', 'true');
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('authenticated');
    sessionStorage.clear(); // Limpia cualquier estado guardado en sessionStorage
    this.router.navigate([routes.login]); // Redirige al login
  }
}