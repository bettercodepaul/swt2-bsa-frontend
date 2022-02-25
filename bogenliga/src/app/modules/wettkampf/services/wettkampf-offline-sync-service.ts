import {HttpErrorResponse} from '@angular/common/http';
import { BoundElementProperty } from '@angular/compiler';
import {Injectable} from '@angular/core';
import {
  BogenligaResponse,
  DataProviderService,
  RequestResult,
  RestClient,
  UriBuilder,
  VersionedDataTransferObject
} from '@shared/data-provider';
import { OfflineLigatabelle } from '@shared/data-provider/offlinedb/types/offline-ligatabelle.interface';
import { fromPayloadOfflineLigatabelleArray } from '@wettkampf/mapper/ligatabelle-offline-mapper';
import { db } from '@shared/data-provider/offlinedb/offlinedb';

@Injectable({
  providedIn: 'root'
})
export class WettkampfOfflineSyncService extends DataProviderService {

  serviceSubUrl = 'v1/sync';


  constructor(private restClient: RestClient) {
    super();
  }

  public loadLigatabelleVeranstaltungOffline(id: string | number): void {
    this.loadLigatabelleVeranstaltung(id)
            .then((response: BogenligaResponse<OfflineLigatabelle[]>) => this.handleLoadLigatabelleVeranstaltungSuccess(response))
            .catch((response: BogenligaResponse<OfflineLigatabelle[]>) => this.handleLoadLigatabelleVeranstaltungFailure(response));
  }

  private loadLigatabelleVeranstaltung(id: string | number): Promise<BogenligaResponse<OfflineLigatabelle[]>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path('veranstaltung=' + id).build())
        .then((data: VersionedDataTransferObject[]) => {
          resolve({result: RequestResult.SUCCESS, payload: fromPayloadOfflineLigatabelleArray(data)});
        }, (error: HttpErrorResponse) => {

          if (error.status === 0) {
            reject({result: RequestResult.CONNECTION_PROBLEM});
          } else {
            reject({result: RequestResult.FAILURE});
          }
        });
    });
  }

  private handleLoadLigatabelleVeranstaltungSuccess(offlineLigatabelle: BogenligaResponse<OfflineLigatabelle[]>): void {
    db.ligaTabelle.bulkAdd(offlineLigatabelle.payload)
        .then((lastNumber) => console.log('Finished adding numbers til ' + lastNumber))
        .catch((e) => console.error(e));
  }

  private handleLoadLigatabelleVeranstaltungFailure(response: BogenligaResponse<OfflineLigatabelle[]>): void {
    console.log('Failure');
  }
}
