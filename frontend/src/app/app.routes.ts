import { Routes } from '@angular/router';
import { AccountsComponent } from './components/accounts/accounts.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SettingsComponent } from './components/settings/settings.component';
import { inject } from '@angular/core';
import { AuthGuard } from './auth/auth.guard';
import { AuthComponent } from './auth/auth.component';
import { ServiceLoginComponent } from './auth/service-login/service-login.component';

export const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: 'service-login', component: ServiceLoginComponent },
  {
    path: 'accounts',
    component: AccountsComponent,
    canActivate: [() => inject(AuthGuard).canActivate()],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [() => inject(AuthGuard).canActivate()],
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [() => inject(AuthGuard).canActivate()],
  },
  { path: '**', redirectTo: '/dashboard' },
];
