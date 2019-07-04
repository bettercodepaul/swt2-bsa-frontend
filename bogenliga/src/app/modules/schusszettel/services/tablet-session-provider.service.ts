import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {
  BogenligaResponse,
  DataProviderService,
  RequestResult,
  RestClient,
  UriBuilder
} from '../../shared/data-provider';
import {TabletSessionDO} from '../types/tablet-session-do.class';
import {TabletSessionMapper} from '../mapper/tablet-session-mapper';
import {TabletSessionDTO} from '../types/datatransfer/tablet-session-dto.class';

@Injectable({
  providedIn: 'root'
})
export class TabletSessionProviderService extends DataProviderService {

  serviceSubUrl = 'v1/tabletsessions';

  constructor(private restClient: RestClient) {
    super();
  }

  public findAllTabletSessions(wettkampfId: string): Promise<BogenligaResponse<Array<TabletSessionDO>>> {
    return new Promise((resolve, reject) => {
      this.restClient.GET<Array<TabletSessionDTO>>(new UriBuilder().fromPath(this.getUrl()).path(wettkampfId).build())
          .then((data: Array<TabletSessionDTO>) => {
            const sessions = [];
            for (const session of data) {
              sessions.push(TabletSessionMapper.tabletSessionToDO(session))
            }
            resolve({result: RequestResult.SUCCESS, payload: sessions});
          }, (error: HttpErrorResponse) => {
            if (error.status === 0) {
              reject({result: RequestResult.CONNECTION_PROBLEM});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    });
  }

  public findTabletSession(wettkampfId: string, scheibenNr: string): Promise<BogenligaResponse<TabletSessionDO>> {
    const api_url = new UriBuilder().fromPath(this.getUrl()).path(wettkampfId).path(scheibenNr).build();
    return new Promise((resolve, reject) => {
      this.restClient.GET<TabletSessionDTO>(api_url)
          .then((data: TabletSessionDTO) => {
            resolve({result: RequestResult.SUCCESS, payload: TabletSessionMapper.tabletSessionToDO(data)});
          }, (error: HttpErrorResponse) => {
            if (error.status === 0) {
              reject({result: RequestResult.CONNECTION_PROBLEM});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    });
  }

  public create(session: TabletSessionDO, wettkampfId: string, scheibenNr: string): Promise<BogenligaResponse<TabletSessionDO>> {
    const api_url = new UriBuilder().fromPath(this.getUrl()).path(wettkampfId).path(scheibenNr).build();
    return new Promise(((resolve, reject) => {
      this.restClient.POST(api_url, TabletSessionMapper.tabletSessionToDTO(session))
          .then((data: TabletSessionDTO) => {
            resolve({result: RequestResult.SUCCESS, payload: TabletSessionMapper.tabletSessionToDO(data)});
          }, (error: HttpErrorResponse) => {
            if (error.status === 0) {
              reject({result: RequestResult.CONNECTION_PROBLEM});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    }));
  }

  public update(session: TabletSessionDO): Promise<BogenligaResponse<TabletSessionDO>> {
    return new Promise(((resolve, reject) => {
      this.restClient.PUT(this.getUrl(), TabletSessionMapper.tabletSessionToDTO(session))
          .then((data: TabletSessionDTO) => {
            resolve({result: RequestResult.SUCCESS, payload: TabletSessionMapper.tabletSessionToDO(data)});
          }, (error: HttpErrorResponse) => {
            if (error.status === 0) {
              reject({result: RequestResult.CONNECTION_PROBLEM});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    }));
  }

  public delete(wettkampfId: string, scheibenNr: string): Promise<BogenligaResponse<any>> {
    const api_url = new UriBuilder().fromPath(this.getUrl()).path(wettkampfId).path(scheibenNr).build();
    return new Promise((resolve, reject) => {
      this.restClient.DELETE<any>(api_url)
          .then((data: any) => {
            resolve({result: RequestResult.SUCCESS, payload: data});
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
