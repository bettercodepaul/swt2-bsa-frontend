import {Component, OnInit} from '@angular/core';
import {AlertType} from '../../../shared/components/alerts';
import {UserPwdDataProviderService} from '../../services/user-pwd-data-provider.service';
import {ChangeCredentialsDO} from '../../types/changecredentials-do.class';
import {LoginResult} from '../../types/login-result.enum';
import {USER_PWD_CONFIG} from './user-pwd.config';

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


//  public loading = false;

  constructor(private userPwdDataProvider: UserPwdDataProviderService) {

  }


  ngOnInit() {
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


