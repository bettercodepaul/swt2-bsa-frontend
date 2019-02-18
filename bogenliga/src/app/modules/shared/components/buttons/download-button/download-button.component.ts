import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ButtonComponent} from '../button/button.component';
import {DownloadButtonResourceProviderService} from './services/download-button-resource-provider.service';
import {Response} from '../../../data-provider';
import {
  Notification,
  NotificationOrigin,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '../../../services/notification/types';
import {NotificationService} from '../../../services/notification';

const NOTIFICATION_DOWNLOAD_SUCCESS = 'download_success';
const NOTIFICATION_DOWNLOAD_FAILURE = 'download_failure';

@Component({
  selector: 'bla-download-button',
  templateUrl: './download-button.component.html'
})
export class DownloadButtonComponent extends ButtonComponent implements OnInit {

  @Input()
  public downloadUrl: string;

  @Input()
  public fileName: string;

  @ViewChild('downloadLink')
  private aElementRef: ElementRef;

  constructor(private downloadButtonResourceProvider: DownloadButtonResourceProviderService,
    private notificationService: NotificationService) {
    super();
  }

  ngOnInit() {
  }

  public onFileDownload(): void {
    this.loading = true;

    this.downloadButtonResourceProvider.download(this.downloadUrl, this.fileName, this.aElementRef)
        .then(response => this.handleSuccess(response))
        .catch(response => this.handleFailure(response));
  }

  private handleSuccess(response: Response<string>): void {

    const notification: Notification = {
      id: NOTIFICATION_DOWNLOAD_SUCCESS,
      title: 'FILE_DOWNLOAD.NOTIFICATION.SUCCESS',
      description: this.fileName,
      severity: NotificationSeverity.INFO,
      origin: NotificationOrigin.USER,
      type: NotificationType.OK,
      userAction: NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DOWNLOAD_SUCCESS)
        .subscribe(myNotification => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            console.log('Download ' + this.fileName + ' from ' + response.payload + ' completed');
            this.loading = false;
          }
        });

    this.notificationService.showNotification(notification);
  }

  private handleFailure(response: Response<void>): void {

    const notification: Notification = {
      id: NOTIFICATION_DOWNLOAD_FAILURE,
      title: 'FILE_DOWNLOAD.NOTIFICATION.FAILURE',
      description: this.fileName,
      severity: NotificationSeverity.ERROR,
      origin: NotificationOrigin.USER,
      type: NotificationType.OK,
      userAction: NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DOWNLOAD_FAILURE)
        .subscribe(myNotification => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            console.log('Download ' + this.fileName + ' failed');
            this.loading = false;
          }
        });

    this.notificationService.showNotification(notification);
  }
}
