import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import Keycloak, { KeycloakInstance } from 'keycloak-js';
import { BehaviorSubject } from 'rxjs';
import { UserProfile } from './user-profile';

@Injectable({
  providedIn: 'root',
})
export class KeycloakService {
  private _keycloak: KeycloakInstance | undefined;
  private _profile: UserProfile | undefined;
  userRoles: string[] = [];

  private _isLogged = new BehaviorSubject<boolean>(false);
  isLogged$ = this._isLogged.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  get keycloak() {
    if (!this._keycloak) {
      this._keycloak = new Keycloak({
        url: 'https://dockerfile-production-c869.up.railway.app/',
        realm: 'hoffmanshop',
        clientId: 'HoffmanShop-PKCE-Client',
      });
    }
    return this._keycloak;
  }

  async init(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      // SSR – nie robimy init
      return;
    }

    if (this.keycloak) {
      const authenticated = await this.keycloak.init({
        onLoad: 'check-sso',
      });

      if (authenticated) {
        this._profile = (await this._keycloak?.loadUserProfile()) as UserProfile;
        this._profile.token = this._keycloak?.token;
        this._isLogged.next(true);
        console.log('USER AUTHENTICATED ...');
      }
    }
  }

  login(): Promise<void> {
    return this.keycloak.login();
  }

  logout(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      return this.keycloak?.logout({ redirectUri: 'http://localhost:4200' }) ?? Promise.resolve();
    }
    return Promise.resolve();
  }

  get profile(): UserProfile | undefined {
    return this._profile;
  }

  hasRole(role: string): boolean {
    return this.userRoles.includes(role);
  }
}