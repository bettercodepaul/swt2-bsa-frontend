import {Component, OnInit} from '@angular/core';
import {CredentialsDO} from '../../types/credentials-do.class';
import {LoginDataProviderService} from '../../services/login-data-provider.service';
import {ButtonSize} from '../../../shared/components/buttons';
import {AlertType} from '../../../shared/components/alerts';
import {ActivatedRoute, Router} from '@angular/router';
import {isUndefined} from 'util';

@Component({
  selector: 'bla-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss',
    './../../../../app.component.scss']
})
export class LoginComponent implements OnInit {

  public credentials = new CredentialsDO();
  public loading = false;
  public ButtonSize = ButtonSize;
  public AlertType = AlertType;
  private destinationRouteAfterLogin = '/home';

  constructor(private loginDataProviderService: LoginDataProviderService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (!isUndefined(params['destination'])) {
        this.destinationRouteAfterLogin = params['destination'];
      }
    });
  }

  public onLogin($event: any): void {
    this.loading = true;

    this.loginDataProviderService.signIn(this.credentials).then(
      (success: boolean) => {
        this.loading = false;
        this.router.navigateByUrl(this.destinationRouteAfterLogin);
      },
      (err: boolean) => {
        this.loading = false;
      }
    );
  }
}
