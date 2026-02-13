import { HttpInterceptorFn } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, retryWhen, throwError, switchMap, take, tap, timer } from 'rxjs';
import { inject } from '@angular/core';
import { Reconectando } from '../services/reconectando';
import { finalize } from 'rxjs/operators';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const conn = inject(Reconectando);

  return next(req).pipe(
    retryWhen(errors =>
      errors.pipe(
        switchMap((err) => {
          const httpErr = err as HttpErrorResponse;
          const ApiDown = httpErr instanceof HttpErrorResponse && err.status === 0;
        
          if (!ApiDown) return throwError (()  => err);
          
          conn.setReconnecting(true);
          console.error('❌ No se pudo conectar con la API (apagada). Reintentando...');
          return timer(2000);
        }),
         take(5)
      )
    ),

    catchError((err: HttpErrorResponse) => {
      if (err.status === 0) {
        console.error('❌ No se pudo reconectar con la API después de varios intentos.');
      } else {
        console.error(`❌ Error HTTP ${err.status}:`, err.error?.error || err.message);
      }
      return throwError(() => err);
    }),

    finalize(() => {
      // pase lo que pase (éxito o fallo final), apagar “reconectando”
      conn.setReconnecting(false);
    })
  );
};
