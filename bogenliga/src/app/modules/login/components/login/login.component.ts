import {Component, OnInit} from '@angular/core';
import {CredentialsDO} from '../../types/credentials-do.class';
import {LoginDataProviderService} from '../../services/login-data-provider.service';

@Component({
  selector: 'bla-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss',
    './../../../../app.component.scss']
})
export class LoginComponent implements OnInit {

  public credentials = new CredentialsDO();

  constructor(private loginDataProviderService: LoginDataProviderService) {
  }

  ngOnInit() {
  }

  public onLogin($event: any): void {

    this.loginDataProviderService.signIn(this.credentials);
  }
}
