import { Routes } from '@angular/router';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { CustomerLayout } from './layouts/customer-layout/customer-layout';
import { ProviderLayout } from './layouts/provider-layout/provider-layout';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { authGuard } from './core/guards/auth.guard';
import { customerGuard, providerGuard, adminGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      { path: '', loadComponent: () => import('./features/home/home').then(m => m.Home) },
      { path: 'login', loadComponent: () => import('./features/auth/login/login').then(m => m.Login) },
      { path: 'register', loadComponent: () => import('./features/auth/register/register').then(m => m.Register) },
      { path: 'services', loadComponent: () => import('./features/services/services-list/services-list').then(m => m.ServicesList) },
      { path: 'services/:id', loadComponent: () => import('./features/services/service-details/service-details').then(m => m.ServiceDetails) }
    ]
  },
  {
    path: 'customer',
    component: CustomerLayout,
    canActivate: [authGuard, customerGuard],
    children: [
      { path: '', loadComponent: () => import('./features/customer/customer-dashboard/customer-dashboard').then(m => m.CustomerDashboard) },
      { path: 'bookings', loadComponent: () => import('./features/customer/customer-dashboard/customer-dashboard').then(m => m.CustomerDashboard) },
      { path: 'profile', loadComponent: () => import('./features/customer/customer-profile/customer-profile').then(m => m.CustomerProfile) }
    ]
  },
  {
    path: 'provider',
    component: ProviderLayout,
    canActivate: [authGuard, providerGuard],
    children: [
      { path: '', loadComponent: () => import('./features/provider/provider-dashboard/provider-dashboard').then(m => m.ProviderDashboard) },
      { path: 'jobs', loadComponent: () => import('./features/provider/provider-dashboard/provider-dashboard').then(m => m.ProviderDashboard) },
      { path: 'earnings', loadComponent: () => import('./features/provider/provider-earnings/provider-earnings').then(m => m.ProviderEarnings) },
      { path: 'profile', loadComponent: () => import('./features/provider/provider-profile/provider-profile').then(m => m.ProviderProfile) }
    ]
  },
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [authGuard, adminGuard],
    children: [
      { path: '', loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard) }
    ]
  },
  { path: '**', redirectTo: '' }
];
