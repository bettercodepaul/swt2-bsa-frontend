import {CurrentUserService} from '@shared/services/current-user';


export class SessionHandling {
  constructor(private currentUserService: CurrentUserService) {
  }

  public onFocus(): void {
    console.log('test onFOcus sessionHandling');
    this.currentUserService.isLoggedIn();
  }
}
