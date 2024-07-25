import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { STORAGE_KEY } from '../consts';
import { AuthResponse } from '../models';
import { LocalStorageService } from '../utils';

export const nonAuthGuard: CanMatchFn = () => {
  const ls = inject(LocalStorageService);
  const router = inject(Router);
  const currentUser = ls.getItem<AuthResponse>(STORAGE_KEY.currentUser);
  const isAuth = currentUser !== null;
  return !isAuth || router.createUrlTree(['/']);
};
