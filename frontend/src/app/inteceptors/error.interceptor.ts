import { inject } from '@angular/core';
import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

export function errorInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) {
  return next(req).pipe(
    catchError((err) => {
      if (err.status === 401) {
        inject(AuthService).logout();
      }
      const error = err.error || err.statusText;
      return throwError(error);
    }),
  );
}
