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
import {CurrentUserService} from '../../shared/services/current-user';
import {CredentialsDTO} from '../../user/types/model/credentials-dto.class';
import {fromPayload, fromPayloadArray} from '../mapper/benutzer-mapper';
import {fromPayloadArrayBenutzerRolle, fromPayloadBenutzerRolle} from '../mapper/benutzer-rolle-mapper';
import {BenutzerDO} from '../types/benutzer-do.class';
import {BenutzerRolleDO} from '../types/benutzer-rolle-do.class';
import {BenutzerRolleDTO} from '../types/datatransfer/benutzer-rolle-dto.class';
import {CredentialsDO} from '@user/types/credentials-do.class';

@Injectable({
  providedIn: 'root'
})
export class BenutzerDataProviderService extends DataProviderService {

  serviceSubUrl = 'v1/user';

  constructor(private restClient: RestClient, private currentUserService: CurrentUserService) {
    super();
  }

  public create(payload: CredentialsDTO): Promise<BogenligaResponse<BenutzerDO>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.POST<VersionedDataTransferObject>(new UriBuilder().fromPath(this.getUrl()).path('create').build(), payload)
        .then((data: VersionedDataTransferObject) => {
          resolve({result: RequestResult.SUCCESS, payload: fromPayload(data)});

        }, (error: HttpErrorResponse) => {

          if (error.status === 0) {
            reject({result: RequestResult.CONNECTION_PROBLEM});
          } else {
            reject({result: RequestResult.FAILURE});
          }
        });
    });
  }

  public updateRole(payload: Array<BenutzerRolleDTO>): Promise<BogenligaResponse<Array<BenutzerDO>>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.PUT<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path('uptRoles').build(), payload)
        .then((data: Array<VersionedDataTransferObject>) => {
          resolve({result: RequestResult.SUCCESS, payload: fromPayloadArray(data)});

        }, (error: HttpErrorResponse) => {

          if (error.status === 0) {
            reject({result: RequestResult.CONNECTION_PROBLEM});
          } else {
            reject({result: RequestResult.FAILURE});
          }
        });
    });
  }

  public resetPW(credentialsDO: CredentialsDO): Promise<BogenligaResponse<Array<BenutzerDO>>> {

    return new Promise((resolve, reject) => {
      //const credentialsDTO = new CredentialsDTO(credentialsDO.password);
      //this.sendupdaterequest(credentialsDTO, resolve, reject);
    });
  }

  public sendupdaterequest(credentialsDTO: CredentialsDTO, resolve, reject) {
    this.restClient.PUT<VersionedDataTransferObject>(new UriBuilder().fromPath(this.getUrl()).build(), credentialsDTO)
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

  public deleteById(id: number): Promise<BogenligaResponse<void>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.DELETE<void>(new UriBuilder().fromPath(this.getUrl()).path(id).build())
          .then((noData) => {
            resolve({result: RequestResult.SUCCESS});

          }, (error: HttpErrorResponse) => {

            if (error.status === 0) {
              reject({result: RequestResult.CONNECTION_PROBLEM});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    });
  }


  public findAll(): Promise<BogenligaResponse<BenutzerRolleDO[]>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<Array<VersionedDataTransferObject>>(this.getUrl())
          .then((data: VersionedDataTransferObject[]) => {

            resolve({result: RequestResult.SUCCESS, payload: fromPayloadArrayBenutzerRolle(data)});

          }, (error: HttpErrorResponse) => {

            if (error.status === 0) {
              reject({result: RequestResult.CONNECTION_PROBLEM});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    });
  }


  public findUserRoleById(id: string | number): Promise<BogenligaResponse<BenutzerRolleDO[]>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<VersionedDataTransferObject[]>(new UriBuilder().fromPath(this.getUrl()).path('userrole').path(id).build())
        .then((data: VersionedDataTransferObject[]) => {

          resolve({result: RequestResult.SUCCESS, payload: fromPayloadArrayBenutzerRolle(data)});

        }, (error: HttpErrorResponse) => {

          if (error.status === 0) {
            reject({result: RequestResult.CONNECTION_PROBLEM});
          } else {
            reject({result: RequestResult.FAILURE});
          }
        });
    });
  }



  public findById(id: string | number): Promise<BogenligaResponse<BenutzerDO>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<VersionedDataTransferObject>(new UriBuilder().fromPath(this.getUrl()).path(id).build())
          .then((data: VersionedDataTransferObject) => {

            resolve({result: RequestResult.SUCCESS, payload: fromPayload(data)});

          }, (error: HttpErrorResponse) => {

            if (error.status === 0) {
              reject({result: RequestResult.CONNECTION_PROBLEM});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    });
  }

}
