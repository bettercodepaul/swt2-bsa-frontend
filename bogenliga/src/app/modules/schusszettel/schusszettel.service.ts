import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {HttpClient} from '@angular/common/http';

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
}
