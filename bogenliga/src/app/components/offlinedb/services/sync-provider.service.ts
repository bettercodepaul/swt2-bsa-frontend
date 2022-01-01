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
import {CurrentUserService} from '@shared/services/current-user';
import {fromPayload, fromPayloadArray, fromVeranstaltungsPayload} from '@verwaltung/mapper/match-mapper';
import {LigatabelleErgebnisDO} from '@wettkampf/types/wettkampf-ergebnis-do.class';
import {fromPayloadLigatabelleErgebnisArray} from '@wettkampf/mapper/wettkampf-ergebnis-mapper';


@Injectable({
  providedIn: 'root'
})
export class SyncDataProviderService extends DataProviderService {

  serviceSubUrl = 'v1/sync';


  constructor(private restClient: RestClient, private currentUserService: CurrentUserService) {
    super();
  }

  public loadLigatabelleVeranstaltung(id: string | number): Promise<BogenligaResponse<LigatabelleErgebnisDO[]>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path('veranstaltung=' + id).build())
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
