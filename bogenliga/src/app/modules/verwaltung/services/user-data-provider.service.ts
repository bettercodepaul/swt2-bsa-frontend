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
import {fromPayload, fromPayloadArray} from '../mapper/user-mapper';
import {fromPayloadArrayUserRolle, fromPayloadUserRolle} from '../mapper/user-rolle-mapper';
import {UserDO} from '../types/user-do.class';
import {UserRolleDO} from '../types/user-rolle-do.class';
import {UserRolleDTO} from '../types/datatransfer/user-rolle-dto.class';

@Injectable({
  providedIn: 'root'
})
export class UserDataProviderService extends DataProviderService {

  serviceSubUrl = 'v1/user';

  constructor(private restClient: RestClient, private currentUserService: CurrentUserService) {
    super();
  }

  public create(payload: CredentialsDTO): Promise<BogenligaResponse<UserDO>> {
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

  public updateRole(payload: Array<UserRolleDTO>): Promise<BogenligaResponse<Array<UserDO>>> {
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

  public resetPW(payload: CredentialsDTO): Promise<BogenligaResponse<Array<UserDO>>> {

    return new Promise((resolve, reject) => {
      const newCredentialsDTO = new CredentialsDTO(payload.username, payload.password, payload.dsbMitgliedId, payload.using2FA, payload.code);
      this.sendUpdateRequest(newCredentialsDTO, resolve, reject);
    });
  }

  public sendUpdateRequest(payload: CredentialsDTO, resolve, reject) {
    this.restClient.PUT<VersionedDataTransferObject>(new UriBuilder().fromPath(this.getUrl()).path('resetPW').build(), payload)
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


  public findAll(): Promise<BogenligaResponse<UserRolleDO[]>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<Array<VersionedDataTransferObject>>(this.getUrl())
          .then((data: VersionedDataTransferObject[]) => {

            resolve({result: RequestResult.SUCCESS, payload: fromPayloadArrayUserRolle(data)});

          }, (error: HttpErrorResponse) => {

            if (error.status === 0) {
              reject({result: RequestResult.CONNECTION_PROBLEM});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    });
  }


  public findUserRoleById(id: string | number): Promise<BogenligaResponse<UserRolleDO[]>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<VersionedDataTransferObject[]>(new UriBuilder().fromPath(this.getUrl()).path('userrole').path(id).build())
        .then((data: VersionedDataTransferObject[]) => {

          resolve({result: RequestResult.SUCCESS, payload: fromPayloadArrayUserRolle(data)});

        }, (error: HttpErrorResponse) => {

          if (error.status === 0) {
            reject({result: RequestResult.CONNECTION_PROBLEM});
          } else {
            reject({result: RequestResult.FAILURE});
          }
        });
    });
  }


  /**
   * returns promise that includes List of all users with the role "roleId"
   * sign in success -> resolve promise
   * sign in failure -> reject promise with result
   * @param roleId
   */
  public findAllUsersByRoleId(roleId: string | number): Promise<BogenligaResponse<UserRolleDO[]>> {
    return new Promise((resolve, reject) => {

      this.restClient.GET<VersionedDataTransferObject[]>(new UriBuilder().fromPath(this.getUrl())
         .path('allusersbyrole').path(roleId).build()).then((data: VersionedDataTransferObject[]) => {

            resolve({result: RequestResult.SUCCESS, payload: fromPayloadArrayUserRolle(data)});

          }, (error: HttpErrorResponse) => {

            if (error.status === 0) {
              reject({result: RequestResult.CONNECTION_PROBLEM});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    });
  }


  public findById(id: string | number): Promise<BogenligaResponse<UserDO>> {
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
