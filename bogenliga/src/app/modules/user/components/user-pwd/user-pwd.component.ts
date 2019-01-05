import {Component, OnInit} from '@angular/core';
import {USER_PWD_CONFIG} from './user-pwd.config';
import {UserPwdDataProviderService} from '../../services/user-pwd-data-provider.service';
import {CredentialsDO} from '../../types/credentials-do.class';
import {CredentialsDTO} from "../../types/model/credentials-dto.class";
import {LoginResult} from "../../types/login-result.enum";
import {CurrentUserService} from "../../../shared/services/current-user";
import {AlertType} from "../../../shared/components/alerts";

@Component({
  selector:    'bla-user-pwd',
  templateUrl: './user-pwd.component.html',
  styleUrls:   ['./user-pwd.component.scss'],
  providers:   []
})
export class UserPwdComponent implements OnInit {

  public config = USER_PWD_CONFIG;
  public credentials: CredentialsDO;
  public currentUserDTO: CredentialsDTO;
  public updatedUserDTO: CredentialsDTO;
  public loginResult: LoginResult = LoginResult.PENDING;
  public LoginResult = LoginResult;
  public AlertType = AlertType;


  public loading = false;

  constructor(private userPwdDataProvider: UserPwdDataProviderService, private currentUserService: CurrentUserService) {
  }


  ngOnInit() {
  }


  public onUpdate(ignore: any): void {
    this.loading = true;

    // persist
    this.currentUserDTO = new CredentialsDTO(this.credentials.username, this.credentials.password);
    this.updatedUserDTO = new CredentialsDTO(this.credentials.username, this.credentials.newpassword);

    // TODO mit currentUserDTO das aktuelle Passwort prüfen

    this.userPwdDataProvider.update(this.updatedUserDTO)
      .then(
        () => this.handleSuccessUpdate(),
        (loginResult: LoginResult) => this.showFailedUpdate(loginResult)
      );
  }

  private showFailedUpdate(loginResult: LoginResult) {
    this.loading = false;
    this.loginResult = loginResult;
  }

  private handleSuccessUpdate() {
    this.loading = false;
    this.loginResult = LoginResult.SUCCESS;
  }

}


