import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {
  BogenligaResponse,
  DataProviderService,
  RequestResult,
  RestClient,
  UriBuilder
} from '../../shared/data-provider';
import {MatchDOExt} from '../types/match-do-ext.class';
import {MatchDTOExt} from '../types/datatransfer/match-dto-ext.class';
import {MatchMapperExt} from '../mapper/match-mapper-ext';
import {OnOfflineService} from '@shared/services';
import {db} from '@shared/data-provider/offlinedb/offlinedb';
import {OfflineMatch} from '@shared/data-provider/offlinedb/types/offline-match.interface';
import {toDTOFromOfflineMatch} from '@verwaltung/mapper/match-offline-mapper';
import {PasseDataProviderService} from '@wettkampf/services/passe-data-provider.service';
import {toPasseDTOFromDoClassArray} from '@verwaltung/mapper/passe-offline-mapper';
import {PasseDTO} from '@wkdurchfuehrung/types/datatransfer/passe-dto.class';

@Injectable({
  providedIn: 'root'
})
export class SchusszettelProviderService extends DataProviderService {

  serviceSubUrl = 'v1/match/schusszettel';

  constructor(private restClient: RestClient, private onOfflineService: OnOfflineService, private passeDataProvider: PasseDataProviderService) {
    super();
  }

  public findMatches(match1Id: string, match2Id: string): Promise<BogenligaResponse<Array<MatchDOExt>>> {
    if(this.onOfflineService.isOffline()){
      let passen = []
      //holt Passen für beide matches aus der offlinedb um dann daraus Matchobjekte mit passen darin zu machen
      return new Promise((resolve, reject) => {
        this.passeDataProvider.findOfflineByMatchIds(Number(match1Id),Number(match2Id))
            .then(item => {
              passen = toPasseDTOFromDoClassArray(item.payload)
              this.offlineFindMatches(Number(match1Id),Number(match2Id),passen)
                  .then(matches => {
                    resolve({result: RequestResult.SUCCESS, payload: matches.payload})
                  });
            })
          .catch(err => console.error(err))
      });
    } else {
      return new Promise((resolve, reject) => {
        this.restClient.GET<Array<MatchDTOExt>>(new UriBuilder().fromPath(this.getUrl()).path(match1Id).path(match2Id).build())
            .then((data: Array<MatchDTOExt>) => {
              console.log('data in MatchDTO', data);
              const matches = [MatchMapperExt.matchToDO(data[0]), MatchMapperExt.matchToDO(data[1])];
              resolve({result: RequestResult.SUCCESS, payload: matches});
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

  private offlineFindMatches(match1Id: number, match2Id: number, passen: PasseDTO[]): Promise<BogenligaResponse<Array<MatchDOExt>>> {
    return new Promise((resolve, reject) =>{
      db.matchTabelle.bulkGet([match1Id,match2Id])
        .then((data: OfflineMatch[]) => {
          resolve({result: RequestResult.SUCCESS, payload: [MatchMapperExt.matchToDO(toDTOFromOfflineMatch(data[0],passen)),MatchMapperExt.matchToDO(toDTOFromOfflineMatch(data[1],passen))]});
        }, () => {
          reject({result: RequestResult.FAILURE});
        });
    });
  }

  private offlineAddPassen(match: MatchDTOExt){
    match.passen.filter(v => v).forEach(passe => {
      if(passe.id === null){
        db.passeTabelle.put({
          dsbMitgliedId:  passe.dsbMitgliedId,
          lfdNr:          passe.lfdNr,
          mannschaftId:   passe.mannschaftId,
          matchID:        passe.matchId,
          matchNr:        passe.matchNr,
          ringzahlPfeil1: passe.ringzahl[0],
          ringzahlPfeil2: passe.ringzahl[1],
          ringzahlPfeil3: passe.ringzahl[2],
          ringzahlPfeil4: passe.ringzahl[3],
          ringzahlPfeil5: passe.ringzahl[4],
          ringzahlPfeil6: 0,
          rueckennummer:  passe.rueckennummer,
          version:        2,
          wettkampfId:    passe.wettkampfId
        })
          .catch(err => console.error(err))
      } else {
        db.passeTabelle.update(passe.id, {
          dsbMitgliedId:  passe.dsbMitgliedId,
          lfdNr:          passe.lfdNr,
          mannschaftId:   passe.mannschaftId,
          matchID:        passe.matchId,
          matchNr:        passe.matchNr,
          ringzahlPfeil1: passe.ringzahl[0],
          ringzahlPfeil2: passe.ringzahl[1],
          ringzahlPfeil3: passe.ringzahl[2],
          ringzahlPfeil4: passe.ringzahl[3],
          ringzahlPfeil5: passe.ringzahl[4],
          ringzahlPfeil6: 0,
          rueckennummer:  passe.rueckennummer,
          wettkampfId:    passe.wettkampfId
        })
          .catch(err => console.error(err))
      }
    })
  }

  public create(match1: MatchDOExt, match2: MatchDOExt): Promise<BogenligaResponse<Array<MatchDOExt>>> {
    const match1DTO = MatchMapperExt.matchToDTO(match1);
    const match2DTO = MatchMapperExt.matchToDTO(match2);
    if(this.onOfflineService.isOffline()){
      return new Promise((resolve, reject) => {
        db.transaction('rw', db.matchTabelle, db.passeTabelle, tx => {
          db.matchTabelle.update(match1DTO.id, {
            matchpkt:         match1DTO.matchpunkte,
            satzpunkte:       match1DTO.satzpunkte,
            strafpunkteSatz1: match1DTO.strafPunkteSatz1,
            strafpunkteSatz2: match1DTO.strafPunkteSatz2,
            strafpunkteSatz3: match1DTO.strafPunkteSatz3,
            strafpunkteSatz4: match1DTO.strafPunkteSatz4,
            strafpunkteSatz5: match1DTO.strafPunkteSatz5,
            version:          match1DTO.version++,
          });
          db.matchTabelle.update(match2DTO.id, {
            matchpkt:         match2DTO.matchpunkte,
            satzpunkte:       match2DTO.satzpunkte,
            strafpunkteSatz1: match2DTO.strafPunkteSatz1,
            strafpunkteSatz2: match2DTO.strafPunkteSatz2,
            strafpunkteSatz3: match2DTO.strafPunkteSatz3,
            strafpunkteSatz4: match2DTO.strafPunkteSatz4,
            strafpunkteSatz5: match2DTO.strafPunkteSatz5,
            version:          match2DTO.version++,
          });

          this.offlineAddPassen(match1DTO);

          this.offlineAddPassen(match2DTO);

          db.passeTabelle.where('matchID').equals(match1DTO.id).or('matchID').equals(match2DTO.id).modify(passe => {
            if(passe.version)
              passe.version += 1;
            else
              passe.version = 2;
          });
        })
          .then(() => {
            this.findMatches(match1DTO.id.toString(), match2DTO.id.toString())
              .then(matches => resolve({result: RequestResult.SUCCESS, payload: matches.payload}))
          })
          .catch(err => reject(err))
      });
    } else {
      return new Promise(((resolve, reject) => {
        this.restClient.POST(this.getUrl(), [match1DTO, match2DTO])
            .then((data: Array<MatchDTOExt>) => {
              const matches = [MatchMapperExt.matchToDO(data[0]), MatchMapperExt.matchToDO(data[1])];
              resolve({result: RequestResult.SUCCESS, payload: matches});
            }, (error: HttpErrorResponse) => {
              if (error.status === 0) {
                reject({result: RequestResult.CONNECTION_PROBLEM});
              } else {
                reject({result: RequestResult.FAILURE});
              }
            });
      }));
    }
  }
}
