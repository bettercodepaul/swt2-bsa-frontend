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
        db.ligaTabelle.where('veranstaltungId').equals(id).toArray()
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

  public getLigatabelleWK(id: string | number): Promise<BogenligaResponse<LigatabelleErgebnisDO[]>> {
    return new Promise((resolve, reject) => {
      db.ligaTabelle.where('veranstaltungName').equals(id).toArray()
        .then((data: OfflineLigatabelle[]) => {
          resolve({result: RequestResult.SUCCESS, payload: fromOfflineLigatabelleArray(data)});
        }, () => {
          reject({result: RequestResult.FAILURE});
        });
    });
  };

  public async updateMannschaftLT(id : number, satzpunkte:number, satzpunkteGegner : number, spd :number, matchpunkte : number, matchpunkteGegner : number){
    db.ligaTabelle.update(id, {'satzpkt':satzpunkte, 'satzpktGegen':satzpunkteGegner, 'satzpktDifferenz':spd,'matchpkt':matchpunkte, 'matchpktGegen': matchpunkteGegner});
  };

  public async updateLigatabelleVeranstaltung(liganame: string, mannschafteins: MatchDOExt, mannschaftzwei: MatchDOExt){

    //Ausgeben der LT
    const Daten = await this.getLigatabelleWK(liganame);
    const Ligatabelledaten=Daten.payload;
    console.log(Ligatabelledaten);

    let satzpunkte=[];
    let id=0;
    let matchpunkte=[];


    for (let x=0; x<Ligatabelledaten.length; x++) {
      //Daten aus dem Array lesen und zusammenaddieren
      satzpunkte=Ligatabelledaten[x].satzpunkte.split(" ")
      id=Ligatabelledaten[x].id
      matchpunkte=Ligatabelledaten[x].matchpunkte.split(" ")

      for (let i=0; x<Ligatabelledaten.length; i++){
        if (Ligatabelledaten[x].mannschaft_id != mannschafteins.mannschaftId){

          const sp = parseInt(satzpunkte[0]) + mannschafteins.satzpunkte;
          const spg = parseInt(satzpunkte[2]) + mannschaftzwei.satzpunkte;
          const spd = sp - spg;

          const mp = parseInt(matchpunkte[0]) + mannschafteins.matchpunkte;
          const mpg = parseInt(matchpunkte[2]) + mannschaftzwei.matchpunkte;
          //console.log(satzpunkte,matchpunkte,sp,spg, spd);
          //Daten Updaten
          await this.updateMannschaftLT(id, sp, spg, spd, mp, mpg);

        }
        else if (Ligatabelledaten[x].mannschaft_id != mannschaftzwei.mannschaftId){

          const sp = parseInt(satzpunkte[0]) + mannschaftzwei.satzpunkte;
          const spg = parseInt(satzpunkte[2]) + mannschafteins.satzpunkte;
          const spd = sp - spg;

          const mp = parseInt(matchpunkte[0]) + mannschaftzwei.matchpunkte;
          const mpg = parseInt(matchpunkte[2]) + mannschafteins.matchpunkte;
          //console.log(satzpunkte,matchpunkte,sp,spg, spd);
          //Daten Updaten
          await this.updateMannschaftLT(id, sp, spg, spd, mp, mpg);

        }
        else if(i-1==Ligatabelledaten.length)
        {
          console.log("Fehler beim Updaten der Mannschaften mit der ID Mannschafteins:"+mannschafteins.mannschaftId+" Mannschaftzwei: "+mannschaftzwei.mannschaftId)
        }
      }

    }

    /*
     const Datenn = await this.getLigatabelleWK('Würtembergliga');
     let Ligatabelledatenn=Datenn.payload;
     console.log(Ligatabelledatenn);
     */
  }

}
