import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class SchusszettelService {
  constructor(
    private http: HttpClient
  ) {
  }
  sendRueckennummern(payload: any) {
    // @Youmna: make sure the type of payload is correct, so that the backend knows its SCHUETZENMELDUNG
    return this.http.post('/v1/tablet-schusszettel', payload);
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

}
