import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortcutButton } from './shortcut-button.component';
import {CurrentUserService} from '@shared/services';
import {LoginDataProviderService} from '@user/services/login-data-provider.service';
import {UserDataProviderService} from '@verwaltung/services/user-data-provider.service';

describe('ShortcutButtonComponent', () => {
  let component: ShortcutButton;
  let fixture: ComponentFixture<ShortcutButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShortcutButton ],
      providers: [
        {
          provide: CurrentUserService,
          useValue: {
            getVerein: () => 1,
            getCurrentUserID: () => 1,
            hasAnyPermisson: () => true,
            hasAnyRole: () => true,
            isLoggedIn: () => true
          }
        },
        {
          provide: UserDataProviderService,
          useValue: {
            findUserRoleById: () => Promise.resolve({payload: [{roleName: 'ADMIN'}]})
          }
        },
        {
          provide: LoginDataProviderService,
          useValue: {
            signInDefaultUser: () => Promise.resolve()
          }
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortcutButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
