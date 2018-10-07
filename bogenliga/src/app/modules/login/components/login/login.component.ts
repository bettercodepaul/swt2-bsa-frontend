import {Component, OnInit} from '@angular/core';
import {CredentialsDO} from '../../types/credentials-do.class';
import {LoginDataProviderService} from '../../services/login-data-provider.service';
import {ButtonSize} from '../../../shared/components/buttons';
import {AlertType} from '../../../shared/components/alerts';
import {ActivatedRoute, Router} from '@angular/router';
import {isUndefined} from 'util';
import {LoginResult} from '../../types/login-result.enum';
import {of} from 'rxjs';
import {delay, tap} from 'rxjs/operators';

const LOGIN_REDIRECT_QUERY_PARAM = 'destination';

@Component({
  selector: 'bla-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss',
    './../../../../app.component.scss']
})
export class LoginComponent implements OnInit {

  public credentials = new CredentialsDO();
  public loading = false;
  public loginResult: LoginResult = LoginResult.PENDING;
  public ButtonSize = ButtonSize;
  public AlertType = AlertType;
  public LoginResult = LoginResult;
  private destinationRouteAfterLogin = '/home';

  constructor(private loginDataProviderService: LoginDataProviderService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (!isUndefined(params[LOGIN_REDIRECT_QUERY_PARAM])) {
        this.destinationRouteAfterLogin = params[LOGIN_REDIRECT_QUERY_PARAM];
      }
    });
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

    this.loginDataProviderService.signIn(this.credentials)
      .then(
        () => {
          this.handleSuccessfulLogin();
        },
        () => {
          this.handleFailedLogin();
        }
      );
  }

  private handleFailedLogin() {
    this.loading = false;
    this.loginResult = LoginResult.FAILURE;
  }

  private handleSuccessfulLogin() {
    this.loading = false;
    this.loginResult = LoginResult.SUCCESS;

    // timeout function
    of(true).pipe(
      tap(v => console.log('Login successful. Delay between login success notification and redirect...')),
      delay(2000)
    ).subscribe(v => this.router.navigateByUrl(this.destinationRouteAfterLogin));
  }
}
