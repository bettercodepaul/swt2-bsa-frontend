import {HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {
  DataProviderService,
  RequestResult,
  BogenligaResponse,
  RestClient,
  UriBuilder,
  VersionedDataTransferObject
} from '../../shared/data-provider';
import {CurrentUserService} from '../../shared/services/current-user';
import {fromPayloadArray} from '../mapper/mannschaftmitglied-mapper';
import {MannschaftsmitgliedDO} from '../types/mannschaftsmitglied-do.class';

@Injectable({
  providedIn: 'root'
})
export class MannschaftsmitgliederDataProviderService extends DataProviderService {

  serviceSubUrl = 'v1/mannschaftsmitglied';

  constructor(private restClient: RestClient, private currentUserService: CurrentUserService) {
    super();
  }

  public findByMannschaftId(id: string | number): Promise<BogenligaResponse<MannschaftsmitgliedDO[]>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
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

}
