import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'oktatok', pathMatch: 'full' },
  {
    path: 'oktatok',
    loadComponent: () =>
      import('./components/oktatok/oktatok.component').then((m) => m.OktatokComponent),
  },
  {
    path: 'hallgatok',
    loadComponent: () =>
      import('./components/hallgatok/hallgatok.component').then((m) => m.HallgatokComponent),
  },
  {
    path: 'tantargyak',
    loadComponent: () =>
      import('./components/tantargyak/tantargyak.component').then((m) => m.TantargyakComponent),
  },
  {
    path: 'kurzusok',
    loadComponent: () =>
      import('./components/kurzusok/kurzusok.component').then((m) => m.KurzusokComponent),
  },
  {
    path: 'beiratkozasok',
    loadComponent: () =>
      import('./components/beiratkozasok/beiratkozasok.component').then(
        (m) => m.BeiratkozasokComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'statisztikak',
    loadComponent: () =>
      import('./components/statisztikak/statisztikak.component').then(
        (m) => m.StatisztikakComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/register/register.component').then((m) => m.RegisterComponent),
  },
];
