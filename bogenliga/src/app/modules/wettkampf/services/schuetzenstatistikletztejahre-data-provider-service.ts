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
import {fromPayloadArray} from '@verwaltung/mapper/schuetzenstatistikletztejahre-mapper';
import {SchuetzenstatistikLetzteJahreDO} from '@verwaltung/types/schuetzenstatistikletztejahre-do.class';

@Injectable({
  providedIn: 'root'
})
export class SchuetzenstatistikletztejahreDataProviderService extends DataProviderService {

  serviceSubUrl = 'v1/schuetzenstatistikletztejahre';

  constructor(private restClient: RestClient, private currentUserService: CurrentUserService) {
    super();
  }

  public getSchuetzenstatistikLetzteJahre(sportjahr: string | number, veranstaltungId: string | number, vereinId: string | number): Promise<BogenligaResponse<SchuetzenstatistikLetzteJahreDO[]>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder()
        .fromPath(this.getUrl())
        .path('bySportjahrAndVeranstaltungAndVerein/' + sportjahr + '/' + veranstaltungId + '/' + vereinId)
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
