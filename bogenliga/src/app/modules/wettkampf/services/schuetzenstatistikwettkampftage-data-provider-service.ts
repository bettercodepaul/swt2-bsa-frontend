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
import {fromPayloadArray} from '@verwaltung/mapper/schuetzenstatistikwettkampftage-mapper';
import {SchuetzenstatistikWettkampftageDO} from '@verwaltung/types/schuetzenstatistikwettkampftage-do.class';

@Injectable({
  providedIn: 'root'
})
export class SchuetzenstatistikwettkampftageDataProviderService extends DataProviderService {

  serviceSubUrl = 'v1/schuetzenstatistikwettkampf';


  constructor(private restClient: RestClient, private currentUserService: CurrentUserService) {
    super();
  }

  public getSchuetzenstatistikWettkampftageVeranstaltung(vereinId: string | number, veranstaltungId: string | number): Promise<BogenligaResponse<SchuetzenstatistikWettkampftageDO[]>> {
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

}
