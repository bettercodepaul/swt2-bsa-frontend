import {Injectable} from '@angular/core';
import {Notification, NotificationUserAction} from './types';
import {
  ACCEPT_NOTIFICATION,
  DECLINE_NOTIFICATION,
  NotificationState,
  ShowNotification
} from '../../redux-store/feature/notification';
import {select, Store} from '@ngrx/store';
import {AppState, NOTIFICATION_STATE} from '../../redux-store';
import {Observable} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {isNullOrUndefined} from 'util';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notificationActive = false;
  private currentNotification: Notification = null;

  constructor(private store: Store<AppState>) {
    this.observeCurrentNotifications();
  }

  public showNotification(notification: Notification): void {
    this.store.dispatch(new ShowNotification(notification));
  }

  public getCurrentNotification(): Notification {
    return this.currentNotification;
  }

  public observeNotification(notificationId: string): Observable<Notification> {
    return this.store.pipe(
      select(NOTIFICATION_STATE),
      filter(state => !isNullOrUndefined(state)),
      filter(state => state.notification.id === notificationId),
      map(state => state.notification));
  }

  public updateNotification(userAction: NotificationUserAction) {
    if (userAction === NotificationUserAction.ACCEPTED) {
      this.store.dispatch({type: ACCEPT_NOTIFICATION});

    } else if (userAction === NotificationUserAction.DECLINED) {
      this.store.dispatch({type: DECLINE_NOTIFICATION});

    }
  }

  public observeNotifications(): Observable<NotificationState> {
    return this.store.pipe(select(NOTIFICATION_STATE));
  }

  /**
   * I select the {@code NOTIFICATION_STATE} of the application redux state and map the values to local copies.
   *
   */
  private observeCurrentNotifications() {
    this.store.pipe(select(NOTIFICATION_STATE)).subscribe((state: NotificationState) => {
      this.notificationActive = state.showNotification;
      this.currentNotification = state.notification;
    });
  }
}
