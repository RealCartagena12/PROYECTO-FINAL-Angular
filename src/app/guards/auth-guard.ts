import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Alert } from 'bootstrap';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) return true;

  alert('Debes iniciar sesión para acceder a esta página.');

  return router.createUrlTree(['/formulario']);
};
