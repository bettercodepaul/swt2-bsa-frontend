import {Action} from '@ngrx/store';
import {Notification} from '../../../services/notification';

export const SHOW_NOTIFICATION = '[Navigation] Show Notification';
export const ACCEPT_NOTIFICATION = '[Navigation] Accept Notification';
export const DECLINE_NOTIFICATION = '[Navigation] Decline Notification';
export const DISCARD_NOTIFICATION = '[Navigation] Descard Notification';

export class ShowNotification implements Action {
  readonly type = SHOW_NOTIFICATION;

  constructor(public payload: Notification) {
  }
}

export class AcceptNotification implements Action {
  readonly type = ACCEPT_NOTIFICATION;
}

export class DeclineNotification implements Action {
  readonly type = DECLINE_NOTIFICATION;
}

export class DiscardNotification implements Action {
  readonly type = DISCARD_NOTIFICATION;
}

export type NotificationAction = ShowNotification | AcceptNotification | DeclineNotification | DiscardNotification;
