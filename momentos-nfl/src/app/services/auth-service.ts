import { Injectable } from '@angular/core';
import { userApi } from '../interfaces/interfazFormulario';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';





export type LoginResponse = {
  message: string;
    token?: string;
    user?: userApi;
  mfaRequired?: boolean;
  mfaToken?: string;
};

@Injectable({providedIn: 'root',})
export class AuthService {
    private apiUrl = environment.apiBaseUrl;

    constructor(private http: HttpClient) {}

    login(email: string, password: string): Observable<LoginResponse> {
      return this.http.post<LoginResponse>(
        `${this.apiUrl}/users/logear`,
        { email, password }
      ).pipe(
        tap((res) => {
          if (res.token && res.user) {
            localStorage.setItem(environment.tokenKey, res.token);
            localStorage.setItem('rol', res.user.rol);
            localStorage.setItem(environment.userKey, JSON.stringify(res.user));
            this.saveSession(res.token, res.user);
          }
        })
      );
    }

    verifyMfa(mfaToken: string, code: string): Observable<{ token: string; user: userApi }> {
      return this.http.post<{ token: string; user: userApi }>(
        `${this.apiUrl}/users/mfa/verify`,
        { mfaToken, code }
      ).pipe(
        tap((res) => this.saveSession(res.token, res.user))
      );
    }

    resendMfa(mfaToken: string) {
  return this.http.post(
    `${this.apiUrl}/users/mfa/resend`,
    { mfaToken }
  );
}
  


    register(user: userApi): Observable<userApi> {
      return this.http.post<userApi>(
        `${this.apiUrl}/users/registrar`,
        {nombre: user.nombre , email: user.email, equipo: user.equipo, password: user.password}
      );
    }

    addpoints(delta:number){
      return this.http.post<userApi>(`${this.apiUrl}/users/puntaje`, {delta}).pipe(
        tap((user) =>  this.saveUser(user))
      );
    }

    setPoints(puntaje:number){
      return this.http.post<userApi>(`${this.apiUrl}/users/puntaje`, {puntaje}).pipe(
        tap((user) =>  this.saveUser(user))
      );
    }


    private saveSession(token: string, user: userApi): void {
      localStorage.setItem(environment.tokenKey, token);
      localStorage.setItem(environment.userKey, JSON.stringify(user));
      localStorage.setItem('rol', user?.rol?? 'USER');
    }

    saveToken(token: string): void {
    localStorage.setItem(environment.tokenKey, token);
  }

    getToken(): string | null {
      return localStorage.getItem(environment.tokenKey);
    }

    saveUser(user: userApi): void {
      localStorage.setItem(environment.userKey, JSON.stringify(user));
    }

    getUser(): userApi | null {
      const raw= localStorage.getItem(environment.userKey);
      return raw ? JSON.parse(raw) : null;
    }

    isLoggedIn(): boolean {
      return !!this.getToken();
    }


    logout(){
      localStorage.removeItem(environment.tokenKey);
      localStorage.removeItem(environment.userKey);
      localStorage.removeItem('rol');
    }

    perfil(): Observable<userApi> {
      const token = this.getToken();
      const headers =  new HttpHeaders({
        Authorization: `Bearer ${token ?? ''}`,
      });
      return this.http.get<userApi>(`${this.apiUrl}/users/perfil`, { headers });
    }

}
