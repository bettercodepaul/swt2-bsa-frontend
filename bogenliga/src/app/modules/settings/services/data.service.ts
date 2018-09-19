import { Injectable } from '@angular/core';

import { Data } from './../types/data';
import { DATA } from './../mock-data';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  getData(): Data[] {
    return DATA;
  }
}
