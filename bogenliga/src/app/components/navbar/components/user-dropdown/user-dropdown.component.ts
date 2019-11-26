import {Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Router} from '@angular/router';
import {CurrentUserService} from '@shared/services';
import {LoginDataProviderService} from '@user/services/login-data-provider.service';

@Component({
  selector:    'bla-user-dropdown',
  templateUrl: './user-dropdown.component.html',
  styleUrls:   ['./user-dropdown.component.scss']
})
export class UserDropdownComponent implements OnInit, OnChanges {

  @Output() public onAction = new EventEmitter<void>();

  constructor(private userService: CurrentUserService, private router: Router, private loginDataProvider:LoginDataProviderService) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  public showUserProfile(): void {
    this.onAction.emit();

    this.router.navigateByUrl('/user/profile');
  }

  public showUserPwd(): void {
    this.onAction.emit();

    this.router.navigateByUrl('/user/pwd');
  }

  public logout() {
    this.onAction.emit();
    this.userService.logout();
    this.loginDataProvider.signInDefaultUser().then(r => this.router.navigateByUrl('/home'))
  }
}
