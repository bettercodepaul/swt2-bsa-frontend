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

@Injectable({
  providedIn: 'root'
})

export class PasseDataProviderService extends DataProviderService {

  serviceSubUrl = 'v1/passe';

  constructor(private restClient: RestClient) {
    super();
  }

  public findByWettkampfIdAndDsbMitgliedId(wettkampfId: number, dsbMitgliedId: number): Promise<BogenligaResponse<PasseDTOClass[]>> {
    return new Promise((resolve, reject) => {
      this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path('byWettkampfIdAndDsbMitgliedId/' + wettkampfId + '/' + dsbMitgliedId).build())
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
