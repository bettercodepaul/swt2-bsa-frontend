import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { TabletSchusszettelDTO } from '../types/tablet-schusszettel-dto';
import { TabletSchusszettelMapper } from '../mapper/tablet-schusszettel-mapper';
import { TabletSchusszettel } from '../models/tablet-schusszettel.model';

import { SatzEingabeDTO, SchuetzenSatzDTO } from '../types/datatransfer/satz-eingabe-dto';
import { TabletSessionInfoDTO } from '../types/datatransfer/tablet-session-info-dto.class';
import { TabletSessionSingDO } from '../types/tablet-session-sing-do.class';
import { TabletSessionSingMapper } from '../mapper/tablet-session-sing-mapper';
import {DataProviderService} from '@shared/data-provider';

import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class SchusszettelService {

  private readonly baseUrl = `${environment.backendBaseUrl}/v1/tablet-schusszettel`;

  constructor(private http: HttpClient) {}

  /**
   * Holt den aktuellen Zustand des Tablets.
   */
  getSchusszettel(
    token: string,
    wettkampfid: number,
    teamid: number
  ): Observable<TabletSchusszettel> {
    const params = new HttpParams()
      .set('token', token)
      .set('wettkampfid', wettkampfid.toString())
      .set('teamid', teamid.toString());

    return this.http
               .get<TabletSchusszettelDTO>(this.baseUrl, { params })
               .pipe(map((dto) => TabletSchusszettelMapper.fromDTO(dto)));
  }

  /**
   * SATZEINGABE: sendet { typ: 'SATZEINGABE', satzeingabe: [...] }
   */
  postSatzEingabe(
    token: string,
    wettkampfid: number,
    teamid: number,
    satzeingabe: SchuetzenSatzDTO[]
  ): Observable<void> {
    const params = new HttpParams()
      .set('token', token)
      .set('wettkampfid', wettkampfid.toString())
      .set('teamid', teamid.toString());

    // match Java: Map<String,Object> payload containing typ + DTO
    const payload: SatzEingabeDTO & { typ: 'SATZEINGABE' } = {
      typ: 'SATZEINGABE',
      satzeingabe
    };

    return this.http.post<void>(this.baseUrl, payload, { params });
  }

  /**
   * SCHUETZENMELDUNG: sendet { typ: 'SCHUETZENMELDUNG', meldungen: [...] }
   */
  postSchuetzenMeldung(
    token: string,
    wettkampfid: number,
    teamid: number,
    meldungen: number[]
  ): Observable<void> {
    const params = new HttpParams()
      .set('token', token)
      .set('wettkampfid', wettkampfid.toString())
      .set('teamid', teamid.toString());

    const payload = {
      typ: 'SCHUETZENMELDUNG' as const,
      meldungen
    };

    return this.http.post<void>(this.baseUrl, payload, { params });
  }

  /**
   * Holt alle Sessions für den Wettkampf. (Wettkampfleiter-Rechte erforderlich)
   */
  getSessions(wettkampfid: number): Observable<TabletSessionSingDO[]> {
    const params = new HttpParams().set('wettkampfid', wettkampfid.toString());

    return this.http
               .get<TabletSessionInfoDTO>(`${this.baseUrl}/sessions`, { params })
               .pipe(
                 map((dto) =>
                   dto.tabletSessionSingDTOs.map((d) => TabletSessionSingMapper.fromDTO(d))
                 )
               );
  }

  /**
   * Token zurücksetzen (Wettkampfleiter-Rechte erforderlich)
   */
  resetTabletToken(
    wettkampfid: number,
    teamid: number
  ): Observable<void> {
    const params = new HttpParams()
      .set('wettkampfid', wettkampfid.toString())
      .set('teamid', teamid.toString());

    return this.http.post<void>(`${this.baseUrl}/tokenize`, null, { params });
  }
}
