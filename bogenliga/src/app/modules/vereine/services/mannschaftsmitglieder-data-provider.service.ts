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
import {VereineDO} from '../types/vereine-do.class';
import {fromPayload, fromPayloadArray} from '../mapper/vereine-mapper';

@Injectable({
  providedIn: 'root'
})
export class MannschaftsmitgliederDataProviderService extends DataProviderService {

  serviceSubUrl = 'v1/vereine';


  constructor(private restClient: RestClient, private currentUserService: CurrentUserService) {
    super();
  }

  public findById(id: string | number): Promise<Response<MannschaftsMitgliedDO>> {
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
