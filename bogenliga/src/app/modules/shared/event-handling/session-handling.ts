import { CurrentUserService } from '@shared/services/current-user';
import { OnOfflineService } from '@shared/services';
import { environment } from '@environment';
import { Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export class SessionHandling {
  private isExpired: boolean;
  private expiredOnceTime: number;
  private jsonWebToken: string;
  private tempUserToken: string | null;

  constructor(
    private currentUserService: CurrentUserService,
    private onOfflineService: OnOfflineService
  ) {
    this.isExpired = false;
    this.expiredOnceTime = Math.floor(new Date().getTime() / 1000);
    this.jsonWebToken = this.currentUserService.getJsonWebToken();
    this.tempUserToken = null;
  }

  public checkSessionExpired(): boolean {
    const currentTime = Math.floor(new Date().getTime() / 1000);
    const expireTime = JSON.parse(atob(this.jsonWebToken.split('.')[1])).exp;
    if (
      currentTime >= expireTime &&
      this.expiredOnceTime < expireTime &&
      !this.onOfflineService.isOffline()
    ) {
      this.isExpired = true;
      this.expiredOnceTime = currentTime;
    } else {
      this.isExpired = false;
    }
    return this.isExpired;
  }

  public keepSessionAlive(injector: Injector) {
    const http = injector.get(HttpClient);
    const url = `${environment.backendBaseUrl}/v1/user/keepalive`;

    if (this.tempUserToken === null) {
      this.tempUserToken = this.currentUserService.getJsonWebToken();
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.currentUserService.getJsonWebToken()}`,
      Accept: 'application/json'
    });

    console.log('trying to keep the session alive');
    return http.get<any>(url, { headers }).subscribe(
      (response) => {
        console.log(response);
        if (response.token) {
          const newToken = response.token;
          this.tempUserToken = newToken;
          this.currentUserService.setJsonWebToken(newToken);
          this.jsonWebToken = newToken;
        } else {
          console.error('No token found in response');
        }
      },
      (error) => {
        console.error('Error keeping session alive', error);
      }
    );
  }
}
