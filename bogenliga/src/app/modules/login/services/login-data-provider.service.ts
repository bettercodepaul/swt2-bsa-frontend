import {Injectable} from '@angular/core';

import {CommonDataProviderService, RestClient, UriBuilder} from '../../shared/data-provider';
import {Observable} from 'rxjs';
import {CredentialsDTO} from '../types/model/credentials-dto.class';
import {CredentialsDO} from '../types/credentials-do.class';
import {TransferObject} from '../../shared/data-provider/models/transfer-object.interface';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class LoginDataProviderService extends CommonDataProviderService {
  serviceSubUrl = 'v1/user/signin';

  constructor(private restClient: RestClient, private httpClient: HttpClient) {
    super();
  }


  signIn(credentialsDO: CredentialsDO): any {

    let credentialsDTO = new CredentialsDTO(credentialsDO.username, credentialsDO.password);

    this.restClient.POST(new UriBuilder()
      .fromPath(this.getUrl())
      .build(), credentialsDTO).subscribe(data => {
      console.log(data);
      // store user details and jwt token in local storage to keep user logged in between page refreshes

      localStorage.setItem('currentUser', JSON.stringify(data));

    });


    return credentialsDO;
  }

  addOne(payload: TransferObject): Observable<TransferObject> {

    return this.restClient.POST(new UriBuilder()
      .fromPath(this.getUrl())
      .build(), payload);
  }

  deleteById(key: string | number): Observable<any> {
    return undefined;
  }

  findAll(): Observable<TransferObject[]> {
    return this.restClient.GET('http://localhost:9000/v1/hello-world');
  }

  findById(key: string | number): Observable<TransferObject> {
    return undefined;
  }

  update(payload: TransferObject): Observable<TransferObject> {
    return undefined;
  }
}
