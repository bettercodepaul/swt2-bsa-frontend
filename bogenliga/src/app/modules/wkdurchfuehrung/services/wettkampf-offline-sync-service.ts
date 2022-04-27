import {HttpErrorResponse} from '@angular/common/http';
import {BoundElementProperty} from '@angular/compiler';
import {Injectable} from '@angular/core';
import {
  BogenligaResponse,
  DataProviderService, DataTransferObject,
  RequestResult,
  RestClient,
  UriBuilder,
  VersionedDataTransferObject
} from '@shared/data-provider';
import {
  OfflineLigatabelle
} from '@shared/data-provider/offlinedb/types/offline-ligatabelle.interface';
import {
  fromPayloadOfflineLigatabelleArray
} from '../../ligatabelle/mapper/ligatabelle-offline-mapper';
import {db} from '@shared/data-provider/offlinedb/offlinedb';
import {fromOfflineMatchPayloadArray} from "@verwaltung/mapper/match-offline-mapper";
import {OfflineMatch} from "@shared/data-provider/offlinedb/types/offline-match.interface";

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

  public loadMatchOffline(id: string | number): void {
    this.loadMatch(id)
    .then((response: BogenligaResponse<OfflineMatch[]>) => {
      db.matchTabelle.bulkAdd(response.payload).then((value) => {
        console.log('offline match added to offlinedb', value);
      });
    })
    .catch((response: BogenligaResponse<OfflineMatch[]>) => {
      console.log('error loading offline match payload:', response.payload);
    });
  }

  private loadMatch(id: string | number): Promise<BogenligaResponse<OfflineMatch[]>> {

    // Call REST-API
    const url = new UriBuilder().fromPath(this.getUrl()).path('wettkampf=' + id).build();
    return new Promise<BogenligaResponse<OfflineMatch[]>>((resolve, reject) => {
      this.restClient.GET<OfflineMatch[]>(url)
      // Resolve the request and use the offline match mapper
      .then((data: DataTransferObject[]) => {
        resolve({result: RequestResult.SUCCESS, payload: fromOfflineMatchPayloadArray(data)});
      }, (error: HttpErrorResponse) => WettkampfOfflineSyncService.handleErrorResponse(error, reject));
    });
  }

  private loadLigatabelleVeranstaltung(id: string | number): Promise<BogenligaResponse<OfflineLigatabelle[]>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path('veranstaltung=' + id).build())
      .then((data: VersionedDataTransferObject[]) => {
        resolve({result: RequestResult.SUCCESS, payload: fromPayloadOfflineLigatabelleArray(data)});
      }, (error: HttpErrorResponse) => WettkampfOfflineSyncService.handleErrorResponse(error, reject));
    });
  }


  private handleLoadLigatabelleVeranstaltungSuccess(offlineLigatabelle: BogenligaResponse<OfflineLigatabelle[]>): void {
    db.ligaTabelle.bulkAdd(offlineLigatabelle.payload)
    .then((lastNumber) => console.log('Finished adding numbers til ' + lastNumber))
    .catch((e) => console.error(e));
  }

  private handleLoadLigatabelleVeranstaltungFailure(_response: BogenligaResponse<OfflineLigatabelle[]>): void {
    console.log('Failure');
  }

  // noinspection JSMethodCanBeStatic
  private handleErrorResponse(error: HttpErrorResponse, reject: (reason?: any) => void): void {
    if (error.status === 0) {
      reject({result: RequestResult.CONNECTION_PROBLEM});
    } else {
      reject({result: RequestResult.FAILURE});
    }
  }
}
