import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class SchusszettelService {
  constructor(
    private http: HttpClient
  ) {
  }

  sendRueckennummern(token: string, wettkampfId: number, teamId: number, meldungen: any[]) {
    const payload = {
      typ: 'SCHUETZENMELDUNG',
      meldungen
    };

    const params = new HttpParams()
      .set('token', token)
      .set('wettkampfid', wettkampfId.toString())
      .set('teamid', teamId.toString());

    return this.http.post('/api/tablet-schusszettel', payload, { params });
  }

  getTabletSessions() {
    return this.http.get<any[]>('/v1/tablet-schusszettel/sessions');
  }
  getSchusszettel(token: string, wettkampfid: number, teamid: number) {
    const params = new HttpParams()
      .set('token', token)
      .set('wettkampfid', wettkampfid.toString())
      .set('teamid', teamid.toString());

    return this.http.get('/api/tablet-schusszettel', { params });
  }

  /* @Youmna You need to create the DO class for the schusszettel and implement the mapper like I did in the Backend
  public findTeams(wettkampfId: number): Promise<BogenligaResponse<TabletSessionDO[]>> {
    const api_url = new UriBuilder()
      .fromPath(this.getUrl()) // entspricht 'v1/tabletsessions'
      .path(wettkampfId.toString())
      .build(); // ergibt z.B. v1/tabletsessions/1

    return new Promise((resolve, reject) => {
      this.restClient.GET<TabletSessionDTO[]>(api_url)
          .then((data: TabletSessionDTO[]) => {
            const sessions = data.map((dto) => TabletSessionMapper.tabletSessionToDO(dto));
            resolve({ result: RequestResult.SUCCESS, payload: sessions });
          }, (error: HttpErrorResponse) => {
            if (error.status === 0) {
              reject({ result: RequestResult.CONNECTION_PROBLEM });
            } else {
              reject({ result: RequestResult.FAILURE });
            }
          });
    });
  }
  */
  submitPassData(passe: any) {
    return this.http.post('/v1/passen', passe);
  }

}
