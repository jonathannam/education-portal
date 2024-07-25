import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { STORAGE_KEY } from '../consts';
import { AuthResponse } from '../models';
import { LocalStorageService } from '../utils';

export function roleGuard(requiredRoles?: string[]): CanMatchFn {
  return () => {
    const ls = inject(LocalStorageService);
    const currentUser = ls.getItem<AuthResponse>(STORAGE_KEY.currentUser);
    if (!currentUser) {
      return false;
    }
    const role = currentUser.role;
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    if (requiredRoles.includes(role)) {
      return true;
    }
    return false;
  };
}
