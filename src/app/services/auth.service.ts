import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceWrapper {
  constructor(private auth: AuthService) {}

  loginWithGoogle() {
    this.auth.loginWithRedirect();
  }

  logout() {
    this.auth.logout({ logoutParams: { returnTo: window.location.origin } });
  }
  

  getUser() {
    return this.auth.user$; 
  }

}

export { AuthServiceWrapper as AuthService };
