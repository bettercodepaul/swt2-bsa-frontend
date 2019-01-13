import { Injectable } from '@angular/core';
import {fromPayload, fromPayloadArray} from '../mapper/sportjahr-mapper';
import {
  DataProviderService,
  RequestResult,
  Response,
  RestClient, UriBuilder,
  VersionedDataTransferObject
} from '../../shared/data-provider';
import {CurrentUserService} from '../../shared/services/current-user';
import {HttpErrorResponse} from '@angular/common/http';
import {SportjahrDO} from '../types/sportjahr-do.class';

@Injectable({
  providedIn: 'root'
})
export class SportjahrDataProviderService extends DataProviderService {
  serviceSubUrl = 'v1/sportjahr';


  constructor(private restClient: RestClient, private currentUserService: CurrentUserService) {
    super();
  }
  public findAllById(id: string | number): Promise<Response<SportjahrDO[]>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path("liga/" + id).build())
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
}
