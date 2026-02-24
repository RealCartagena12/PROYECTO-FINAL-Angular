import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService, LoginResponse } from '../../services/auth-service';
import { userApi } from '../../interfaces/interfazFormulario';
import { CommonModule, NgIf, AsyncPipe } from '@angular/common';
import { Reconectando } from '../../services/reconectando';
import { inject } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, NgIf, AsyncPipe],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar {
  conn = inject(Reconectando);
  constructor(public auth: AuthService, private router: Router) {}

  get user(): userApi | null {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) as userApi : null;

  }
  logout() : void {
    this.auth.logout();
    alert('✅ Has cerrado sesión correctamente.');
    this.router.navigate(['/formulario']);
  }
}
