import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthWrapperService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthWrapperService);
  return authService.isAuthenticated();
};

// export { authGuard as AuthGuard }; // not needed in this case
