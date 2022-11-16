import {Component, OnInit} from '@angular/core';
import {AlertType} from '../../../shared/components/alerts';
import {UserPwdDataProviderService} from '../../services/user-pwd-data-provider.service';
import {ChangeCredentialsDO} from '../../types/changecredentials-do.class';
import {LoginResult} from '../../types/login-result.enum';
import {USER_PWD_CONFIG} from './user-pwd.config';
import {SessionHandling} from '@shared/event-handling';
import {CurrentUserService} from '@shared/services';

@Component({
  selector:    'bla-user-pwd',
  templateUrl: './user-pwd.component.html',
  styleUrls:   ['./user-pwd.component.scss']
})
export class UserPwdComponent implements OnInit {

  public config = USER_PWD_CONFIG;
  public changeCredentials: ChangeCredentialsDO = new ChangeCredentialsDO();
  public loginResult: LoginResult = LoginResult.PENDING;
  public LoginResult = LoginResult;
  public AlertType = AlertType;

  private sessionHandling: SessionHandling;

//  public loading = false;

  constructor(private userPwdDataProvider: UserPwdDataProviderService, private currentUserService: CurrentUserService) {
    this.sessionHandling = new SessionHandling(this.currentUserService);
  }


  ngOnInit() {
  }

  /** When a MouseOver-Event is triggered, it will call this inMouseOver-function.
   *  This function calls the checkSessionExpired-function in the sessionHandling class and get a boolean value back.
   *  If the boolean value is true, then the page will be reloaded and due to the expired session, the user will
   *  be logged out automatically.
   */
  public onMouseOver(event: any) {
    const isExpired = this.sessionHandling.checkSessionExpired();
    if (isExpired) {
      window.location.reload();
    }
  }


  public onUpdate(ignore: any): void {
//    this.loading = true;

    // persist

    this.userPwdDataProvider.update(this.changeCredentials)
        .then(
          () => this.handleSuccessUpdate(),
          (loginResult: LoginResult) => this.showFailedUpdate(loginResult)
        );
  }

  private showFailedUpdate(loginResult: LoginResult) {
//    this.loading = false;
    this.loginResult = loginResult;
  }

  private handleSuccessUpdate() {
//    this.loading = false;
    this.loginResult = LoginResult.SUCCESS;
  }

}


