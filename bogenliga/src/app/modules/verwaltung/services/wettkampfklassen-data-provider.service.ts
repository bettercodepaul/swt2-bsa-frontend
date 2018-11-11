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
import {WettkampfKlasseDO} from '../types/wettkampfklasse-do.class';
import {fromPayload, fromPayloadArray} from '../mapper/wettkampfklasse-mapper';

@Injectable({
  providedIn: 'root'
})
export class WettkampfklassenDataProviderService  extends DataProviderService {

  serviceSubUrl = 'v1/competitionclass';


  constructor(private restClient: RestClient, private currentUserService: CurrentUserService) {
    super();
  }

  public findAll(): Promise<Response<WettkampfKlasseDO[]>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<Array<VersionedDataTransferObject>>(this.getUrl())
          .then((data: VersionedDataTransferObject[]) => {
            console.log(data);
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

