import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Data} from '../types/data';

@Injectable({
  providedIn: 'root'
})
export class RestClient {
  constructor(private http: HttpClient) {}

  public GET(url: string): Observable<any> {
    return this.http.get(url);
  }

  public POST(url: string, payload: Data): Observable<any> {
    return this.http.post(url, payload);
  }

  public PUT(url: string, payload: Data): Observable<any> {
    return this.http.put(url, payload);
  }

  public DELETE(url: string): Observable<any> {
    return this.http.delete(url);
  }
}
