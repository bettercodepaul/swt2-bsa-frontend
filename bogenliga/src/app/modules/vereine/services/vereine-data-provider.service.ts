import {
  DataProviderService,
  RequestResult,
  Response,
  RestClient,
  VersionedDataTransferObject
} from '../../shared/data-provider';
import {CurrentUserService} from '../../shared/services/current-user';
import {VereinDO} from '../types/vereine-do.class';
import {Injectable} from '@angular/core';
import {fromPayloadArray} from '../mapper/vereine-mapper';
import {HttpErrorResponse} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class VereineDataProviderService extends DataProviderService{

  serviceSubUrl = 'v1/vereine';

  constructor(private restClient: RestClient, private currentUserService: CurrentUserService) {
    super();
  }

  public findAll(): Promise<Response<VereinDO[]>> {
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
