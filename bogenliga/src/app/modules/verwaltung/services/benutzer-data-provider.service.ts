import {Injectable} from '@angular/core';

import {
  DataProviderService,
  RequestResult,
  Response,
  RestClient,
  UriBuilder,
  VersionedDataTransferObject
} from '../../shared/data-provider';
import {CurrentUserService} from '../../shared/services/current-user';
import {HttpErrorResponse} from '@angular/common/http';
import {BenutzerDO} from '../types/benutzer-do.class';
import {fromPayload, fromPayloadArray} from '../mapper/benutzer-mapper';
import {fromPayloadBenutzerRolle, fromPayloadArrayBenutzerRolle} from '../mapper/benutzer-rolle-mapper';
import {CredentialsDTO} from "../../user/types/model/credentials-dto.class";
import {BenutzerRolleDO} from "../types/benutzer-rolle-do.class";
import {BenutzerRolleDTO} from "../types/datatransfer/benutzer-rolle-dto.class";

@Injectable({
  providedIn: 'root'
})
export class BenutzerDataProviderService extends DataProviderService {

  serviceSubUrl = 'v1/user';

  constructor(private restClient: RestClient, private currentUserService: CurrentUserService) {
    super();
  }

  public create(payload: CredentialsDTO): Promise<Response<BenutzerDO>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.POST<VersionedDataTransferObject>(new UriBuilder().fromPath(this.getUrl()).path("create").build(), payload)
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

  public update(payload: BenutzerRolleDTO): Promise<Response<BenutzerDO>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.PUT<VersionedDataTransferObject>(new UriBuilder().fromPath(this.getUrl()).path("uptRole").build(), payload)
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

  public deleteById(id: number): Promise<Response<void>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.DELETE<void>(new UriBuilder().fromPath(this.getUrl()).path(id).build())
          .then(noData => {
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


  public findAll(): Promise<Response<BenutzerRolleDO[]>> {
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


  public findUserRoleById(id: string | number): Promise<Response<BenutzerRolleDO>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<VersionedDataTransferObject>(new UriBuilder().fromPath(this.getUrl()).path("userrole").path(id).build())
        .then((data: VersionedDataTransferObject) => {

          resolve({result: RequestResult.SUCCESS, payload: fromPayloadBenutzerRolle(data)});

        }, (error: HttpErrorResponse) => {

          if (error.status === 0) {
            reject({result: RequestResult.CONNECTION_PROBLEM});
          } else {
            reject({result: RequestResult.FAILURE});
          }
        });
    });
  }



  public findById(id: string | number): Promise<Response<BenutzerDO>> {
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
