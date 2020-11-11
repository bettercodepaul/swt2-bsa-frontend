import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {BogenligaResponse} from '../../../data-provider';
import {NotificationService} from '../../../services/notification';
import {
  Notification,
  NotificationOrigin,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '../../../services/notification/types';
import {ButtonComponent} from '../button/button.component';
import {DownloadButtonResourceProviderService} from './services/download-button-resource-provider.service';

const NOTIFICATION_DOWNLOAD_SUCCESS = 'download_success';
const NOTIFICATION_DOWNLOAD_FAILURE = 'download_failure';

@Component({
  selector: 'bla-download-button',
  templateUrl: './download-button.component.html'
})
export class DownloadButtonComponent extends ButtonComponent implements OnInit {

  @Input()
  public id: string;

  @Input()
  public downloadUrl: string;

  @Input()
  public fileName: string;

  @ViewChild('downloadLink', { static: true })
  private aElementRef: ElementRef;

  constructor(private downloadButtonResourceProvider: DownloadButtonResourceProviderService,
              private notificationService: NotificationService) {
    super();
  }

  ngOnInit() {
  }

  public onFileDownload(): void {
    this.loading = true;
    if(this.id === 'downloadBogenkontrollliste'){
      this.downloadButtonResourceProvider.download(this.downloadUrl, this.fileName, this.aElementRef)
          .then((() => this.handleBogenkontrolllisteFailure()))
          .catch((() => this.handleBogenkontrolllisteFailure()));
    }
    else if (this.id === 'downloadSetzliste' || this.id === 'downloadSchusszettel' || this.id === 'downloadMeldezettel') {
      this.downloadButtonResourceProvider.download(this.downloadUrl, this.fileName, this.aElementRef)
        .then((() => this.handleWithoutNotification()))
        .catch((() => this.handleWithoutNotification()));
    } else {
      this.downloadButtonResourceProvider.download(this.downloadUrl, this.fileName, this.aElementRef)
        .then((response) => this.handleSuccess(response))
        .catch((response) => this.handleFailure(response));
    }
  }

  private handleWithoutNotification(): void {
    this.loading = false;
  }

  private handleSuccess(response: BogenligaResponse<string>): void {

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
        .subscribe((myNotification) => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            console.log('Download ' + this.fileName + ' from ' + response.payload + ' completed');
            this.loading = false;
          }
        });

    this.notificationService.showNotification(notification);
  }

  private handleFailure(response: BogenligaResponse<void>): void {

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
        .subscribe((myNotification) => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            console.log('Download ' + this.fileName + ' failed');
            this.loading = false;
          }
        });

    this.notificationService.showNotification(notification);
  }

  private handleBogenkontrolllisteFailure() {
    const notification: Notification = {
      id: NOTIFICATION_DOWNLOAD_FAILURE,
      title: 'Download Failure:',
      description: 'You have first to create a full Setzliste',
      severity: NotificationSeverity.ERROR,
      origin: NotificationOrigin.USER,
      type: NotificationType.OK,
      userAction: NotificationUserAction.PENDING
    };

    this.loading = false;
    this.notificationService.showNotification(notification);
  }
}
