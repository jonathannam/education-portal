import { LocalStorageService } from './../utils/local-storage';
import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthStore } from '../state';
import { STORAGE_KEY } from '../consts';
import { AuthResponse } from '../models';

export const authGuard: CanMatchFn = () => {
  const ls = inject(LocalStorageService);
  const router = inject(Router);
  const currentUser = ls.getItem<AuthResponse>(STORAGE_KEY.currentUser);
  const isAuth = currentUser !== null;
  return isAuth || router.createUrlTree(['/login']);
};
