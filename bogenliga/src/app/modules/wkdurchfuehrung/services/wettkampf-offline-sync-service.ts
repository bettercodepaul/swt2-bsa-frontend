import {HttpErrorResponse} from '@angular/common/http';
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
import {fromOfflineMatchPayloadArray} from '@verwaltung/mapper/match-offline-mapper';
import {OfflineMatch} from '@shared/data-provider/offlinedb/types/offline-match.interface';
import {OfflinePasse} from '@shared/data-provider/offlinedb/types/offline-passe.interface';
import {fromOfflinePassePayloadArray} from '@verwaltung/mapper/passe-offline-mapper';
import {OfflineWettkampf} from "@shared/data-provider/offlinedb/types/offline-wettkampf.interface";
import {fromOfflineWettkampfPayloadArray} from '@verwaltung/mapper/wettkampf-offline-mapper';
import {WettkampfDataProviderService} from '@verwaltung/services/wettkampf-data-provider.service';

@Injectable({
  providedIn: 'root'
})
export class WettkampfOfflineSyncService extends DataProviderService {

  serviceSubUrl = 'v1/sync';


  constructor(private restClient: RestClient, private wettkampfDataProvider: WettkampfDataProviderService) {
    super();
  }
  // The following methods define the REST calls and how to convert the returned JSON payload to the known entity types
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
  public loadPasseOffline(id: string | number): void {
    this.loadPasse(id)
    .then((response: BogenligaResponse<OfflinePasse[]>) => {
      db.passeTabelle.bulkAdd(response.payload).then((value) => {
        console.log('offline passe added to offlinedb', value);
      });
    })
    .catch((response: BogenligaResponse<OfflinePasse[]>) => {
      console.log('error loading offline passe payload:', response.payload);
    });
  }
  public loadWettkampfOffline(id: string | number): void {
    this.loadWettkampf(id)
    .then((response: BogenligaResponse<OfflineWettkampf[]>) => {
      db.wettkampfTabelle.bulkAdd(response.payload).then((value) => {
        console.log('Offline Wettkampf added to offlinedb', value);
      });
    })
    .catch((response: BogenligaResponse<OfflineMatch[]>) => {
      console.log('error loading offline wettkampf payload:', response.payload);
    });
  }
  // The following methods are merely convenience methods for calling the
  // generic load method for the corresponding REST service.
  private loadMatch(id: string | number): Promise<BogenligaResponse<OfflineMatch[]>> {

    // Call REST-API
    const url = new UriBuilder().fromPath(this.getUrl()).path('match=' + id).build();
    return new Promise<BogenligaResponse<OfflineMatch[]>>((resolve, reject) => {
      this.restClient.GET<OfflineMatch[]>(url)
      // Resolve the request and use the offline match mapper
      .then((data: DataTransferObject[]) => {
        resolve({result: RequestResult.SUCCESS, payload: fromOfflineMatchPayloadArray(data)});
      }, (error: HttpErrorResponse) => this.handleErrorResponse(error, reject));
    });
  }
  private loadPasse(id: string | number): Promise<BogenligaResponse<OfflinePasse[]>> {

    // Build url
    const url = new UriBuilder().fromPath(this.getUrl()).path('passe=' + id).build();

    return new Promise<BogenligaResponse<OfflinePasse[]>>((resolve, reject) => {
      // Call the builded url
      this.restClient.GET<OfflinePasse[]>(url)
      // Resolve the request and use the offline passe mapper
      .then((data: DataTransferObject[]) => {
        // payload -> passe array
        resolve({result: RequestResult.SUCCESS, payload: fromOfflinePassePayloadArray(data)});
      }, (error: HttpErrorResponse) => this.handleErrorResponse(error, reject));
    });

  }
  private loadWettkampf(id: string | number): Promise<BogenligaResponse<OfflineWettkampf[]>> {

    // Build url
    const url = new UriBuilder().fromPath(this.getUrl()).path('wettkampf=' + id).build();

    return new Promise<BogenligaResponse<OfflineWettkampf[]>>((resolve, reject) => {
      // Call the builded url
      this.restClient.GET<Array<VersionedDataTransferObject>>(url)
      // Resolve the request and use the offline wettkampf mapper
      .then((data: VersionedDataTransferObject[]) => {
        // payload -> wettkampf array + id and version
        resolve({result: RequestResult.SUCCESS, payload: fromOfflineWettkampfPayloadArray(data)});
      }, (error: HttpErrorResponse) => this.handleErrorResponse(error, reject));
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
      }, (error: HttpErrorResponse) => this.handleErrorResponse(error, reject));
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
