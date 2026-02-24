import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.html',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  styleUrls: ['./formulario.css']
})
export class Formulario {
  tab: 'login' | 'register' | 'mfa'= 'login';
  loading = false;
  errorMsg = '';
  mfaToken = '';
  mfaForm: FormGroup;

  teams: string[] = [
   "Arizona Cardinals", "Atlanta Falcons", "Baltimore Ravens", "Buffalo Bills",
  "Carolina Panthers", "Chicago Bears", "Cincinnati Bengals", "Cleveland Browns",
  "Dallas Cowboys", "Denver Broncos", "Detroit Lions", "Green Bay Packers",
  "Houston Texans", "Indianapolis Colts", "Jacksonville Jaguars", "Kansas City Chiefs",
  "Las Vegas Raiders", "Los Angeles Chargers", "Los Angeles Rams", "Miami Dolphins",
  "Minnesota Vikings", "New England Patriots", "New Orleans Saints", "New York Giants",
  "New York Jets", "Philadelphia Eagles", "Pittsburgh Steelers", "San Francisco 49ers",
  "Seattle Seahawks", "Tampa Bay Buccaneers", "Tennessee Titans", "Washington Commanders"
  ];

  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      equipo: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.mfaForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    })
  }

  setTab(tab: 'login' | 'register'| 'mfa'= 'login') {
    this.tab = tab;
    this.errorMsg = '';
  }

  // 🔐 LOGIN
 onLogin() {
  if (this.loginForm.invalid) {
    this.errorMsg = 'Todos los campos son obligatorios';
    return;
  }

  const { email, password } = this.loginForm.value;

  this.loading = true;

  this.authService.login(email!, password!).subscribe({
    next: (res) => {
      this.loading = false;

      // ✅ MFA requerido
      if (res.mfaRequired) {
        this.mfaToken = res.mfaToken ?? '';
        this.setTab('mfa');
        return;
      }

      // ✅ Login normal
      if (res.token && res.user) {
        this.authService.saveToken(res.token);
        this.router.navigate(['/index']);
        alert(`✅ Bienvenido ${res.user.nombre} (${res.user.equipo})`);
      } else {
        this.errorMsg = 'Respuesta inválida del servidor';
      }
    },
    error: (err) => {
      this.loading = false;
      this.errorMsg = err?.error?.message || 'Error al iniciar sesión';
    }
  });
}

  // 📝 REGISTER
  onRegister() {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.errorMsg = '';

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.setTab('login');
      },
      error: (err) => {
        this.errorMsg =  err?.error?.message  ||'Error al registrar usuario';
        this.loading = false;
      }
    });
  }

  onVerifyMfa() {
    if (this.mfaForm.invalid) {
      this.errorMsg = 'Ingresa un código válido';
      return;
    }
    this.loading = true;
    this.errorMsg = '';

    const code = this.mfaForm.value.code;

    this.authService.verifyMfa(this.mfaToken, code).subscribe({
      next: (res) => {
        this.loading = false;

        console.log('login con mfa', res.user.rol);

        this.router.navigate(['/index']);
        console.log('Login exitoso con MFA');
        alert(`✅ Bienvenido ${res.user.nombre} (${res.user.equipo})`);
      },
      error: (err) => {
        this.errorMsg = err?.error?.message || 'Error al verificar MFA';
        this.loading = false;
      }
    })
  }

 onResendMfa() {
  if (!this.mfaToken) {
    this.errorMsg = 'No hay una sesión MFA activa. Inicia sesión de nuevo.';
    return;
  }

  this.loading = true;
  this.errorMsg = '';

  this.authService.resendMfa(this.mfaToken).subscribe({
    next: () => {
      this.loading = false;
      this.errorMsg = '✅ Te reenviamos el código al correo.';
    },
    error: (err) => {
      this.loading = false;
      this.errorMsg = err?.error?.message || 'Error al reenviar el código';
    }
  });
}

}