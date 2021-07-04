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
import {fromPayloadLigatabelleErgebnisArray} from '../mapper/wettkampf-ergebnis-mapper';
import {LigatabelleErgebnisDO} from '../types/wettkampf-ergebnis-do.class';

@Injectable({
  providedIn: 'root'
})
export class SchuetzenstatistikDataProviderService extends DataProviderService {

  serviceSubUrl = 'v1/schuetzenstatistik';


  constructor(private restClient: RestClient, private currentUserService: CurrentUserService) {
    super();
  }

  public getSchuetzenstatistikVeranstaltung(vereinId: string | number, veranstaltungId: string | number): Promise<BogenligaResponse<LigatabelleErgebnisDO[]>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder()
        .fromPath(this.getUrl())
        .path('verein=' + vereinId)
        .path('&veranstaltung=' + veranstaltungId)
        .build())
        .then((data: VersionedDataTransferObject[]) => {
          resolve({result: RequestResult.SUCCESS, payload: fromPayloadLigatabelleErgebnisArray(data)});
        }, (error: HttpErrorResponse) => {

          if (error.status === 0) {
            reject({result: RequestResult.CONNECTION_PROBLEM});
          } else {
            reject({result: RequestResult.FAILURE});
          }
        });
    });
  }
  public getSchuetzenstatistikWettkampf(vereinId: string | number, wettkampfId: string | number): Promise<BogenligaResponse<LigatabelleErgebnisDO[]>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder()
        .fromPath(this.getUrl())
        .path('verein=' + vereinId)
        .path('wettkampf=' + wettkampfId)
        .build())
        .then((data: VersionedDataTransferObject[]) => {
          resolve({result: RequestResult.SUCCESS, payload: fromPayloadLigatabelleErgebnisArray(data)});
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
