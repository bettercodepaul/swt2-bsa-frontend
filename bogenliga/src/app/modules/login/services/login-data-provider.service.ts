import {Injectable} from '@angular/core';

import {DataProviderService, RestClient, UriBuilder} from '../../shared/data-provider';
import {CredentialsDTO} from '../types/model/credentials-dto.class';
import {CredentialsDO} from '../types/credentials-do.class';
import {HttpClient} from '@angular/common/http';
import {CurrentUserService, UserSignInDTO} from '../../shared/services/current-user';

@Injectable({
  providedIn: 'root'
})

export class LoginDataProviderService extends DataProviderService {
  serviceSubUrl = 'v1/user/signin';

  constructor(private restClient: RestClient, private httpClient: HttpClient, private currentUserService: CurrentUserService) {
    super();
  }

  /**
   * I send a sign in request to the backend.
   *
   * On a successful sign in, the user data will be stored with the {@code CurrentUserService}.
   *
   * @param credentialsDO with the sign in payload
   * @return Promise with
   * resolve(true), if the request was successful
   * reject(false), if an error occured
   */
  public signIn(credentialsDO: CredentialsDO): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let credentialsDTO = new CredentialsDTO(credentialsDO.username, credentialsDO.password);
      this.sendSignInRequest(credentialsDTO, resolve, reject);
    });
  }

  private sendSignInRequest(credentialsDTO: CredentialsDTO, resolve, reject) {

    this.restClient.POST(new UriBuilder().fromPath(this.getUrl()).build(), credentialsDTO)
      .subscribe(data => {
        console.log(data);
        // store user details and jwt token in local storage to keep user logged in between page refreshes

        this.currentUserService.persistCurrentUser(new UserSignInDTO(data));

        resolve(true);

      }, error => {

        // TODO correct error handling
        console.warn(JSON.stringify(error));

        reject(false);

      });
  }
}
