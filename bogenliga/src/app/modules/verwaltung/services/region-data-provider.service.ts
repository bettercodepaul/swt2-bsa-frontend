import {Injectable} from '@angular/core';
import {
  DataProviderService,
  RequestResult,
  Response,
  RestClient,
  UriBuilder,
  VersionedDataTransferObject
} from '../../shared/data-provider';
import {HttpErrorResponse} from '@angular/common/http';
import {CurrentUserService} from '../../shared/services/current-user';
import {RegionDO} from '../types/region-do.class';
import {fromPayload, fromPayloadArray} from '../mapper/region-mapper';

@Injectable({
  providedIn: 'root'
})
export class RegionDataProviderService extends DataProviderService {

  serviceSubUrl = 'v1/regionen';


  constructor(private restClient: RestClient, private currentUserService: CurrentUserService) {
    super();
  }

  public findAll(): Promise<Response<RegionDO[]>> {
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
