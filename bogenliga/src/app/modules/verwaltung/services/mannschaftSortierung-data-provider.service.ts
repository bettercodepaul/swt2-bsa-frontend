import {Injectable} from '@angular/core';
import {
  BogenligaResponse,
  DataProviderService, RequestResult,
  RestClient,
  UriBuilder,
  VersionedDataTransferObject
} from '@shared/data-provider';
import {CurrentUserService} from '@shared/services';
import {UserRolleDTO} from '@verwaltung/types/datatransfer/user-rolle-dto.class';
import {UserDO} from '@verwaltung/types/user-do.class';
import {fromPayloadArray} from '@verwaltung/mapper/user-mapper';
import {HttpErrorResponse} from '@angular/common/http';
import {MannschaftSortierungDTO} from '@verwaltung/types/datatransfer/mannschaftSortierung-dto.class';
import {MannschaftSortierungDO} from '@verwaltung/types/mannschaftSortierung-do.class';
import {fromPayload} from '@verwaltung/mapper/mannschaftSortierung-mapper';

@Injectable({
  providedIn: 'root'
})
export class MannschaftSortierungDataProviderService extends DataProviderService {

  serviceSubUrl = 'v1/dsbmannschaft/sortierung';

  constructor(private restClient: RestClient, private currentUserService: CurrentUserService) {
    super();
  }

  public update(payload: MannschaftSortierungDTO): Promise<BogenligaResponse<MannschaftSortierungDO>> {
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
