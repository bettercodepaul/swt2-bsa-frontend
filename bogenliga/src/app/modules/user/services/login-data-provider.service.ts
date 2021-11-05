import { CredentialsDTO } from '@user/types/model/credentials-dto.class';
import {Injectable} from '@angular/core';

import {HttpErrorResponse} from '@angular/common/http';
import {Store} from '@ngrx/store';
import {DataProviderService, RestClient, UriBuilder} from '../../shared/data-provider';
import {AppState} from '@shared/redux-store';
import {LOGOUT} from '@shared/redux-store';
import {CurrentUserService, UserSignInDTO} from '../../shared/services/current-user';
import {CredentialsDO} from '../types/credentials-do.class';
import {LoginResult} from '../types/login-result.enum';

@Injectable({
  providedIn: 'root'
})
export class LoginDataProviderService extends DataProviderService {

  /*
   * define common REST service url for all requests in this data provider
   */
  serviceSubUrl = 'v1/user/signin';

  /**
   * Constructor with dependency injection
   *
   * @param restClient service for all REST requests
   * @param currentUserService to handle all actions with the current user
   * @param store to access the application state managed by the redux store
   */
  constructor(private restClient: RestClient,
              private currentUserService: CurrentUserService,
              private store: Store<AppState>) {
    super();
  }


  /**
   * I send a sign in request to the backend.
   *
   * On a successful sign in, the user data will be stored with the {@code CurrentUserService}.
   *
   * @param credentialsDO with the sign in payload
   * @return Promise with
   * resolve(), if the request was successful
   * reject(), if an error occurred
   */
  public signIn(credentialsDO: CredentialsDO): Promise<LoginResult> {
    // check remember me flag
    if (credentialsDO.rememberMe) {
      this.currentUserService.rememberUsername(credentialsDO.username);
    } else {
      this.currentUserService.forgetUsername();
    }

    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      const credentialsDTO = new CredentialsDTO(credentialsDO.username, credentialsDO.password, null, credentialsDO.using2FA, credentialsDO.code);
      this.sendSignInRequest(credentialsDTO, resolve, reject);
    });
  }

  public getEmailAddress(): string {
    return this.currentUserService.getRememberedUsername();
  }

  /**
   * I send the request and handle the response
   */
  private sendSignInRequest(credentialsDTO: CredentialsDTO, resolve, reject) {

    this.restClient.POST<UserSignInDTO>(new UriBuilder().fromPath(this.getUrl()).build(), credentialsDTO)
        .then((data: UserSignInDTO) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          this.currentUserService.persistCurrentUser(data);
          resolve(LoginResult.SUCCESS);

        }, (error: HttpErrorResponse) => {

          this.store.dispatch({type: LOGOUT, user: null});
          this.currentUserService.logout();

          if (error.status === 0) {
            reject(LoginResult.CONNECTION_PROBLEM);
          } else {
            reject(LoginResult.FAILURE);
          }
        });
  }

  // signs in the Default user and returns the Promise
  signInDefaultUser(): Promise<LoginResult> {
    const defaultUserCredentials: CredentialsDO = new CredentialsDO('ligadefault', 'user');
    return this.signIn(defaultUserCredentials);
  }
}
