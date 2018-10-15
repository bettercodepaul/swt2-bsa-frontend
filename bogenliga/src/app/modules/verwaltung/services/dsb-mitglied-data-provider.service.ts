import {Injectable} from '@angular/core';

import {
  CommonDataProviderService,
  DataTransferObject,
  RequestResult,
  Response,
  RestClient,
  UriBuilder,
  VersionedDataTransferObject
} from '../../shared/data-provider';
import {CurrentUserService} from '../../shared/services/current-user';
import {Observable} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {TransferObject} from '../../shared/data-provider/models/transfer-object.interface';
import {DsbMitgliedDO} from '../types/dsb-mitglied-do.class';
import {fromPayload, fromPayloadArray} from '../mapper/dsb-mitglied-mapper';

@Injectable({
  providedIn: 'root'
})
export class DsbMitgliedDataProviderService extends CommonDataProviderService {

  serviceSubUrl = 'v1/dsbmitglied';

  constructor(private restClient: RestClient, private currentUserService: CurrentUserService) {
    super();
  }

  addOne(payload: DataTransferObject): Observable<DataTransferObject> {
    return undefined;
  }

  deleteById2(id: number): Promise<any> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.DELETE(new UriBuilder().fromPath(this.getUrl()).path(id).build())
          .subscribe(noData => {
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


  public findAll2(): Promise<Response<DsbMitgliedDO[]>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET(this.getUrl())
          .subscribe((data: VersionedDataTransferObject[]) => {

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


  findById2(id: number): Promise<Response<DsbMitgliedDO>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET(new UriBuilder().fromPath(this.getUrl()).path(id).build())
          .subscribe((data: VersionedDataTransferObject) => {

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

  update(payload: DataTransferObject): Observable<DataTransferObject> {
    return undefined;
  }

  findAll(): Observable<TransferObject[]> {
    return this.restClient.GET(this.getUrl());
  }

  findById(key: string | number): Observable<TransferObject> {
    return undefined;
  }

  deleteById(key: string | number): Observable<any> {
    return undefined;
  }
}
