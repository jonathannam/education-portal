import {
  HttpHandlerFn, HttpInterceptorFn, HttpRequest
} from '@angular/common/http';
import { injectEnvironment } from '../providers';

export const apiPrefixInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const envConfig = injectEnvironment();
  if (!req.url.startsWith('http') && !req.url.includes('assets')) {
    const reqClone = req.clone({
      url: `${envConfig.apiUrl}/${req.url}`,
    });
    return next(reqClone);
  }
  return next(req);
};
