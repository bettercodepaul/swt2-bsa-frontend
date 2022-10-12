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
        db.ligaTabelle.where('veranstaltungId').equals(id).sortBy('tabellenplatz')
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

  // Gibt die Daten zurück, die in der Ligatabelle sind. Dazu wird ein Index und Key benötigt
  public getLigatabelledaten(index: string, key: number): Promise<BogenligaResponse<OfflineLigatabelle[]>> {
    return new Promise((resolve, reject) => {
      db.ligaTabelle.where(index).equals(key).toArray()
        .then((data: OfflineLigatabelle[]) => {
          resolve({result: RequestResult.SUCCESS, payload: data});
        }, () => {
          reject({result: RequestResult.FAILURE});
        });
    });
  }

// Updaten der Mannschaftswerte in der Ligatabelle
  public async updateMannschaftLT(id: number, satzpunkte: number, satzpunkteGegner: number, spd: number, matchpunkte: number, matchpunkteGegner: number) {
    db.ligaTabelle.update(id, {'satzpkt': satzpunkte, 'satzpktGegen': satzpunkteGegner, 'satzpktDifferenz': spd, 'matchpkt': matchpunkte, 'matchpktGegen': matchpunkteGegner});

  }

  // Platz in der DB ändern
  public async updatePlatz(id: number, platz: number) {
    db.ligaTabelle.update(id, {'tabellenplatz': platz
    });
  }


  public async tabellesortieren(wettkampfId: number) {
    // Daten holen
    const datenliga = await this.getLigatabelledaten('wettkampfId', wettkampfId);
    const liga = datenliga.payload;
    const ligaid = liga[0].veranstaltungId;
    const ligatabelle = await this.getLigatabelledaten('veranstaltungId', ligaid);
    const tabelle = ligatabelle.payload;

    // Sortierfunkion, erst nach Matchpunkten dann nach Satzpunktdifferenz
    tabelle.sort((manschafteins, manschaftzwei) => {

    if (manschafteins.matchpkt > manschaftzwei.matchpkt) {
      return -1;

    } else if (manschafteins.matchpkt === manschaftzwei.matchpkt &&
              manschafteins.matchpktGegen < manschaftzwei.matchpktGegen) {
      return -1;
    } else if (manschafteins.matchpkt === manschaftzwei.matchpkt &&
            manschafteins.matchpktGegen === manschaftzwei.matchpktGegen &&
            manschafteins.satzpktDifferenz > manschaftzwei.satzpktDifferenz) {
      return -1;
    }
    return  1;

    });

    // tabelle in der DB aktualiesieren
    for (let x = 0; x < tabelle.length; x++) {

      await this.updatePlatz(tabelle[x].id, x + 1);
    }

  }


  public async updateLigatabelleVeranstaltung( match1: MatchDOExt, alt_match1: MatchDOExt, match2: MatchDOExt, alt_match2: MatchDOExt) {


    // Wenn sich nichts ändert, wird auch nichts gemacht.
    if (
      match1.satzpunkte !== alt_match1.satzpunkte &&
      match2.satzpunkte !== alt_match2.satzpunkte
    ) {

    // Daten aus der DB holen
    let Daten = await this.getLigatabelledaten('mannschaftId', match1.mannschaftId);
    const LT_match1 = Daten.payload;
    Daten = await this.getLigatabelledaten('mannschaftId', match2.mannschaftId);
    const LT_match2 = Daten.payload;
    
    let mannschaftsid;
    let satzpunkte;
    let satzpunktegegner;
    let satzpunktedifferenz;
    let matchpunkte;
    let matchpunktegegner;


    // Berechnung der Satzpunkte, Matchpunkte und Satzpunktedifferenz fuer Mannschaft 1

    mannschaftsid = LT_match1[0].id;

    // Berechnung im Online-Modus -> alt_matches sind null.
    if (alt_match1 == null || alt_match2 == null) {
      satzpunkte = LT_match1[0].satzpkt + match1.satzpunkte;
      satzpunktegegner = LT_match1[0].satzpktGegen + match2.satzpunkte;
      satzpunktedifferenz = satzpunkte - satzpunktegegner;

      matchpunkte = LT_match1[0].matchpkt + match1.matchpunkte;
      matchpunktegegner = LT_match1[0].matchpktGegen + match2.matchpunkte;

    // Berechnung durch Offline-Modus -> alt_matches not null
    } else {
      satzpunkte = LT_match1[0].satzpkt - alt_match1.satzpunkte + match1.satzpunkte;
      satzpunktegegner = LT_match1[0].satzpktGegen - alt_match2.satzpunkte + match2.satzpunkte;
      satzpunktedifferenz = satzpunkte - satzpunktegegner;

      matchpunkte = LT_match1[0].matchpkt - alt_match1.matchpunkte + match1.matchpunkte;
      matchpunktegegner = LT_match1[0].matchpktGegen - alt_match2.matchpunkte + match2.matchpunkte;

    }
    // console.log("SP:",satzpunkte,"MP:",matchpunkte,satzpunkte,satzpunktegegner, satzpunktedifferenz,match1.mannschaftName.toString());
    // Daten Updaten
    await this.updateMannschaftLT(mannschaftsid, satzpunkte, satzpunktegegner, satzpunktedifferenz, matchpunkte, matchpunktegegner);

    // Berechnung der Satzpunkte, Matchpunkte und Satzpunktedifferenz fuer Mannschaft 2

    mannschaftsid = LT_match2[0].id;

    // Berechnung im Online-Modus -> alt_matches sind null
    if (alt_match1 == null || alt_match2 == null) {
      satzpunkte = LT_match2[0].satzpkt + match2.satzpunkte;
      satzpunktegegner = LT_match2[0].satzpktGegen + match1.satzpunkte;
      satzpunktedifferenz = satzpunkte - satzpunktegegner;

      matchpunkte = LT_match2[0].matchpkt + match2.matchpunkte;
      matchpunktegegner = LT_match2[0].matchpktGegen + match1.matchpunkte;

    // Berechnung durch Offline-Modus -> alt_matches sind null
    } else {
      satzpunkte = LT_match2[0].satzpkt - alt_match2.satzpunkte + match2.satzpunkte;
      satzpunktegegner = LT_match2[0].satzpktGegen - alt_match1.satzpunkte + match1.satzpunkte;
      satzpunktedifferenz = satzpunkte - satzpunktegegner;

      matchpunkte = LT_match2[0].matchpkt - alt_match2.matchpunkte + match2.matchpunkte;
      matchpunktegegner = LT_match2[0].matchpktGegen - alt_match1.matchpunkte + match1.matchpunkte;

  }
    // Daten Updaten
    await this.updateMannschaftLT(mannschaftsid, satzpunkte, satzpunktegegner, satzpunktedifferenz, matchpunkte, matchpunktegegner);

    await this.tabellesortieren(match1.wettkampfId);
  }

  }
}
