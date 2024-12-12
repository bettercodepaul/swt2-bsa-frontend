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
  /*
  public findMatch(matchId: string) {
    return new Promise((resolve, reject) => {
      this.restClient.GET(new UriBuilder().fromPath(environment.backendBaseUrl).path("v1/match/" + matchId).build()).then((data: MatchDTOExt) => {
        const match = MatchMapperExt.matchToDO(data);
        resolve({result: RequestResult.SUCCESS, payload: match});
      }, (error: HttpErrorResponse) => {
        if (error.status === 0) {
          reject({result: RequestResult.CONNECTION_PROBLEM});
        } else {
          reject({result: RequestResult.FAILURE});
        }
      });
    });
  }*/
  public nextSet(matchDOExt: MatchDOExt, match: Match) {
    this.matchDTOExt = MatchMapperExt.matchToDTO(matchDOExt);
    this.addPasse(match);
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise((resolve, reject) => {
      this.restClient.POST(new UriBuilder().fromPath(environment.backendBaseUrl).path('v1/match/spotter')
        .build(), this.matchDTOExt).then((result: string) => {
        resolve(result);
      }, (error: HttpErrorResponse) => {
        if (error.error === 401) {
          reject(SpotterResult.UNAUTHORIZED);
        } else {
          reject(SpotterResult.FAILURE);
        }
      });
    });
  }
  public getWettkampfIDundScheibe() {
    const url = window.location.href;
    const urlParts = url.split('/');
    const wkId = urlParts[5];
    console.log(wkId);
    const schreibe = urlParts[6];
    return {wkId, schreibe};
  }
  public addPasse(match: Match) {
    console.log(match.currentSet.plays[0].result);
    let j = 0;
    for (let i = 0; i < 3; i++) {
      const newPasse = {
        id: null,
        matchId: this.matchDTOExt.id,
        mannschaftId: this.matchDTOExt.mannschaftId,
        wettkampfId: this.matchDTOExt.wettkampfId,
        matchNr: this.matchDTOExt.matchNr,
        lfdNr: match.currentSetNumber,
        dsbMitgliedId: null,
        ringzahl: [match.currentSet.plays[i + j].result, match.currentSet.plays[i + j + 1].result, null, null, null, null],
        rueckennummer: i + 1
      };
      j += 1;
      this.matchDTOExt.passen.push(newPasse);
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
