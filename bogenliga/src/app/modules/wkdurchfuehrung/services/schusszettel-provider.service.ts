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
import {toDTOFromOfflineMatch, toDTOFromOfflineMatchArray} from '@verwaltung/mapper/match-offline-mapper';
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

  public async findMatches(match1Id: string, match2Id: string): Promise<BogenligaResponse<Array<MatchDOExt>>> {
    if(this.onOfflineService.isOffline()){
      let passen = []
      //holt Passen für beide matches aus der offlinedb um dann daraus Matchobjekte mit passen darin zu machen
      await this.passeDataProvider.findOfflineByMatchIds(Number(match1Id),Number(match2Id))
          .then(item => {
            passen = toPasseDTOFromDoClassArray(item.payload)
          });
      return this.offlineFindMatches(Number(match1Id),Number(match2Id),passen)
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

  public create(match1: MatchDOExt, match2: MatchDOExt): Promise<BogenligaResponse<Array<MatchDOExt>>> {
    const match1DTO = MatchMapperExt.matchToDTO(match1);
    const match2DTO = MatchMapperExt.matchToDTO(match2);
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
