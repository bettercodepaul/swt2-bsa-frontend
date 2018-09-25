import { Injectable } from '@angular/core';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {Data} from '../types/data';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
  })
};

@Injectable({
  providedIn: 'root'
})

export class RestClient {
  constructor(private http: HttpClient) {}

  public GET(url: string): Observable<any> {
    console.log('Send GET request to ' + url);

    return this.http.get(url, httpOptions);
  }

  public POST(url: string, payload: Data): Observable<Data> {
    console.log('Send POST request to ' + url + ' with payload ' + JSON.stringify(payload));

    return this.http.post<Data>(url, payload , httpOptions);
  }

  public PUT(url: string, payload: Data): Observable<any> {
    console.log('Send PUT request to ' + url + ' with payload ' + JSON.stringify(payload));

    return this.http.put(url, payload, httpOptions);
  }

  public DELETE(url: string): Observable<any> {
    console.log('Send DELETE request to ' + url);

    return this.http.delete(url, httpOptions);
  }
}
