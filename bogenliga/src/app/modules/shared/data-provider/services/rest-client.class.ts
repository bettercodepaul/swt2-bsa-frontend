import {Injectable} from '@angular/core';

import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {TransferObject} from '../models/transfer-object.interface';
import {catchError} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE, OPTIONS'
  })
};

@Injectable({
  providedIn: 'root'
})
export class RestClient {
  constructor(private http: HttpClient) {
  }

  public GET(url: string): Observable<any> {
    console.log('Send GET request to ' + url);

    return this.http.get(url, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  public POST(url: string, payload: TransferObject): Observable<any> {
    console.log('Send POST request to ' + url + ' with payload ' + JSON.stringify(payload));

    return this.http.post(url, payload, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  public PUT(url: string, payload: TransferObject): Observable<any> {
    console.log('Send PUT request to ' + url + ' with payload ' + JSON.stringify(payload));

    return this.http.put(url, payload, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  public DELETE(url: string): Observable<any> {
    console.log('Send DELETE request to ' + url);

    return this.http.delete(url, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.warn(
        `Backend returned status code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`);
    }
    return throwError(error);
  };
}
