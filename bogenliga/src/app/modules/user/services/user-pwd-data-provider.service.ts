import {Injectable} from '@angular/core';

import {HttpErrorResponse} from '@angular/common/http';
import {
  BogenligaResponse,
  DataProviderService,
  RequestResult,
  RestClient,
  UriBuilder,
  VersionedDataTransferObject
} from '../../shared/data-provider';
import {ChangeCredentialsDO} from '../types/changecredentials-do.class';
import {LoginResult} from '../types/login-result.enum';
import {ChangeCredentialsDTO} from '../types/model/changecredentials-dto.class';

@Injectable({
  providedIn: 'root'
})
export class UserPwdDataProviderService extends DataProviderService {

  serviceSubUrl = 'v1/user';

  constructor(private restClient: RestClient) {
    super();
  }

  public update(changeCredentialsDO: ChangeCredentialsDO): Promise<LoginResult> {

    return new Promise((resolve, reject) => {
      const changeCredentialsDTO = new ChangeCredentialsDTO(changeCredentialsDO.password, changeCredentialsDO.newPassword);
      this.sendupdaterequest(changeCredentialsDTO, resolve, reject);
    });
  }


  public sendupdaterequest(changeCredentialsDTO: ChangeCredentialsDTO, resolve, reject) {
    this.restClient.PUT<VersionedDataTransferObject>(new UriBuilder().fromPath(this.getUrl()).build(), changeCredentialsDTO)
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
