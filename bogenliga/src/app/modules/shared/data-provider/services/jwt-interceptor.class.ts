import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // add authorization header with jwt token if available
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser && currentUser.jwt) {

      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.jwt}`
        }
      });
    }

    return next.handle(request);
  }
}
