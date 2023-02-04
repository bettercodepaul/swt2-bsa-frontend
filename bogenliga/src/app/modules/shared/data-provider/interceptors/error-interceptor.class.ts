import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {ErrorHandlingService} from '../../services/error-handling';
import {Router} from '@angular/router';
import {CurrentUserService} from '@shared/services';
import {isNullOrUndefined} from "@shared/functions";

const MAX_RETRIES = 2;


@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router, private errorHandlingService: ErrorHandlingService, private currentUserService: CurrentUserService) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request)

               .pipe(
                 // add retries
                 retry(MAX_RETRIES),
                 // add error handling
                 catchError(
                   (error: any, caught: Observable<HttpEvent<any>>) => {

                     // handle connection (0), client (4xx), server (5xx) and custom error codes (9xx)
                     // if it is a connection error, it could be a masked error indicated by an expired session token
                     // this is very likely, so the user should be routed to the login-site again and
                     // of course for the system itself the currentUser should be logged out

                     //The backend is not able to send custom messages due to security aspects in the spring filter configurations
                     //Therefore is a special handling needed to provide the user with the correct error message
                     //for an expired jwt token

                     //TODO Locally the backend returns 0 as status code and on the DEV-Environment it returns 401
                     //TODO More research is needed to why the server return different status codes
                     if (error.status === 0 || error.status === 401) {
                       console.log('Exipred Token', error);
                       if (isNullOrUndefined(error.error)) {
                         error.error = {};
                       }
                       error.error.errorCode = 'NO_SESSION_ERROR';
                       error.error.errorMessage = 'Your Session Token is expired pleas login again';
                       error.status = 401;
                       return this.errorHandlingService.handleHttpError(error);
                       // caught and handle the error
                       // return of(error);
                     } else if (error.status >= 400) {
                       return this.errorHandlingService.handleHttpError(error);
                     }

                     throw error;
                   })
               );
  }
}
