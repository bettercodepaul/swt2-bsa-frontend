import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {TabletSessionSingMapper} from '../mapper/tablet-session-sing-mapper';
import {TabletSessionSingDO} from '../types/tablet-session-sing-do.class';
import {TabletSessionSingDTO} from '../types/datatransfer/tablet-session-sing-dto.class';
import {Observable} from 'rxjs';
import {TabletSessionInfoDTO} from '../types/datatransfer/tablet-session-info-dto.class';
import {map} from 'rxjs/operators';

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

  submitPassData(passe: any) {
    return this.http.post('/v1/passen', passe);
  }

  getSessions(wettkampfId: number): Observable<TabletSessionSingDO[]> {
    const params = new HttpParams().set('wettkampfid', wettkampfId.toString());

    return this.http.get<TabletSessionInfoDTO>(
      '/v1/tablet-schusszettel/sessions',
      { params }
    ).pipe(
      map((response) => {
        const dtos: TabletSessionSingDTO[] = response.tabletSessionSingDTOs;
        return dtos.map((dto) => TabletSessionSingMapper.fromDTO(dto));
      })
    );
  }
}
