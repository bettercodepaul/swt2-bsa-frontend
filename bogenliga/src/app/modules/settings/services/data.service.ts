import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { Data } from './../types/data';
import { DATA } from './../mock-data';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  indexSelectedData = -1;

  constructor() { }

  getData(): Observable<Data[]> {
    return of(DATA);
  }

  getIndexSelectedData(): number {
    return this.indexSelectedData;
  }

  setIndexSelectedData(index: number) {
    this.indexSelectedData = index;
  }
}
