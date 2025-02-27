import { Injectable, inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthWrapperService {
  private auth = inject(AuthService);

  login() {
    this.auth.loginWithRedirect({
      authorizationParams: {
        redirect_uri: window.location.origin + '/flowxboard', // redirect to main dashboard
      },
    });
  }

  // logout() {
  //   this.auth.logout({
  //     logoutParams: { returnTo: window.location.origin },
  //   });
  // }

  logout() {
    this.auth.logout({ logoutParams: { returnTo: 'http://localhost:4200/login' } });
  }

  getUser() {
    return this.auth.user$;
  }

  isAuthenticated() {
    return this.auth.isAuthenticated$;
  }
}

export { AuthWrapperService as AuthService };
