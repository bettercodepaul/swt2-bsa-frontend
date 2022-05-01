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
import {OfflineWettkampf} from '@shared/data-provider/offlinedb/types/offline-wettkampf.interface';
import {fromOfflineWettkampfPayloadArray} from '@verwaltung/mapper/wettkampf-offline-mapper';
import {
  OfflineMannschaft
} from '@shared/data-provider/offlinedb/types/offline-mannschaft.interface';
import {fromOfflineMannschaftPayloadArray} from '@verwaltung/mapper/mannschaft-offline-mapper';
import {
  OfflineMannschaftsmitglied
} from '@shared/data-provider/offlinedb/types/offline-mannschaftsmitglied.interface';
import {
  fromOfflineMannschaftsmitgliedPayloadArray
} from '@verwaltung/mapper/mannschaftsmitglied-offline-mapper';
import {
  OfflineDsbMitglied
} from '@shared/data-provider/offlinedb/types/offline-dsbmitglied.interface';
import {fromOfflineDsbMitgliedPayloadArray} from '@verwaltung/mapper/dsb-mitglied-offline.mapper';
import {
  OfflineVeranstaltung
} from "@shared/data-provider/offlinedb/types/offline-veranstaltung.interface";
import {
  fromOfflineVeranstaltungPayloadArray
} from "@verwaltung/mapper/veranstaltung-offline-mapper";

@Injectable({
  providedIn: 'root'
})
export class WettkampfOfflineSyncService extends DataProviderService {

  serviceSubUrl = 'v1/sync';


  constructor(private restClient: RestClient) {
    super();
  }

  // The following methods define the REST calls and how to convert the returned JSON payload to the known entity types
  public loadLigatabelleVeranstaltungOffline(id: string | number): void {
    this.loadLigatabelleVeranstaltung(id)
    .then((response: BogenligaResponse<OfflineLigatabelle[]>) => this.handleLoadLigatabelleVeranstaltungSuccess(response))
    .catch((response: BogenligaResponse<OfflineLigatabelle[]>) => this.handleLoadLigatabelleVeranstaltungFailure(response));
  }

  /**
   * Calls the corresponding REST-API method and returns the result as Promise
   * Doesn't return anything but fills the OfflineDb with the data!
   * @param id  wettkampfId to which the matches belongs
   *
   * @author Dennis Bär
   */
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

  /**
   * Calls the corresponding REST-API method and returns the result as Promise
   * Doesn't return anything but fills the OfflineDb with the data!
   * @param id tbd
   *
   * @author Dennis Bär
   */
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

  /**
   * Calls the corresponding REST-API method and returns the result as Promise
   * Doesn't return anything but fills the OfflineDb with the data!
   * @param id tbd
   *
   * @author Dennis Bär
   */
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

  /**
   * Calls the corresponding REST-API method and returns the result as Promise
   * Doesn't return anything but fills the OfflineDb with the data!
   * @param id tbd
   *
   * @author Dennis Bär
   */
  public loadMannschaftOffline(id: string | number): void {
    this.loadMannschaft(id)
    .then((response: BogenligaResponse<OfflineMannschaft[]>) => {
      db.mannschaftTabelle.bulkPut(response.payload, response.payload.map((item) => item.id)).then((value) => {
        console.log('Offline Mannschaft added to offlinedb', value);
      });
    })
    .catch((response: BogenligaResponse<OfflineMannschaft[]>) => {
      console.log('error loading offline mannschaft payload:', response.payload);
    });
  }

  /**
   * Calls the corresponding REST-API method and returns the result as Promise
   * Doesn't return anything but fills the OfflineDb with the data!
   * @param id tbd
   *
   * @author Dennis Bär
   */
  public loadMannschaftsmitgliedOffline(id: string | number): void {
    this.loadMannschaftsmitglied(id)
    .then((response: BogenligaResponse<OfflineMannschaftsmitglied[]>) => {
      // bulk add to offline db with id as primary key
      db.mannschaftsmitgliedTabelle.bulkPut(response.payload, response.payload.map((item) => item.id)).then((lastKey) => {
        console.log('Offline Mannschaftsmitglied added to offlinedb', lastKey);
      });
    })
    .catch((response: BogenligaResponse<OfflineMannschaftsmitglied[]>) => {
      console.log('error loading offline mannschaftsmitglied payload:', response.payload);
    });
  }

  /**
   * Calls the corresponding REST-API method and returns the result as Promise
   * Doesn't return anything but fills the OfflineDb with the data!
   * @param id tbd
   *
   * @author Dennis Bär
   */
  public loadDsbMitgliedOffline(id: string | number): void {
    this.loadDsbMitglied(id)
    .then((response: BogenligaResponse<OfflineDsbMitglied[]>) => {
      // bulk add to offline db with id as primary key
      db.dsbMitgliedTabelle.bulkPut(response.payload, response.payload.map((item) => item.id)).then((lastKey) => {
        console.log('Offline DsbMitglied added to offlinedb', lastKey);
      });
    })
    .catch((response: BogenligaResponse<OfflineDsbMitglied[]>) => {
      console.log('error loading offline dsbmitglied payload:', response.payload);
    });
  }

  /**
   * Calls the corresponding REST-API method and returns the result as Promise
   * Doesn't return anything but fills the OfflineDb with the data!
   * @param id tbd
   *
   * @author Dennis Bär
   */
  public loadVeranstaltungOffline(id: string | number): void {
    this.loadVeranstaltung(id)
    .then((response: BogenligaResponse<OfflineVeranstaltung[]>) => {
      // bulk add to offline db with id as primary key
      db.veranstaltungTabelle.bulkPut(response.payload, response.payload.map((item) => item.id)).then((lastKey) => {
        console.log('Offline Veranstaltung added to offlinedb', lastKey);
      });
    })
    .catch((response: BogenligaResponse<OfflineVeranstaltung[]>) => {
      console.log('error loading offline veranstaltung payload:', response.payload);
    });
  }

  /**
   * Calls the corresponding REST-API method and returns the result as Promise
   * @param {string} id - the wettkampf id
   * @author Dennis Bär
   */

  private loadMatch(id: string | number): Promise<BogenligaResponse<OfflineMatch[]>> {

    // Call REST-API
    const url = new UriBuilder().fromPath(this.getUrl()).path('findByWettkampfIdOffline/wettkampfid=' + id).build();
    return new Promise<BogenligaResponse<OfflineMatch[]>>((resolve, reject) => {
      this.restClient.GET<OfflineMatch[]>(url)
      // Resolve the request and use the offline match mapper
      .then((data: DataTransferObject[]) => {
        console.log(`received ${data} from ${url}`);
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

  private loadMannschaft(id: string | number): Promise<BogenligaResponse<OfflineMannschaft[]>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path('mannschaft=' + id).build())
      .then((data: VersionedDataTransferObject[]) => {
        resolve({result: RequestResult.SUCCESS, payload: fromOfflineMannschaftPayloadArray(data)});
      }, (error: HttpErrorResponse) => this.handleErrorResponse(error, reject));
    });
  }

  private loadMannschaftsmitglied(id: string | number): Promise<BogenligaResponse<OfflineMannschaftsmitglied[]>> {

    return new Promise((resolve, reject) => {
      this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path('mannschaftsmitglied=' + id).build())
      .then((data: VersionedDataTransferObject[]) => {

        resolve({
          result: RequestResult.SUCCESS,
          payload: fromOfflineMannschaftsmitgliedPayloadArray(data)
        });
      }, (error: HttpErrorResponse) => this.handleErrorResponse(error, reject));
    });
  }

  private loadDsbMitglied(id: string | number): Promise<BogenligaResponse<OfflineDsbMitglied[]>> {

    return new Promise((resolve, reject) => {
      this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path('dsbmitglied=' + id).build())
      .then((data: VersionedDataTransferObject[]) => {

        resolve({result: RequestResult.SUCCESS, payload: fromOfflineDsbMitgliedPayloadArray(data)});
      }, (error: HttpErrorResponse) => this.handleErrorResponse(error, reject));
    });
  }

  private loadVeranstaltung(id: string | number): Promise<BogenligaResponse<OfflineVeranstaltung[]>> {

    return new Promise((resolve, reject) => {
      // TODO: check if this is correct url to call
      this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path('veranstaltung=' + id).build())
      .then((data: VersionedDataTransferObject[]) => {

        resolve({
          result: RequestResult.SUCCESS,
          payload: fromOfflineVeranstaltungPayloadArray(data)
        });
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
