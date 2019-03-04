import {Injectable} from '@angular/core';
import {isNullOrUndefined} from 'util';
import {Observable} from 'rxjs';
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

const UNEXPECTED_ERROR = 'UNEXPECTED_ERROR';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {

  constructor(private notificationService: NotificationService) {
  }

  // handle http errors
  public handleHttpError(httpError: any): Observable<any> {
    const errorDto: ErrorDTO = httpError.error;

    const statusCode = httpError.status;
    const errorCategory: number = Math.round(statusCode / 100);

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

    throw httpError;


  }

  // create notification
  private handleUnexpectedError(statusCode: number, errorDto: ErrorDTO) {
    console.error('Unexpected error: ' + statusCode + `body was: ${JSON.stringify(errorDto)}`);

    const notification: Notification = {
      id: UNEXPECTED_ERROR,
      title: 'NOTIFICATION.ERROR.' + UNEXPECTED_ERROR + '.TITLE',
      description: 'NOTIFICATION.ERROR.' + UNEXPECTED_ERROR + '.DESCRIPTION',
      severity: NotificationSeverity.ERROR,
      origin: NotificationOrigin.USER,
      type: NotificationType.OK,
      userAction: NotificationUserAction.PENDING
    };

    this.notificationService.showNotification(notification);
  }

  private handleHttpClientError(statusCode: number, errorDto: ErrorDTO) {
    console.error('Client error');

    if (statusCode === HTTP_FORBIDDEN) {
      console.error('FORBIDDEN');
    } else if (statusCode === HTTP_BAD_REQUEST && isNullOrUndefined(errorDto)) {
      errorDto = {errorCode: 'BAD_REQUEST', errorMessage: null, param: null};
    } else if (statusCode === HTTP_NOT_FOUND) {
      errorDto = {errorCode: 'ENTITY_NOT_FOUND_ERROR', errorMessage: null, param: null};
    }

    console.warn(
      `body was: ${JSON.stringify(errorDto)}`);


    const notification: Notification = {
      id: errorDto.errorCode,
      title: 'NOTIFICATION.ERROR.' + errorDto.errorCode + '.TITLE',
      description: 'NOTIFICATION.ERROR.' + errorDto.errorCode + '.DESCRIPTION',
      details: errorDto.errorMessage,
      severity: NotificationSeverity.ERROR,
      origin: NotificationOrigin.USER,
      type: NotificationType.OK,
      userAction: NotificationUserAction.PENDING
    };

    this.notificationService.showNotification(notification);
  }

  private handleHttpServerError(statusCode: number, errorDto: ErrorDTO) {
    console.error(`Server error: body was: ${JSON.stringify(errorDto)}`);


    const notification: Notification = {
      id: errorDto.errorCode,
      title: 'NOTIFICATION.ERROR.' + errorDto.errorCode + '.TITLE',
      description: 'NOTIFICATION.ERROR.' + errorDto.errorCode + '.DESCRIPTION',
      details: errorDto.errorMessage,
      severity: NotificationSeverity.ERROR,
      origin: NotificationOrigin.USER,
      type: NotificationType.OK,
      userAction: NotificationUserAction.PENDING
    };

    this.notificationService.showNotification(notification);

  }

  private handleHttpConnectionError(statusCode: number, errorDto: ErrorDTO) {
    const connectionError = 'CONNECTION_ERROR';

    const notification: Notification = {
      id: connectionError,
      title: 'NOTIFICATION.ERROR.' + connectionError + '.TITLE',
      description: 'NOTIFICATION.ERROR.' + connectionError + '.DESCRIPTION',
      severity: NotificationSeverity.ERROR,
      origin: NotificationOrigin.SYSTEM,
      type: NotificationType.OK,
      userAction: NotificationUserAction.PENDING
    };

    this.notificationService.showNotification(notification);
  }
}
