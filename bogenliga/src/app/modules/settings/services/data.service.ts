import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { Data } from './../types/data';
import { DATA } from './../mock-data';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  getData(): Observable<Data[]> {
    return of(DATA);
  }
}
