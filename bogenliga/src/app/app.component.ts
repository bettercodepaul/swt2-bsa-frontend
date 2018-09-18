import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {
  Notification,
  NotificationOrigin,
  NotificationSeverity,
  NotificationType
} from './components/notification/types';

@Component({
  selector: 'bla-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'bla';
  open =  '';

  public notification: Notification = {
    title: 'Title',
    description: 'Description',
    severity: NotificationSeverity.QUESTION,
    origin: NotificationOrigin.SYSTEM,
    type: NotificationType.OK_CANCEL
  };
  constructor(private translate: TranslateService) {
    translate.setDefaultLang('de');
  }

  public isActive = true;

  public toggle(): void {
    this.isActive = !this.isActive;
  }


}


