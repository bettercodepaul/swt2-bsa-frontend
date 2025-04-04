import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SchusszettelService {

  // Mock: simulate backend confirming registration
  confirmRueckennummern(data: string[]): Observable<boolean> {
    console.log('Sending Rückennummern to backend:', data);
    return of(true); // Simulate success
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
}
