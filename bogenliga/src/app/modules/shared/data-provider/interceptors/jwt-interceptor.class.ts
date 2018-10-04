import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {LocalDataProviderService} from '../../local-data-provider/services/local-data-provider.service';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptor implements HttpInterceptor {

  constructor(private localDataProviderService: LocalDataProviderService) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // add authorization header with jwt token if available
    const value = this.localDataProviderService.get('current_user');
    if (value) {
      let currentUser = JSON.parse(value);

      if (currentUser && currentUser.jwt) {

        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${currentUser.jwt}`
          }
        });
      }
    }

    return next.handle(request);
  }
}
