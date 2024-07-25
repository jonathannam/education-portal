import {
  HttpHandlerFn, HttpInterceptorFn,
  HttpParams,
  HttpRequest
} from '@angular/common/http';

export const removeUndefinedNullParamsInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  if (request.url.includes('api/') && request.method === 'GET') {
    const paramsObject: Record<string, string | string[]> = {};
    for (const [key, value] of request.params['map'] as Map<
      string,
      Array<string>
    >) {
      const paramValues = value.filter(
        (item) => `${item}` !== 'null' && `${item}` !== 'undefined',
      );
      if (paramValues.length > 1) {
        paramsObject[key] = paramValues;
      } else {
        if (paramValues[0] !== undefined) {
          paramsObject[key] = paramValues[0];
        }
      }
    }
    const reqClone = request.clone({
      params: new HttpParams({
        fromObject: paramsObject,
      }),
    });
    return next(reqClone);
  }
  return next(request);
};
