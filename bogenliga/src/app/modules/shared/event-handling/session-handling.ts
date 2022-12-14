import {CurrentUserService} from '@shared/services/current-user';
import {OnOfflineService} from '@shared/services';


export class SessionHandling {

  private isExpired: boolean;
  private expiredOnceTime: number;

  constructor(private currentUserService: CurrentUserService,
    private onOfflineService: OnOfflineService) {
    this.isExpired = false;
    this.expiredOnceTime = Math.floor((new Date).getTime() / 1000);
  }

  /** This method gets the current Time in number and gets the Time, when the session is about to expire, by using
   *  the jsonWebToken from currentUserService. To get the expire session time from jsonWebToken, the jsonWebToken will
   *  be split and parsed only the information about the expire session time in a variable. After that it will check if
   *  the current Time is already after the session expire time. It also checks if expiredOnceTime is smaller than
   *  expireTime and if the system is in online-modus.
   *  If one of three condition is not met, then it will return a false.
   *  If all three conditions are met, then it will return true. It will also write currentTime in expiredOnceTime,
   *  so that the pages can only reload and logout once in only one session-expired case (to handle endless reloads).
   **/
  public checkSessionExpired(): boolean {
    let currentTime = Math.floor((new Date).getTime() / 1000);
    const jsonWebToken = this.currentUserService.getJsonWebToken();
    const expireTime = (JSON.parse(atob(jsonWebToken.split('.')[1]))).exp;
    if (currentTime >= expireTime && this.expiredOnceTime < expireTime && !this.onOfflineService.isOffline()) {
      this.isExpired = true;
      this.expiredOnceTime = currentTime;
    } else {
      this.isExpired = false;
    }
    return this.isExpired;
  }
}
