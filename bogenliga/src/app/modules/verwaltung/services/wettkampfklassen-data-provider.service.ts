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
import {fromPayload, fromPayloadArray} from '../mapper/wettkampfklasse-mapper';
import {WettkampfKlasseDO} from '../types/wettkampfklasse-do.class';


@Injectable({
  providedIn: 'root'
})
export class WettkampfklassenDataProviderService  extends DataProviderService {

  serviceSubUrl = 'v1/competitionclass';


  constructor(private restClient: RestClient, private currentUserService: CurrentUserService) {
    super();
  }

  public findAll(): Promise<BogenligaResponse<WettkampfKlasseDO[]>> {
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

  public findBySearch(searchTerm: string): Promise<BogenligaResponse<WettkampfKlasseDO[]>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return (searchTerm === "" || searchTerm === null)
      ? this.findAll()
      : new Promise( (resolve, reject) => {
        this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path('search/' + searchTerm).build())
            .then((data: VersionedDataTransferObject[]) => {
              resolve({result: RequestResult.SUCCESS, payload: fromPayloadArray(data)});
            }, (error: HttpErrorResponse) => {
              (error.status === 0)
                ? reject({result: RequestResult.CONNECTION_PROBLEM})
                : reject({result: RequestResult.FAILURE});
            });
      });
  }
  public findById(id: string | number): Promise<BogenligaResponse<WettkampfKlasseDO>> {
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

  public update(payload: VersionedDataTransferObject): Promise<BogenligaResponse<WettkampfKlasseDO>> {
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
  public create(payload: WettkampfKlasseDO): Promise<BogenligaResponse<WettkampfKlasseDO>> {
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
}
