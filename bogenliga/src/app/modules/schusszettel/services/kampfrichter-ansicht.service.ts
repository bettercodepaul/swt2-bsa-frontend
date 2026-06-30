import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';

export interface KampfrichterMatchDO {
  matchId: number;
  nr: number;
  begegnung: number;
  matchScheibennummer: number;
  mannschaftId: number;
  mannschaftName: string;
  strafPunkteSatz1: number;
  strafPunkteSatz2: number;
  strafPunkteSatz3: number;
  strafPunkteSatz4: number;
  strafPunkteSatz5: number;
  sessionStatus?: string;
}

@Injectable({providedIn: 'root'})
export class KampfrichterAnsichtService {

  private readonly baseUrl = `${environment.backendBaseUrl}/v1/kampfrichter-session`;

  constructor(private http: HttpClient) {}

  getOrCreateToken(wettkampfId: number): Observable<{token: string}> {
    const params = new HttpParams().set('wettkampfid', wettkampfId.toString());
    return this.http.get<{token: string}>(`${this.baseUrl}/token`, {params});
  }

  getMatches(wettkampfId: number, token: string): Observable<KampfrichterMatchDO[]> {
    const params = new HttpParams()
      .set('wettkampfid', wettkampfId.toString())
      .set('token', token);
    return this.http.get<KampfrichterMatchDO[]>(`${this.baseUrl}/matches`, {params});
  }

  updateStrafpunkte(
    wettkampfId: number,
    token: string,
    body: {matchId: number; strafPunkteSatz1: number; strafPunkteSatz2: number;
           strafPunkteSatz3: number; strafPunkteSatz4: number; strafPunkteSatz5: number}
  ): Observable<{message: string}> {
    const params = new HttpParams()
      .set('wettkampfid', wettkampfId.toString())
      .set('token', token);
    return this.http.put<{message: string}>(`${this.baseUrl}/strafpunkte`, body, {params});
  }
}
