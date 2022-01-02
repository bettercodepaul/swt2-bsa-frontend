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
import {Oligatabelle} from '../types/oligatabelle.interface';
import {fromPayloadLigatabelleErgebnisArray} from '@wettkampf/mapper/wettkampf-ergebnis-mapper';
import {fromPayloadOligatabelleArray} from '../mapper/oligatabelle-mapper';


@Injectable({
  providedIn: 'root'
})
export class SyncDataProviderService extends DataProviderService {

  serviceSubUrl = 'v1/sync';


  constructor(private restClient: RestClient, private currentUserService: CurrentUserService) {
    super();
  }

  public loadLigatabelleVeranstaltung(id: string | number): Promise<BogenligaResponse<Oligatabelle[]>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path('veranstaltung=' + id).build())
        .then((data: VersionedDataTransferObject[]) => {
          resolve({result: RequestResult.SUCCESS, payload: fromPayloadOligatabelleArray(data)});
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
