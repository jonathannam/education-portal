import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { inject } from '@angular/core';
import {
  Observable,
  catchError,
  defer,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { STORAGE_KEY } from '../consts';
import { AuthResponse } from '../models';
import { AuthStore } from '../state';
import { LocalStorageService } from '../utils';

export const addTokenInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authStore = inject(AuthStore);
  const storageService = inject(LocalStorageService);
  const currentUser = storageService.getItem<AuthResponse>(
    STORAGE_KEY.currentUser
  );
  return defer(() => {
    if (
      currentUser?.accessToken &&
      req.url.includes('api/') &&
      !req.url.includes('/refresh-token') &&
      !req.headers.has('Authorization')
    ) {
      if (!authStore.isRefreshingToken()) {
        return addTokenToRequest(req, next, currentUser.accessToken).pipe(
          catchError((err) => {
            if (
              err instanceof HttpErrorResponse &&
              err.status === HttpStatusCode.Unauthorized &&
              !req.url.includes('/login') &&
              !req.url.includes('/refresh-token')
            ) {
              return handle401Error(authStore, req, next);
            }
            return throwError(() => err);
          })
        );
      } else {
        return awaitTokenFromRefreshTokenRequest(
          authStore.getRefreshTokenData(),
          req,
          next
        );
      }
    } else {
      return next(req);
    }
  });
};

function handle401Error(
  authStore: InstanceType<typeof AuthStore>,
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  return defer(() => {
    if (!authStore.isRefreshingToken()) {
      return authStore.refreshToken().pipe(
        switchMap((res) => {
          return addTokenToRequest(request, next, res.accessToken);
        })
      );
    } else {
      return awaitTokenFromRefreshTokenRequest(
        authStore.getRefreshTokenData(),
        request,
        next
      );
    }
  });
}

function awaitTokenFromRefreshTokenRequest(
  refreshTokenData$: Observable<AuthResponse>,
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  return refreshTokenData$.pipe(
    take(1),
    switchMap((res) => {
      return addTokenToRequest(request, next, res.accessToken);
    })
  );
}

function addTokenToRequest(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  accessToken: string
): Observable<HttpEvent<unknown>> {
  const headers = request.headers.set('Authorization', `Bearer ${accessToken}`);
  const reqClone = request.clone({
    headers,
  });
  return next(reqClone);
}
