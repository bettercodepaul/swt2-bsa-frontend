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
import {OfflineLigatabelle} from '@shared/data-provider/offlinedb/types/offline-ligatabelle.interface';
import {fromPayloadOfflineLigatabelleArray} from '../../ligatabelle/mapper/ligatabelle-offline-mapper';
import {db} from '@shared/data-provider/offlinedb/offlinedb';
import {fromOfflineMatchPayloadArray} from '@verwaltung/mapper/match-offline-mapper';
import {OfflineMatch} from '@shared/data-provider/offlinedb/types/offline-match.interface';
import {OfflinePasse} from '@shared/data-provider/offlinedb/types/offline-passe.interface';
import {fromOfflinePassePayloadArray} from '@verwaltung/mapper/passe-offline-mapper';
import {OfflineWettkampf} from '@shared/data-provider/offlinedb/types/offline-wettkampf.interface';
import {OfflineMannschaft} from '@shared/data-provider/offlinedb/types/offline-mannschaft.interface';
import {
  fromOfflineMannschaftPayloadArray,
  offlineMannschaftFromDsbMannschaftDOArray
} from '@verwaltung/mapper/mannschaft-offline-mapper';
import {OfflineMannschaftsmitglied} from '@shared/data-provider/offlinedb/types/offline-mannschaftsmitglied.interface';
import {fromOfflineMannschaftsmitgliedPayloadArray} from '@verwaltung/mapper/mannschaftsmitglied-offline-mapper';
import {OfflineDsbMitglied} from '@shared/data-provider/offlinedb/types/offline-dsbmitglied.interface';
import {OfflineVeranstaltung} from '@shared/data-provider/offlinedb/types/offline-veranstaltung.interface';
import {throwError} from 'rxjs';
import {VeranstaltungDataProviderService} from '@verwaltung/services/veranstaltung-data-provider.service';
import {toOfflineFromVeranstaltungDO} from '@verwaltung/mapper/veranstaltung-offline-mapper';
import {fromOfflineWettkampfPayloadArray} from '@verwaltung/mapper/wettkampf-offline-mapper';
import {DsbMitgliedDataProviderService} from '@verwaltung/services/dsb-mitglied-data-provider.service';
import {fromDOtoOfflineDsbMitgliederArray} from '@verwaltung/mapper/dsb-mitglied-offline.mapper';
import {VereinDataProviderService} from '@verwaltung/services/verein-data-provider.service';
import {OfflineVerein} from '@shared/data-provider/offlinedb/types/offline-verein.interface';
import {offlineVereinFromVereinDOArray} from '@verwaltung/mapper/verein-offline-mapper';
import {DsbMannschaftDataProviderService} from '@verwaltung/services/dsb-mannschaft-data-provider.service';

@Injectable({
  providedIn: 'root'
})
export class WettkampfOfflineSyncService extends DataProviderService {

  serviceSubUrl = 'v1/sync';


  constructor(private restClient: RestClient,private mannschaftDataProvider: DsbMannschaftDataProviderService ,private vereinDataProvider: VereinDataProviderService, private veranstaltungDataProvider: VeranstaltungDataProviderService, private dsbMitgliedDataProvider: DsbMitgliedDataProviderService) {
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
        this.handleLoadMatchTabelleSuccess(response.payload);
        resolve();
      })
      .catch((response: BogenligaResponse<OfflineMatch[]>) => {
        console.log('error loading offline match');
        reject();
      });
    });
  }

  public async handleLoadMatchTabelleSuccess(payload: OfflineMatch[]): Promise<void> {
    await db.passeTabelle.toArray()
      .then( passen => {
        const matches = this.getOfflineMatchPunkte(payload, passen);
        db.matchTabelle.bulkPut(matches, matches.map((item) => item.id)).then((value) => {
          console.log('offline match added to offlinedb', value);

        }).catch((error) => {
          console.log('error adding offline match to offlinedb', error);
        });
      });
  }

  //eventuell wo anders hin bewegen später bspw. schusszettel data provider oder ähnliches
  public getOfflineMatchPunkte(offlineMatches: OfflineMatch[], passen: OfflinePasse[]): OfflineMatch[]{
    let matches: OfflineMatch[] = []
    offlineMatches.forEach( (match1) => {
      if(matches.find(m => m.id === match1.id))
        return;

      //zugehörige gegner match finden
      let match2 = offlineMatches.find(m => m.id === match1.matchIdGegner);

      //Satzpunkte aus den passen errechnen
      const satzSumM1 = this.getOfflineMatchSatzSumme(match1.id, passen);
      const satzSumM2 = this.getOfflineMatchSatzSumme(match2.id, passen);
      if(satzSumM1[0] > 0) {
        match1.satzpunkte = 0;
      }
      if(satzSumM2[0] > 0) {
        match2.satzpunkte = 0;
      }

      //gewinner der Sätze ermitteln => satzpunkte gesamt errechnen
      for(let i = 0; i<5; i++){
        if(satzSumM1[i] > satzSumM2[i])
          match1.satzpunkte += 2;
        else if(satzSumM1[i] < satzSumM2[i])
          match2.satzpunkte += 2;
        else if(satzSumM1[i] === satzSumM2[i] && satzSumM1[i] != 0){
          match1.satzpunkte += 1;
          match2.satzpunkte += 1;
        }
      }

      //matchpunkte errechnen
      if(match1.satzpunkte >= 6) {
        match1.matchpkt = 2;
        match2.matchpkt = 0;
      }
      else if(match2.satzpunkte >= 6) {
        match2.matchpkt = 2;
        match1.matchpkt = 0;
      }
      else if(match1.satzpunkte === match2.satzpunkte && match1.satzpunkte >= 5){
        match1.matchpkt = 1;
        match2.matchpkt = 1;
      } else if(match1.satzpunkte > 0 && match2.satzpunkte > 0) {
        match1.matchpkt = 0;
        match2.matchpkt = 0;
      }
      matches.push(match1, match2);
    });
    return matches;
  }

  public getOfflineMatchSatzSumme(matchID: number, passen: OfflinePasse[]): number[]{
    const satzSum = [0,0,0,0,0];
    passen.forEach(passe =>{
      if(passe.matchID === matchID){
        satzSum[passe.lfdNr-1] += passe.ringzahlPfeil1 + passe.ringzahlPfeil2;
      }
    });
    return satzSum;
  }

  /**
   * Calls the corresponding REST-API method and returns the result as Promise
   * Doesn't return anything but fills the OfflineDb with the data!
   * @param id tbd
   *
   * @author Dennis Bär
   */
  public async loadPasseOffline(id: string | number): Promise<void> {
    let mitglieder: OfflineMannschaftsmitglied[] = []
    await db.mannschaftsmitgliedTabelle.toArray()
      .then(data => mitglieder = data)
      .catch(error => console.error(error))
    return new Promise((resolve, reject) => {
      this.loadPasse(id)
      .then((response: BogenligaResponse<OfflinePasse[]>) => {
        const passen = response.payload.map(passe => {
          passe.rueckennummer = mitglieder.find(mitglied => mitglied.dsbMitgliedId === passe.dsbMitgliedId).rueckennummer;
          return passe;
        });
        db.passeTabelle.bulkAdd(passen).then((value) => {
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
  public loadDsbMitgliedOffline(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.loadDsbMitglieder()
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

  public loadVereineOffline(){
    return new Promise((resolve, reject) => {
      this.loadVereine()
          .then((response: BogenligaResponse<OfflineVerein[]>) => {
            db.vereinTabelle.bulkPut(response.payload, response.payload.map((item) => item.id)).then((lastKey) => {
              console.log('offline vereine added to offlinedb', lastKey);
              resolve();
            }).catch((error) => {
              console.error('error adding offline vereine to offlinedb', error);
              reject();
            });
          })
          .catch((response: BogenligaResponse<OfflineVerein[]>) => {
            console.error('error loading offline verein payload:', response.payload);
            reject();
          });
    });
  }

  public loadManschaftenOffline(){
    return new Promise((resolve, reject) => {
      this.loadMannschaften()
          .then((response: BogenligaResponse<OfflineMannschaft[]>) => {
            db.mannschaftTabelle.bulkPut(response.payload, response.payload.map((item) => item.id)).then((lastKey) => {
              console.log('offline mannschaften added to offlinedb', lastKey);
              resolve();
            }).catch((error) => {
              console.error('error adding offline mannschaften to offlinedb', error);
              reject();
            });
          })
          .catch((response: BogenligaResponse<OfflineMannschaft[]>) => {
            console.error('error loading offline manschaften payload:', response.payload);
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

  private loadVereine(): Promise<BogenligaResponse<OfflineVerein[]>>{
    return new Promise((resolve, reject) => {
      this.vereinDataProvider.findAll()
          .then((data) =>{
            resolve({result: RequestResult.SUCCESS, payload: offlineVereinFromVereinDOArray(data.payload)})
          })
          .catch(error => console.error(error))
    });
  }

  private loadMannschaften(): Promise<BogenligaResponse<OfflineMannschaft[]>>{
    return new Promise((resolve, reject) => {
      this.mannschaftDataProvider.findAll()
          .then((data) =>{
            resolve({result: RequestResult.SUCCESS, payload: offlineMannschaftFromDsbMannschaftDOArray(data.payload)})
          })
          .catch(error => console.error(error))
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

  private loadDsbMitglieder(): Promise<BogenligaResponse<OfflineDsbMitglied[]>> {

    return new Promise((resolve, reject) => {
      this.dsbMitgliedDataProvider.findAll()
        .then((data) =>{
          resolve({result: RequestResult.SUCCESS, payload: fromDOtoOfflineDsbMitgliederArray(data.payload)})
        })
        .catch(error => console.error(error))
    });
  }

  private loadVeranstaltung(id: string | number): Promise<BogenligaResponse<OfflineVeranstaltung[]>> {

    return new Promise((resolve, reject) => {
        this.veranstaltungDataProvider.findById(id)
            .then((data) => {

              resolve({result: RequestResult.SUCCESS, payload: [toOfflineFromVeranstaltungDO(data.payload)]});
            })
          .catch(error => console.error(error))
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
    db.ligaTabelleV2=db.ligaTabelle; //Testen ob es moeglich ist hier die Daten von Ligatabelle vor dem ersten Aufruf in LT V2 zu schreiben.
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


  public async createWettkampfDummyData(): Promise<void>{
    let offlineWettkampfArray : OfflineWettkampf[] = [];
    for(let i=0; i<4; i++) {
      let offlineWettkampf: OfflineWettkampf = {
        id: 30+i,
        datum: '2017-12-30',
        ausrichter: '2',
        beginn: '12:5'+i,
        offlinetoken : 'dsfgsgffddfdfhfghfhfhfgdsaljfgkjdyfgfdkljbdfjhdfsklbhndsklghdfslgjhdyfklöhdfkljghdfsjghljkglhkjdsflhkdfshjkghjkldgkhjldgkhjldkjhlg',
        disziplinId : 0,
        plz : '72108',
        version: 5,
        ortsinfo: null,
        tag: ''+(i+1),
        ortsname : 'Ofterdingen',
        strasse : 'Brunnenstraße',
        wettkampftypId : 1,
        veranstaltungId : 0,
      }
      offlineWettkampfArray.push(offlineWettkampf);
    }
    db.wettkampfTabelle.clear();
    db.wettkampfTabelle.bulkPut(offlineWettkampfArray, offlineWettkampfArray.map((item) =>item.id));
  }


}
