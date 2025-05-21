import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class SchusszettelService {
  constructor(
    private http: HttpClient
  ) {
  }

  // Mock: fetch next pass number
  getNextPass(): Observable<number> {
    console.log('Fetching next pass number from backend...');
    return of(1); // Simulate pass number 1
  }

  // Mock: submit shots
  submitPassData(data: string[][]): Observable<boolean> {
    console.log('Submitting pass data:', data);
    return of(true); // Simulate success
  }

  // Mock: check if both teams submitted
  checkBothTeamsSubmitted(): Observable<boolean> {
    console.log('Checking if both teams submitted data...');
    return of(true); // Simulate both confirmed
  }
  sendRueckennummern(payload: any) {
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
