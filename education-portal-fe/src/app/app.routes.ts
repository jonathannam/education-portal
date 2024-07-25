import { Routes } from '@angular/router';
import { authGuard, nonAuthGuard } from './shared/guards';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((c) => c.LoginComponent),
    canMatch: [nonAuthGuard],
  },
  {
    path: '',
    loadComponent: () =>
      import('./layout/layout.component').then((c) => c.LayoutComponent),
    loadChildren: () => import('./layout/layout.routes').then((m) => m.routes),
    canMatch: [authGuard],
  },
];
