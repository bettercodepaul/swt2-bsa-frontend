import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CurrentUserService} from '../../services/current-user';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptor implements HttpInterceptor {

  constructor(private currentUserService: CurrentUserService) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    try {
      // add authorization header with jwt token if available
      const jwt = this.currentUserService.getJsonWebToken();

      if (jwt) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${jwt}`
          }
        });
      }

    } catch (e) {
      // TODO correct error handling
      console.log('JWT token could not be append to http request header. Please login.');
    }

    return next.handle(request);
  }
}
