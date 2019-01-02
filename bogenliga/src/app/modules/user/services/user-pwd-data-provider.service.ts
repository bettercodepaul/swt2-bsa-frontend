import {Injectable} from '@angular/core';

import {
  DataProviderService,
  RequestResult,
  Response,
  RestClient,
  UriBuilder,
  VersionedDataTransferObject
} from '../../shared/data-provider';
import {HttpErrorResponse} from '@angular/common/http';
import {LoginResult} from "../types/login-result.enum";
import {CredentialsDTO} from "../types/model/credentials-dto.class";

@Injectable({
  providedIn: 'root'
})
export class UserPwdDataProviderService extends DataProviderService {

  serviceSubUrl = 'v1/user';

  constructor(private restClient: RestClient) {
    super();
  }

  public update(credentialsDTO: CredentialsDTO): Promise<LoginResult> {

    return new Promise((resolve, reject) => {
      this.sendupdaterequest(credentialsDTO, resolve, reject);
    });
  }


  public sendupdaterequest(credentialsDTO: CredentialsDTO, resolve, reject) {
    this.restClient.POST<VersionedDataTransferObject>(new UriBuilder().fromPath(this.getUrl()).build(), credentialsDTO)
      .then((data: VersionedDataTransferObject) => {
        resolve(RequestResult.SUCCESS);

      }, (error: HttpErrorResponse) => {

        if (error.status === 0) {
          reject({result: RequestResult.CONNECTION_PROBLEM});
        } else {
          reject({result: RequestResult.FAILURE});
        }
      });
  }
}
