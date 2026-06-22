import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (roles: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const currentUser = authService.currentUserValue;

    if (currentUser && currentUser.role && roles.map(r => r.toLowerCase()).includes(currentUser.role.toLowerCase())) {
      return true;
    }

    // Role not authorized, redirect to home
    router.navigate(['/']);
    return false;
  };
};

export const adminGuard = roleGuard(['Admin']);
export const providerGuard = roleGuard(['Provider', 'Admin']);
export const customerGuard = roleGuard(['Customer', 'Admin']);
