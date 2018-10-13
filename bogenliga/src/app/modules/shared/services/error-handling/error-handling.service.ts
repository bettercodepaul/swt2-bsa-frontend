import {Injectable} from '@angular/core';
import {isNullOrUndefined} from 'util';
import {Observable, of} from 'rxjs';
import {ErrorDTO} from './types/error-dto.class';
import {
  Notification,
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '../notification';

// client errors
const HTTP_BAD_REQUEST = 400;
const HTTP_UNAUTHORIZED = 401;
const HTTP_FORBIDDEN = 403;
const HTTP_NOT_FOUND = 404;
const HTTP_UNPROCESSABLE_ENTITY = 422;
// server errors
const HTTP_INTERNAL_SERVER_ERROR = 500;
const HTTP_SERVICE_UNAVAILABLE = 503;

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {

  constructor(private notificationService: NotificationService) {
  }

  // handle http errors
  public handleHttpError(httpError: any): Observable<any> {

    if (isNullOrUndefined(httpError) || isNullOrUndefined(httpError.error)) {
      this.handleUnexpectedError(-1, null);
    }

    const errorDto: ErrorDTO = httpError.error;

    const statusCode = httpError.status;
    const errorCategory: number = Math.round(statusCode / 100);

    console.log(errorCategory);

    if (errorCategory === 4) {
      this.handleHttpClientError(statusCode, errorDto);
    } else if (errorCategory === 5) {
      this.handleHttpServerError(statusCode, errorDto);
    } else if (errorCategory === 0) {
      this.handleHttpConnectionError(statusCode, errorDto);
      throw httpError;
    } else {
      this.handleUnexpectedError(statusCode, errorDto);
    }

    return of(httpError);
  }

  // create notification
  private handleUnexpectedError(statusCode: number, errorDto: ErrorDTO) {
    console.error('Unexpected error: ' + statusCode);

    console.error(
      `body was: ${JSON.stringify(errorDto)}`);
  }

  private handleHttpClientError(statusCode: number, errorDto: ErrorDTO) {
    console.error('Client error');

    if (statusCode === HTTP_FORBIDDEN) {
      console.error('FORBIDDEN');

    }

    console.warn(
      `body was: ${JSON.stringify(errorDto)}`);


    const notification: Notification = {
      id:          errorDto.errorCode,
      title:       'NOTIFICATION.ERROR.' + errorDto.errorCode + '.TITLE',
      description: 'NOTIFICATION.ERROR.' + errorDto.errorCode + '.DESCRIPTION',
      details:     errorDto.errorMessage,
      severity:    NotificationSeverity.ERROR,
      origin:      NotificationOrigin.USER,
      type:        NotificationType.OK,
      userAction:  NotificationUserAction.PENDING
    };

    this.notificationService.showNotification(notification);
  }

  private handleHttpServerError(statusCode: number, errorDto: ErrorDTO) {
    console.error('Server error');


    console.warn(
      `body was: ${JSON.stringify(errorDto)}`);


    const notification: Notification = {
      id:          errorDto.errorCode,
      title:       'NOTIFICATION.ERROR.' + errorDto.errorCode + '.TITLE',
      description: 'NOTIFICATION.ERROR.' + errorDto.errorCode + '.DESCRIPTION',
      details:     errorDto.errorMessage,
      severity:    NotificationSeverity.ERROR,
      origin:      NotificationOrigin.USER,
      type:        NotificationType.OK,
      userAction:  NotificationUserAction.PENDING
    };

    this.notificationService.showNotification(notification);

  }

  private handleHttpConnectionError(statusCode: number, errorDto: ErrorDTO) {
    const connectionError = 'CONNECTION_ERROR';

    const notification: Notification = {
      id:          connectionError,
      title:       'NOTIFICATION.ERROR.' + connectionError + '.TITLE',
      description: 'NOTIFICATION.ERROR.' + connectionError + '.DESCRIPTION',
      severity:    NotificationSeverity.ERROR,
      origin:      NotificationOrigin.SYSTEM,
      type:        NotificationType.OK,
      userAction:  NotificationUserAction.PENDING
    };

    this.notificationService.showNotification(notification);
  }
}
