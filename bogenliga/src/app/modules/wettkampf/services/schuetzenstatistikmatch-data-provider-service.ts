import {HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {
  BogenligaResponse,
  DataProviderService,
  RequestResult,
  RestClient,
  UriBuilder,
  VersionedDataTransferObject
} from '@shared/data-provider';
import {CurrentUserService} from '@shared/services';
import {fromPayloadArray} from '@verwaltung/mapper/schuetzenstatistikmatch-mapper';
import {SchuetzenstatistikMatchDO} from '@verwaltung/types/schuetzenstatistikmatch-do.class';

@Injectable({
  providedIn: 'root'
})
export class SchuetzenstatistikMatchDataProviderService extends DataProviderService {

  serviceSubUrl = 'v1/schuetzenstatistikmatch';


  constructor(private restClient: RestClient, private currentUserService: CurrentUserService) {
    super();
  }

  public getSchuetzenstatistikMatchVeranstaltung(vereinId: string | number, veranstaltungId: string | number): Promise<BogenligaResponse<SchuetzenstatistikMatchDO[]>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder()
        .fromPath(this.getUrl())
        .path('byVeranstaltungAndVerein/' + veranstaltungId + '/' + vereinId)
        .build())
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

  public getSchuetzenstatistikMatchWettkampf(vereinId: string | number, wettkampfId: string | number, tag: string | number): Promise<BogenligaResponse<SchuetzenstatistikMatchDO[]>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder()
        .fromPath(this.getUrl())
        .path('byWettkampfAndVereinAndTag/' + wettkampfId + '/' + vereinId + '/' + tag)
        .build())
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
