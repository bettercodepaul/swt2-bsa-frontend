import {
  DataProviderService,
  RequestResult,
  Response,
  RestClient,
  VersionedDataTransferObject
} from '../../shared/data-provider';
import {CurrentUserService} from '../../shared/services/current-user';

import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {MannschaftDO} from "../../mannschaft/types/mannschaft-do.class";
import {fromPayloadArray} from "../../mannschaft/mapper/mannschaft-mapper";

@Injectable({
  providedIn: 'root'
})

export class MannschaftDataProviderService extends DataProviderService{

  serviceSubUrl = "v1/mannschaft"

  constructor(private restClient: RestClient, private currentUserService: CurrentUserService) {
    super();
  }

  public findAll(): Promise<Response<MannschaftDO[]>> {
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


}
