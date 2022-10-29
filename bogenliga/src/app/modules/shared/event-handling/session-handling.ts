import {CurrentUserService} from '@shared/services/current-user';


export class SessionHandling {

  private currentUserService: CurrentUserService;

  public onFocus(): void {
    this.currentUserService.getUserId();
  }
}
