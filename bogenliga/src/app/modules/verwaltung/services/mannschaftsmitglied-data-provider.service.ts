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
import {CurrentUserService} from '@shared/services';
import {fromPayload, fromPayloadArray} from '../mapper/mannschaftsmitglied-mapper';
import {MannschaftsMitgliedDO} from '../types/mannschaftsmitglied-do.class';
import {from} from 'rxjs';


/**
 * TODO check usage
 */
@Injectable({
  providedIn: 'root'
})
export class MannschaftsmitgliedDataProviderService extends DataProviderService {

  serviceSubUrl = 'v1/mannschaftsmitglied';

  constructor(private restClient: RestClient, private currentUserService: CurrentUserService) {
    super();
  }

  public create(payload: MannschaftsMitgliedDO): Promise<BogenligaResponse<MannschaftsMitgliedDO>> {
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


  public deleteByMannschaftIdAndDsbMitgliedId(teamId: number, memberId: number): Promise<BogenligaResponse<void>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.DELETE<void>(new UriBuilder().fromPath(this.getUrl()).path(teamId + '/' + memberId).build())
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


  public findAll(): Promise<BogenligaResponse<MannschaftsMitgliedDO[]>> {
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


  public findById(id: string | number): Promise<BogenligaResponse<MannschaftsMitgliedDO>> {
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

  public findByMemberId(id: string | number): Promise<BogenligaResponse<MannschaftsMitgliedDO[]>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> resolve promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path('byMemberId/' + id).build())
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

  public findByMemberAndTeamId(memberId: string | number, teamId:string | number): Promise<BogenligaResponse<MannschaftsMitgliedDO>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> resolve promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<VersionedDataTransferObject>(new UriBuilder().fromPath(this.getUrl()).path(memberId).path(teamId).build())
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

  public findAllByTeamId(id: string | number): Promise<BogenligaResponse<MannschaftsMitgliedDO[]>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> resolve promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path(id).build())
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

  public update(payload: VersionedDataTransferObject): Promise<BogenligaResponse<MannschaftsMitgliedDO>> {
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
