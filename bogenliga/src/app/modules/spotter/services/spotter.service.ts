import { HttpErrorResponse } from '@angular/common/http';
import { SpotterResult } from './../types/spotter-result.enum';
import { Play } from './../types/play';
import { Injectable } from '@angular/core';
import {DataProviderService, RequestResult, RestClient, UriBuilder} from './../../../modules/shared/';
import {MatchMapperExt} from '@wkdurchfuehrung/mapper/match-mapper-ext';
import {MatchDOExt} from '@wkdurchfuehrung/types/match-do-ext.class';
import {environment} from '@environment';
import {MatchDTOExt} from '@wkdurchfuehrung/types/datatransfer/match-dto-ext.class';
import {Match} from '../types/match';
import {PasseDO} from '@wkdurchfuehrung/types/passe-do.class';
import {PasseDTO} from '@wkdurchfuehrung/types/datatransfer/passe-dto.class';

@Injectable({
  providedIn: 'root'
})
export class SpotterService {
  // export class SpotterService extends DataProviderService
  // extension is disabled, because the spotter service is not yet implemented and we can't get a connection

  matchDTOExt: MatchDTOExt;
  serviceSubUrl: 'v1/spotter';

  constructor(private restClient: RestClient) {
  }

  public sendPlay(play: Play): Promise<void> {
    return new Promise((resolve, reject) => {
      resolve(); // Temporary deactivation to demonstrate spotter interface
      /*
      this.restClient.POST<void>(new UriBuilder().fromPath(this.getUrl()).build(), play)
        .then(() => {
          resolve();
        }, (error: HttpErrorResponse) => {
          if (error.error === 401) {
            reject(SpotterResult.UNAUTHORIZED);
          } else {
            reject(SpotterResult.FAILURE);
          }
        });
        */
    });
  }

  public findMatch(wkID: string) {
    return new Promise((resolve, reject) => {
      this.restClient.GET(new UriBuilder().fromPath(environment.backendBaseUrl)
        .path('v1/match/findByWettkampfId/wettkampfid=' + wkID).build()).then((data: MatchDTOExt[]) => {
        const matches = data.map((matchDTOExt) => MatchMapperExt.matchToDO(matchDTOExt));
        resolve({ result: RequestResult.SUCCESS, payload: matches });
      })
        .catch((error: HttpErrorResponse) => {
          if (error.status === 0) {
            reject({ result: RequestResult.CONNECTION_PROBLEM });
          } else {
            reject({ result: RequestResult.FAILURE });
          }
        });
    });

  }
  public createOrUpdatePasse(matchDOExt: MatchDOExt, match: Match, passeId, currentPasse) {
    this.matchDTOExt = MatchMapperExt.matchToDTO(matchDOExt);

    this.handlePasse(matchDOExt, match, passeId, currentPasse);
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise((resolve, reject) => {
      this.restClient
          .POST(
            new UriBuilder()
              .fromPath(environment.backendBaseUrl)
              .path("v1/match/spotter")
              .build(),
            this.matchDTOExt
          )
          .then(
            (data: MatchDTOExt) => {
              console.log("Rohdaten:", data);
              const match = MatchMapperExt.matchToDO(data);
              console.log("Match im Service: ", match);
              resolve({ result: RequestResult.SUCCESS, payload: match });
            },
            (error: HttpErrorResponse) => {
              if (error.status === 401) {
                reject(SpotterResult.UNAUTHORIZED);
              } else {
                reject(SpotterResult.FAILURE);
              }
            }
          );
    });
  }

  public getWettkampfIDundScheibe() {
    const url = window.location.href;
    const urlParts = url.split('/');
    const wkId = urlParts[6];
    const schreibe = urlParts[7];
    return {wkId, schreibe};
  }



  public handlePasse(matchDOExt: MatchDOExt, match: Match, passeId, currentTrefferScheibe) {
    if(passeId !== null) {
      // tslint:disable-next-line:radix
      passeId  = parseInt(passeId);
    }
    // Control Variable to check if passeID exists
    const newPasse = {
      id: passeId,
      matchId: this.matchDTOExt.id,
      mannschaftId: this.matchDTOExt.mannschaftId,
      wettkampfId: this.matchDTOExt.wettkampfId,
      matchNr: this.matchDTOExt.matchNr,
      lfdNr: match.currentSetNumber,
      dsbMitgliedId: null,
      ringzahl: [match.currentSet.plays[currentTrefferScheibe - 1].result, null, null, null, null, null],
      rueckennummer: 1
    };
    // Set the rueckennummer for the new Passe
    if (currentTrefferScheibe > 2 && currentTrefferScheibe <= 4) {
      newPasse.rueckennummer = 2;
    } else if (currentTrefferScheibe > 4) {
      newPasse.rueckennummer = 3;
    }
    // Delete all Passe that have null as an passid
    this.matchDTOExt.passen = this.matchDTOExt.passen.filter((passe) => passe.id !== null);
    // Get passeIndex if it exists
    const passeIndex = this.matchDTOExt.passen.findIndex((passe) => passe.id === passeId);

    if (currentTrefferScheibe % 2 === 0) {
       if (passeIndex !== -1 ) {
         console.log("Passe mit ID bereits vorhanden, Index:", passeIndex);
         newPasse.ringzahl = [match.currentSet.plays[currentTrefferScheibe - 2].result, match.currentSet.plays[currentTrefferScheibe - 1].result, null, null, null, null];
         this.matchDTOExt.passen[passeIndex].ringzahl = newPasse.ringzahl;

       } else {
         console.log("Passe nicht gefunden, wird hinzugefügt:", newPasse);
         this.matchDTOExt.passen.push(newPasse);
       }
    } else {
      if (passeIndex !== -1 ) {
        console.log("Passe mit ID bereits vorhanden, Index:", passeIndex);
        newPasse.ringzahl = [match.currentSet.plays[currentTrefferScheibe - 1].result, match.currentSet.plays[currentTrefferScheibe].result, null, null, null, null];
        console.log(newPasse.ringzahl);
        this.matchDTOExt.passen[passeIndex].ringzahl = newPasse.ringzahl;

      } else {
        console.log("Passe nicht gefunden, wird hinzugefügt:", newPasse);
        this.matchDTOExt.passen.push(newPasse);
      }
    }




  }

  public nextMatch(): Promise<string> {
    return new Promise((resolve, reject) => {
      resolve('Next Team'); // Temporary deactivation to demonstrate spotter interface
      /*
      this.restClient.GET<string>(new UriBuilder().fromPath(this.getUrl()).path('match').build())
        .then((result: string) => {
          resolve(result);
        }, (error: HttpErrorResponse) => {
          if (error.error === 401) {
            reject(SpotterResult.UNAUTHORIZED);
          } else {
            reject(SpotterResult.FAILURE);
          }
        });
        */
    });
  }

}
