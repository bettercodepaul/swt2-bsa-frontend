import {Injectable} from '@angular/core';
import {
  BogenligaResponse,
  DataProviderService,
  RequestResult,
  RestClient,
  UriBuilder,
  VersionedDataTransferObject
} from '@shared/data-provider';
import {PasseDTOClass} from '@verwaltung/types/datatransfer/passe-dto.class';
import {fromPayloadArray} from '@verwaltung/mapper/passe-mapper';
import {HttpErrorResponse} from '@angular/common/http';
import {CurrentUserService} from '@shared/services';
import {PasseDoClass} from '@verwaltung/types/passe-do-class';

@Injectable({
  providedIn: 'root'
})

export class PasseDataProviderService extends DataProviderService {

  serviceSubUrl = 'v1/passen';

  constructor(private restClient: RestClient, private currentUserService: CurrentUserService) {
    super();
  }

  public findByWettkampfId(wettkampfId: number): Promise<BogenligaResponse<PasseDTOClass[]>> {
    return new Promise((resolve, reject) => {
      this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path('findByWettkampfId/wettkampfid=' + wettkampfId).build())
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

  findAll(): Promise<BogenligaResponse<PasseDoClass[]>> {
    return new Promise((resolve, reject) => {
      this.restClient.GET<Array<VersionedDataTransferObject>>(this.getUrl() + '/')
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
