import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
  HttpStatusCode
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);
  const token = localStorage.getItem('access_token');

  // 🧠 Define endpoints that should NOT have Authorization header
  const isPublic = ['/auth/login', '/auth/signup', '/auth/verify-otp'].some(url =>
    req.url.includes(url)
  );

  // Skip token attachment for public routes
  const authReq = isPublic
    ? req
    : token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === HttpStatusCode.Unauthorized) {
        toastr.warning('Session expired, please log in again.');
        localStorage.removeItem('access_token');
        router.navigate(['/auth']);
      }
      return throwError(() => error);
    })
  );
};
