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

  public getLigatabelleWK(index :string, key: number): Promise<BogenligaResponse<LigatabelleErgebnisDO[]>> {
    return new Promise((resolve, reject) => {
      db.ligaTabelle.where(index).equals(key).toArray()
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
  public async updatePlatzLT(id : number, platz : number){
    db.ligaTabelleV2.update(id, {'tabellenplatz':platz});
  };

  public async tabelleberechnen(wettkampfId:number){
    let datenliga = await this.getLigatabelleWK('wettkampfId',wettkampfId);
    let liga=datenliga.payload;
    let ligaid=liga[0].veranstaltung_id;
    let ligatabelle= await this.getLigatabelleWK('veranstaltungId',ligaid);
    let tabelle= ligatabelle.payload;

    let temp;
    for (let i = 0; i < tabelle.length-1; i++) {
      datenliga = await this.getLigatabelleWK('wettkampfId',wettkampfId);
      liga=datenliga.payload;
      ligaid=liga[0].veranstaltung_id;
       ligatabelle= await this.getLigatabelleWK('veranstaltungId',ligaid);
      tabelle= ligatabelle.payload;
      temp=tabelle[i];
      console.log(tabelle[i].tabellenplatz,tabelle[i].mannschaft_name,tabelle[i].matchpunkte.split(" ")[0]);
      if ((tabelle[i].matchpunkte.split(" ")[0] ) >  tabelle[i+1].matchpunkte.split(" ")[0]){
        tabelle[i]=tabelle[i+1];
        tabelle[i+1]=temp;
        temp=tabelle[i].tabellenplatz;
        tabelle[i].tabellenplatz=tabelle[i+1].tabellenplatz;
        tabelle[i+1].tabellenplatz=temp;
        console.log(tabelle);
        await this.updatePlatzLT(tabelle[i].id,tabelle[i].tabellenplatz);
        await this.updatePlatzLT(tabelle[i + 1].id, tabelle[i + 1].tabellenplatz);

      }
      //console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
      //console.log(tabelle);

    }
  }


  public async updateLigatabelleVeranstaltung( match1: MatchDOExt,alt_match1 :MatchDOExt, match2: MatchDOExt, alt_match2 :MatchDOExt){

    //Fall es aendert sich nichts
    if(
      match1.satzpunkte!=alt_match1.satzpunkte &&
      match2.satzpunkte!=alt_match2.satzpunkte
    ){

    let satzpunkte=[];
    let id=0;
    let matchpunkte=[];

    let Daten = await this.getLigatabelleWK('mannschaftId',match1.mannschaftId);
    let LT_match1=Daten.payload;
    Daten = await this.getLigatabelleWK('mannschaftId',match2.mannschaftId);
    let LT_match2=Daten.payload;



    // Manschafteins
    satzpunkte=LT_match1[0].satzpunkte.split(" ");
    id=LT_match1[0].id;
    matchpunkte=LT_match1[0].matchpunkte.split(" ");

    let sp = parseInt(satzpunkte[0])- alt_match1.satzpunkte + match1.satzpunkte;
    let spg = parseInt(satzpunkte[2])- alt_match2.satzpunkte + match2.satzpunkte;
    let spd = sp - spg;

    let mp = parseInt(matchpunkte[0])-alt_match1.matchpunkte + match1.matchpunkte;
    let mpg = parseInt(matchpunkte[2])-alt_match2.matchpunkte + match2.matchpunkte;

    console.log(satzpunkte,matchpunkte,sp,spg, spd,match1.mannschaftName.toString());
    //Daten Updaten
    await this.updateMannschaftLT(id, sp, spg, spd, mp, mpg);
    console.log(id, sp, spg, spd, mp, mpg)

    //Mannschaftzwei
    satzpunkte=LT_match2[0].satzpunkte.split(" ");
    id=LT_match2[0].id;
    matchpunkte=LT_match2[0].matchpunkte.split(" ");

    sp = parseInt(satzpunkte[0])- alt_match1.satzpunkte + match1.satzpunkte;
    spg = parseInt(satzpunkte[2])- alt_match2.satzpunkte + match2.satzpunkte;
    spd = sp - spg;

    mp = parseInt(matchpunkte[0])- alt_match1.matchpunkte  + match1.matchpunkte;
    mpg = parseInt(matchpunkte[2])- alt_match2.matchpunkte + match2.matchpunkte;
    console.log(satzpunkte,matchpunkte,sp,spg, spd, match2.mannschaftName.toString());
    //Daten Updaten
    await this.updateMannschaftLT(id, sp, spg, spd, mp, mpg);

     // this.tabelleberechnen(match1.wettkampfId); Funkioniert noch nicht ganz
  }

  }
}
