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
import { db } from '@shared/data-provider/offlinedb/offlinedb';
import { OfflineLigatabelle } from '@shared/data-provider/offlinedb/types/offline-ligatabelle.interface';
import {CurrentUserService, OnOfflineService} from '@shared/services';
import {fromPayloadLigatabelleErgebnisArray, fromOfflineLigatabelleArray} from '../mapper/ligatabelle-ergebnis-mapper';
import {LigatabelleErgebnisDO} from '../types/ligatabelle-ergebnis-do.class';
import {map} from 'rxjs/operators';
import {MatchDOExt} from '@wkdurchfuehrung/types/match-do-ext.class';

@Injectable({
  providedIn: 'root'
})
export class LigatabelleDataProviderService extends DataProviderService {

  serviceSubUrl = 'v1/mannschaft';


  // diese Klasse unterstützt die Offlinefähgikeit, d.h. die bereitgestellten Daten sind auch Teil der Offline Funktionen
  // bei Veränderung der Datenstrukturen sind neben den Online Data-Providern auch
  // die Offline-Dataprovider, die Datenstrukturen der offline-CLient-DB sowie ggf. die Snyc-Services anzupassen
  // evtl. nicht nur die Lesenden sondern auch die schreibenden Services beim.
  constructor(private restClient: RestClient, private currentUserService: CurrentUserService, private onOfflineSerivce: OnOfflineService) {
    super();
  }



  // ermittelt den aktuellen Tabellenstand gem. den gesamten vorliegen Daten
  public getLigatabelleVeranstaltung(id: string | number): Promise<BogenligaResponse<LigatabelleErgebnisDO[]>> {
    if (this.onOfflineSerivce.isOffline()) {
      console.log('Choosing offline way for Veranstaltung with id ' + id);
      return new Promise((resolve, reject) => {
        db.ligaTabelleV2.where('veranstaltungId').equals(id).toArray()
          .then((data: OfflineLigatabelle[]) => {
            resolve({result: RequestResult.SUCCESS, payload: fromOfflineLigatabelleArray(data)});
          }, () => {
            reject({result: RequestResult.FAILURE});
          });
      });
    } else {
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


  // ermittelt den Stand der Ligatabelle nach einem definierten Wettkampftag
  // so lässt sich auch am Ende die Saison noch ermitteln, welchen Platz ein Verein nach dem ersten Wettkampftag hatte
  public getLigatabelleWettkampf(id: string | number): Promise<BogenligaResponse<LigatabelleErgebnisDO[]>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path('wettkampf=' + id).build())
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

  public getLigatabelleWK(id: number): Promise<BogenligaResponse<LigatabelleErgebnisDO[]>> {
    return new Promise((resolve, reject) => {
      db.ligaTabelle.where('mannschaftId').equals(id).toArray()
        .then((data: OfflineLigatabelle[]) => {
          resolve({result: RequestResult.SUCCESS, payload: fromOfflineLigatabelleArray(data)});
        }, () => {
          reject({result: RequestResult.FAILURE});
        });
    });
  };


  public async updateMannschaftLT(id : number, satzpunkte:number, satzpunkteGegner : number, spd :number, matchpunkte : number, matchpunkteGegner : number){
    db.ligaTabelleV2.update(id, {'satzpkt':satzpunkte, 'satzpktGegen':satzpunkteGegner, 'satzpktDifferenz':spd,'matchpkt':matchpunkte, 'matchpktGegen': matchpunkteGegner});

  };

  public async updateLigatabelleVeranstaltung( mannschafteins: MatchDOExt, mannschaftzwei: MatchDOExt){

    let satzpunkte=[];
    let id=0;
    let matchpunkte=[];

    let Daten = await this.getLigatabelleWK(mannschafteins.mannschaftId);
    let LT_mannschafteins=Daten.payload;
    Daten = await this.getLigatabelleWK(mannschaftzwei.mannschaftId);
    let LT_mannschaftzwei=Daten.payload;

    // Manschafteins
    satzpunkte=LT_mannschafteins[0].satzpunkte.split(" ");
    id=LT_mannschafteins[0].id;
    matchpunkte=LT_mannschafteins[0].matchpunkte.split(" ");

    let sp = parseInt(satzpunkte[0]) + mannschafteins.satzpunkte;
    let spg = parseInt(satzpunkte[2]) + mannschaftzwei.satzpunkte;
    let spd = sp - spg;

    let mp = parseInt(matchpunkte[0]) + mannschafteins.matchpunkte;
    let mpg = parseInt(matchpunkte[2]) + mannschaftzwei.matchpunkte;
    console.log(satzpunkte,matchpunkte,sp,spg, spd,mannschafteins.mannschaftName.toString());
    //Daten Updaten
    await this.updateMannschaftLT(id, sp, spg, spd, mp, mpg);
    console.log(id, sp, spg, spd, mp, mpg)

    //Mannschaftzwei
    satzpunkte=LT_mannschaftzwei[0].satzpunkte.split(" ");
    id=LT_mannschaftzwei[0].id;
    matchpunkte=LT_mannschaftzwei[0].matchpunkte.split(" ");

    sp = parseInt(satzpunkte[0]) + mannschafteins.satzpunkte;
    spg = parseInt(satzpunkte[2]) + mannschaftzwei.satzpunkte;
    spd = sp - spg;

    mp = parseInt(matchpunkte[0]) + mannschafteins.matchpunkte;
    mpg = parseInt(matchpunkte[2]) + mannschaftzwei.matchpunkte;
    console.log(satzpunkte,matchpunkte,sp,spg, spd, mannschaftzwei.mannschaftName.toString());
    //Daten Updaten
    await this.updateMannschaftLT(id, sp, spg, spd, mp, mpg);


  }

}
