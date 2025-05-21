import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class SchusszettelService {
  constructor(
    private http: HttpClient
  ) {
  }
  sendRueckennummern(payload: any) {
    return this.http.post('/v1/tablet-schusszettel', payload);
  }
}
