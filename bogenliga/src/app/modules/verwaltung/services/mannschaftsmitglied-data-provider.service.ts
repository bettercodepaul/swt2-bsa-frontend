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
import {DsbMannschaftDO} from '../types/dsb-mannschaft-do.class';
import {MannschaftsMitgliedDO} from '../types/mannschaftsmitglied-do.class';
import {fromPayload, fromPayloadArray} from '../mapper/dsb-mannschaft-mapper';

@Injectable({
  providedIn: 'root'
})
export class MannschaftsmitgliedDataProviderService extends DataProviderService {

  serviceSubUrl = 'v1/mannschaftsmitglied';

  constructor(private restClient: RestClient, private currentUserService: CurrentUserService) {
    super();
  }

  public create(payload: MannschaftsMitgliedDO): Promise<Response<MannschaftsMitgliedDO>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.POST<VersionedDataTransferObject>(new UriBuilder().fromPath(this.getUrl()).build(), payload)
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


  public findAll(): Promise<Response<MannschaftsMitgliedDO[]>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<Array<VersionedDataTransferObject>>(this.getUrl())
        .then((data: VersionedDataTransferObject[]) => {

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


  public findById(id: string | number): Promise<Response<DsbMannschaftDO>> {
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

  public update(payload: VersionedDataTransferObject): Promise<Response<DsbMannschaftDO>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.PUT<VersionedDataTransferObject>(new UriBuilder().fromPath(this.getUrl()).build(), payload)
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
