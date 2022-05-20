import {HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {
  BogenligaResponse,
  DataProviderService,
  DataTransferObject,
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
} from '@shared/data-provider/offlinedb/types/offline-veranstaltung.interface';
import {
  fromOfflineVeranstaltungPayloadArray
} from '@verwaltung/mapper/veranstaltung-offline-mapper';
import {WettkampfDataProviderService} from '@verwaltung/services/wettkampf-data-provider.service';
import {throwError} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class WettkampfOfflineSyncService extends DataProviderService {

  serviceSubUrl = 'v1/sync';


  constructor(private restClient: RestClient, private wettkampfDataProvider: WettkampfDataProviderService) {
    super();
  }

  // The following methods define the REST calls and how to convert the returned JSON payload to the known entity types
  public loadLigatabelleVeranstaltungOffline(id: string | number): Promise<void> {

    return new Promise((resolve, reject) => {
      this.loadLigatabelleVeranstaltung(id)
      .then((response: BogenligaResponse<OfflineLigatabelle[]>) => {
        this.handleLoadLigatabelleVeranstaltungSuccess(response);
        resolve();
      })
      .catch((response: BogenligaResponse<OfflineLigatabelle[]>) => {
        console.log('error loading offline ligatabelle');
        reject();
      });
    });

  }

  /**
   * Calls the corresponding REST-API method and returns the result as Promise
   * Doesn't return anything but fills the OfflineDb with the data!
   * @param id  wettkampfId to which the matches belongs
   *
   * @author Dennis Bär
   */
  public loadMatchOffline(id: string | number): Promise<void> {

    return new Promise((resolve, reject) => {
      this.loadMatch(id)
      .then((response: BogenligaResponse<OfflineMatch[]>) => {
        db.matchTabelle.bulkAdd(response.payload).then((value) => {
          console.log('offline match added to offlinedb', value);
          resolve();

        }).catch((error) => {
          console.log('error adding offline match to offlinedb', error);
          reject();
        });
      })
      .catch((response: BogenligaResponse<OfflineMatch[]>) => {
        console.log('error loading offline match');
        reject();
      });
    });
  }


  /**
   * Calls the corresponding REST-API method and returns the result as Promise
   * Doesn't return anything but fills the OfflineDb with the data!
   * @param id tbd
   *
   * @author Dennis Bär
   */
  public loadPasseOffline(id: string | number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.loadPasse(id)
      .then((response: BogenligaResponse<OfflinePasse[]>) => {
        db.passeTabelle.bulkAdd(response.payload).then((value) => {
          console.log('offline passe added to offlinedb', value);
          resolve();
        }).catch((error) => {
          console.error('error adding offline passe to offlinedb', error);
          reject();
        });
      })
      .catch((response: BogenligaResponse<OfflinePasse[]>) => {
        console.error('error loading offline passe payload:', response.payload);
        reject();
      });
    });
  }

  /**
   * Calls the corresponding REST-API method and returns the result as Promise
   * Doesn't return anything but fills the OfflineDb with the data!
   * @param id tbd
   *
   * @author Dennis Bär
   */
  public loadWettkampfOffline(id: string | number): Promise<void> {

    return new Promise((resolve, reject) => {
      this.loadWettkampf(id)
      .then((response: BogenligaResponse<OfflineWettkampf[]>) => {
        db.wettkampfTabelle.bulkAdd(response.payload).then((value) => {
          console.log('offline wettkampf added to offlinedb', value);
          resolve();
        }).catch((error) => {
          console.error('error adding offline wettkampf to offlinedb', error);
          reject();
        });
      })
      .catch((response: BogenligaResponse<OfflineWettkampf[]>) => {
        console.error('error loading offline wettkampf payload:', response.payload);
        reject();
      });
    });
  }

  /**
   * Calls the corresponding REST-API method and returns the result as Promise
   * Doesn't return anything but fills the OfflineDb with the data!
   * @param id tbd
   *
   * @author Dennis Bär
   */
  public loadMannschaftOffline(id: string | number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.loadMannschaft(id)
      .then((response: BogenligaResponse<OfflineMannschaft[]>) => {
        db.mannschaftTabelle.bulkPut(response.payload, response.payload.map((item) => item.id)).then((value) => {
          console.log('offline mannschaft added to offlinedb', value);
          resolve();
        }).catch((error) => {
          console.error('error adding offline mannschaft to offlinedb', error);
          reject();
        });
      })
      .catch((response: BogenligaResponse<OfflineMannschaft[]>) => {
        console.error('error loading offline mannschaft payload:', response.payload);
        reject();
      });
    });
  }

  /**
   * Calls the corresponding REST-API method and returns the result as Promise
   * Doesn't return anything but fills the OfflineDb with the data!
   * @param id tbd
   *
   * @author Dennis Bär
   */
  public loadMannschaftsmitgliedOffline(id: string | number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.loadMannschaftsmitglied(id)
      .then((response: BogenligaResponse<OfflineMannschaftsmitglied[]>) => {
        db.mannschaftsmitgliedTabelle.bulkPut(response.payload, response.payload.map((item) => item.id)).then((lastKey) => {
          console.log('offline mannschaftsmitglied added to offlinedb', lastKey);
          resolve();
        }).catch((error) => {
          console.error('error adding offline mannschaftsmitglied to offlinedb', error);
          reject();
        });
      })
      .catch((response: BogenligaResponse<OfflineMannschaftsmitglied[]>) => {
        console.error('error loading offline mannschaftsmitglied payload:', response.payload);
        reject();
      });
    });

  }

  /**
   * Calls the corresponding REST-API method and returns the result as Promise
   * Doesn't return anything but fills the OfflineDb with the data!
   * @param id tbd
   *
   * @author Dennis Bär
   */
  public loadDsbMitgliedOffline(id: string | number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.loadDsbMitglied(id)
      .then((response: BogenligaResponse<OfflineDsbMitglied[]>) => {
        db.dsbMitgliedTabelle.bulkPut(response.payload, response.payload.map((item) => item.id)).then((lastKey) => {
          console.log('offline dsb mitglied added to offlinedb', lastKey);
          resolve();
        }).catch((error) => {
          console.error('error adding offline dsb mitglied to offlinedb', error);
          reject();
        });
      })
      .catch((response: BogenligaResponse<OfflineDsbMitglied[]>) => {
        console.error('error loading offline dsb mitglied payload:', response.payload);
        reject();
      });
    });
  }

  /**
   * Calls the corresponding REST-API method and returns the result as Promise
   * Doesn't return anything but fills the OfflineDb with the data!
   * @param id tbd
   *
   * @author Dennis Bär
   */
  public loadVeranstaltungOffline(id: string | number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.loadVeranstaltung(id)
      .then((response: BogenligaResponse<OfflineVeranstaltung[]>) => {
        db.veranstaltungTabelle.bulkPut(response.payload, response.payload.map((item) => item.id)).then((lastKey) => {
          console.log('offline veranstaltung added to offlinedb', lastKey);
          resolve();
        }).catch((error) => {
          console.error('error adding offline veranstaltung to offlinedb', error);
          reject();
        });
      })
      .catch((response: BogenligaResponse<OfflineVeranstaltung[]>) => {
        console.error('error loading offline veranstaltung payload:', response.payload);
        reject();
      });
    });
  }

  /**
   * Calls the corresponding REST-API method and returns the result as Promise
   * @param {string} id - the wettkampf id
   * @author Dennis Bär
   */

  private loadMatch(id: string | number): Promise<BogenligaResponse<OfflineMatch[]>> {

    // Call REST-API
    const url = new UriBuilder().fromPath(this.getUrl()).path('match/' + id).build();
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
    const url = new UriBuilder().fromPath(this.getUrl()).path('passe/' + id).build();

    return new Promise<BogenligaResponse<OfflinePasse[]>>((resolve, reject) => {
      // Call the builded url
      this.restClient.GET<OfflinePasse[]>(url)
      // Resolve the request and use the offline passe mapper
      .then((data: DataTransferObject[]) => {
        // payload -> passe array
        resolve({result: RequestResult.SUCCESS, payload: fromOfflinePassePayloadArray(data)});
      }, (error: HttpErrorResponse) => reject({
        result: RequestResult.FAILURE,
        payload: 'Fehler beim Laden der Pässe'
      }));
    });

  }

  private loadWettkampf(id: string | number): Promise<BogenligaResponse<OfflineWettkampf[]>> {

    // Build url
    const url = new UriBuilder().fromPath(this.getUrl()).path('wettkampf/' + id).build();

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
      this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path('mannschaftsmitglieder/' + id).build())
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

    db.ligaTabelle.clear();
    db.ligaTabelle.bulkAdd(offlineLigatabelle.payload)
    .then((lastNumber) => console.log('Finished adding numbers til ' + lastNumber))
    .catch((e) => throwError(e));
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
