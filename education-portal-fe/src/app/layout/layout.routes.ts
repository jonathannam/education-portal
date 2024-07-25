import { Routes } from '@angular/router';
import { ROLE } from '../shared/consts';
import { roleGuard } from '../shared/guards';

export const routes: Routes = [
  {
    path: 'user-management',
    loadComponent: () =>
      import('../user-management/user-management.component').then(
        (c) => c.UserManagementComponent
      ),
    canMatch: [roleGuard([ROLE.SystemAdmin])],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'user-management',
  },
];
