import {Component, OnInit} from '@angular/core';
import {CredentialsDO} from '../../types/credentials-do.class';
import {LoginDataProviderService} from '../../services/login-data-provider.service';
import {ButtonSize} from '../../../shared/components/buttons';

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

  constructor(private loginDataProviderService: LoginDataProviderService) {
  }

  ngOnInit() {
  }

  public onLogin($event: any): void {
    this.loading = true;

    this.loginDataProviderService.signIn(this.credentials).then(
      (success: boolean) => {
        this.loading = false;
      },
      (err: boolean) => {
        this.loading = false;
      }
    );
  }
}
