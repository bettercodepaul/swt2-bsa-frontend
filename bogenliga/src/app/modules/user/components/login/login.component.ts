import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {isNullOrUndefined, isUndefined} from '@shared/functions';
import {environment} from '../../../../../environments/environment';
import {AlertType} from '../../../shared/components/alerts';
import {ButtonSize} from '../../../shared/components/buttons';
import {LoginDataProviderService} from '../../services/login-data-provider.service';
import {CredentialsDO} from '../../types/credentials-do.class';
import {LoginResult} from '../../types/login-result.enum';
import {USER_LOGIN_CONFIG} from './login.config';
import {CurrentUserService} from '@shared/services';

const LOGIN_REDIRECT_QUERY_PARAM = 'destination';

@Component({
  selector:    'bla-login',
  templateUrl: './login.component.html',
  styleUrls:   ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public credentials = new CredentialsDO();
  public accessCode: '';

  public loading = false;
  public loginResult: LoginResult = LoginResult.PENDING;
  public ButtonSize = ButtonSize;
  public AlertType = AlertType;
  public LoginResult = LoginResult;
  public inProd = environment.production;

  // TODO: remove after development
  public testAdminUser: CredentialsDO = new CredentialsDO('admin@bogenliga.de', 'admin');
  public testModeratorUser: CredentialsDO = new CredentialsDO('moderator@bogenliga.de', 'moderator');
  public testUserUser: CredentialsDO = new CredentialsDO('user@bogenliga.de', 'user');
  public testDummyModeratorUser: CredentialsDO = new CredentialsDO('Nicholas.Corle@bogenliga.de', 'swt2');
  public testDummyUserUser: CredentialsDO = new CredentialsDO('Malorie.Artman@bogenliga.de', 'swt2');
  public testTeamLigaleiter: CredentialsDO = new CredentialsDO('TeamLigaleiter@bogenliga.de', 'swt2');
  public testTeamSportleiter: CredentialsDO = new CredentialsDO('TeamSportleiter@bogenliga.de', 'swt2');
  public testTeamModerator: CredentialsDO = new CredentialsDO('TeamModerator@bogenliga.de', 'swt2');
  // TODO: remove after development

  public config = USER_LOGIN_CONFIG;
  private destinationRouteAfterLogin = '/home';

  constructor(private loginDataProviderService: LoginDataProviderService, private currentUserService: CurrentUserService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (!isUndefined(params[LOGIN_REDIRECT_QUERY_PARAM])) {
        this.destinationRouteAfterLogin = params[LOGIN_REDIRECT_QUERY_PARAM];
      }
    });

    this.initRememberedUsername();
  }

  /**
   * I send the login credentials to the backend sign in service.
   *
   * Show a success notification and redirect to the destination route from the url query parameter.
   *
   * On error, show an error notification.
   *
   * @param $event ignore
   */
  public onLogin($event: any): void {
    this.loading = true;
    this.currentUserService.disableDefaultUser();
    this.loginDataProviderService.signIn(this.credentials)
        .then(
          () => this.handleSuccessfulLogin(),
          (loginResult: LoginResult) => this.showFailedLogin(loginResult)
        );
  }

  public onSpotterLogin($event: any): void {
    this.destinationRouteAfterLogin = '/spotter/authentication';
    this.credentials = $event;
    this.onLogin(null);
  }

  // TODO: remove after development
  public onAutoLogin($event: CredentialsDO): void {
    this.credentials = $event;
    this.onLogin(null);
  }

  private initRememberedUsername() {
    this.credentials.username = this.loginDataProviderService.getEmailAddress();

    if (!isNullOrUndefined(this.credentials.username)) {
      this.credentials.rememberMe = true;
    }
  }

  private showFailedLogin(loginResult: LoginResult) {
    this.loading = false;
    this.loginResult = loginResult;
  }

  private handleSuccessfulLogin() {
    this.loading = false;
    this.loginResult = LoginResult.SUCCESS;
    this.router.navigateByUrl(this.destinationRouteAfterLogin);
  }
}
