import { HttpInterceptorFn } from '@angular/common/http';

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authToken = localStorage.getItem('access_token');

  if (authToken) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${authToken}` },
    });
  }

  return next(req);
};