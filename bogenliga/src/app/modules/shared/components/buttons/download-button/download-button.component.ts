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

    if (this.id === 'downloadBogenkontrollliste') {
      this.downloadButtonResourceProvider.download(this.downloadUrl, this.fileName, this.aElementRef)
          .then((response) => this.handleWithoutNotification(response))
          .catch((() => this.handleBogenkontrolllisteFailure()));
    } else if (this.id === 'downloadSchusszettel') {
      this.downloadButtonResourceProvider.download(this.downloadUrl, this.fileName, this.aElementRef)
          .then((response) => this.handleWithoutNotification(response))
          .catch((() => this.handleSchusszettelFailure()));
    } else if (this.id === 'downloadMeldezettel') {
      this.downloadButtonResourceProvider.download(this.downloadUrl, this.fileName, this.aElementRef)
          .then((response) => this.handleWithoutNotification(response))
          .catch((() => this.handleMeldezettelFailure()));
    } else if(this.id == 'downloadEinzelstatistik') {
      this.downloadButtonResourceProvider.download(this.downloadUrl, this.fileName, this.aElementRef)
          .then((response) => this.handleWithoutNotification(response))
          .catch(() => this.handleEinzelstatistikFailure());
    } else if(this.id == 'downloadGesamtstatistik') {
      this.downloadButtonResourceProvider.download(this.downloadUrl, this.fileName, this.aElementRef)
          .then((response) => this.handleWithoutNotification(response))
          .catch(() => this.handleGesamtstatistikFailure());
    } else if (this.id === 'downloadSetzliste') {
      this.downloadButtonResourceProvider.download(this.downloadUrl, this.fileName, this.aElementRef)
          .then((response) => this.handleWithoutNotification(response))
          .catch((() => this.handleSetzlisteFailure()));
    } else {
      this.downloadButtonResourceProvider.download(this.downloadUrl, this.fileName, this.aElementRef)
          .then((response) => this.handleSuccess(response))
          .catch((response) => this.handleFailure(response));
    }
  }

  private handleWithoutNotification(response: BogenligaResponse<string>): void {
    console.log('Download ' + this.fileName + ' from ' + response.payload + ' completed');
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
    this.loading = false;
    this.notificationService.observeNotification(NOTIFICATION_DOWNLOAD_SUCCESS)
        .subscribe((myNotification) => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            console.log('Download ' + this.fileName + ' from ' + response.payload + ' completed');
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
      title: 'SPORTJAHRESPLAN.BOGENKONTROLLLISTE.NOTIFICATION.DOWNLOADFEHLER.TITLE',
      description: 'SPORTJAHRESPLAN.BOGENKONTROLLLISTE.NOTIFICATION.DOWNLOADFEHLER.DESCRIPTION',
      severity: NotificationSeverity.ERROR,
      origin: NotificationOrigin.USER,
      type: NotificationType.OK,
      userAction: NotificationUserAction.PENDING
    };

    this.loading = false;

    this.notificationService.showNotification(notification);
  }

  private handleSetzlisteFailure(){
    const notification: Notification = {
      id: NOTIFICATION_DOWNLOAD_FAILURE,
      title: 'SPORTJAHRESPLAN.SETZLISTE.NOTIFICATION.DOWNLOADFEHLER.TITLE',
      description: 'SPORTJAHRESPLAN.SETZLISTE.NOTIFICATION.DOWNLOADFEHLER.DESCRIPTION',
      severity: NotificationSeverity.ERROR,
      origin: NotificationOrigin.USER,
      type: NotificationType.OK,
      userAction: NotificationUserAction.PENDING
    };

    this.loading = false;

    this.notificationService.showNotification(notification);
  }

  private handleSchusszettelFailure(){
    const notification: Notification = {
      id: NOTIFICATION_DOWNLOAD_FAILURE,
      title: 'SPORTJAHRESPLAN.SCHUSSZETTEL.NOTIFICATION.DOWNLOADFEHLER.TITLE',
      description: 'SPORTJAHRESPLAN.SCHUSSZETTEL.NOTIFICATION.DOWNLOADFEHLER.DESCRIPTION',
      severity: NotificationSeverity.ERROR,
      origin: NotificationOrigin.USER,
      type: NotificationType.OK,
      userAction: NotificationUserAction.PENDING
    };

    this.loading = false;

    this.notificationService.showNotification(notification);
  }

  private handleMeldezettelFailure(){
    const notification: Notification = {
      id: NOTIFICATION_DOWNLOAD_FAILURE,
      title: 'SPORTJAHRESPLAN.MELDEZETTEL.NOTIFICATION.DOWNLOADFEHLER.TITLE',
      description: 'SPORTJAHRESPLAN.MELDEZETTEL.NOTIFICATION.DOWNLOADFEHLER.DESCRIPTION',
      severity: NotificationSeverity.ERROR,
      origin: NotificationOrigin.USER,
      type: NotificationType.OK,
      userAction: NotificationUserAction.PENDING
    };

    this.loading = false;

    this.notificationService.showNotification(notification);
  }

  private handleEinzelstatistikFailure(){
    const notification: Notification = {
      id: NOTIFICATION_DOWNLOAD_FAILURE,
      title: 'WETTKAEMPFE.EINZELSTATISTIK.NOTIFICATION.DOWNLOADFEHLER.TITLE',
      description: 'WETTKAEMPFE.EINZELSTATISTIK.NOTIFICATION.DOWNLOADFEHLER.DESCRIPTION',
      severity: NotificationSeverity.ERROR,
      origin: NotificationOrigin.USER,
      type: NotificationType.OK,
      userAction: NotificationUserAction.PENDING
    };

    this.loading = false;

    this.notificationService.showNotification(notification);
  }

  private handleGesamtstatistikFailure(){
    const notification: Notification = {
      id: NOTIFICATION_DOWNLOAD_FAILURE,
      title: 'Download Fehlgeschlagen',
      description: 'Gesamtstatistik konnte nicht als PDF erstellt Werden',
      severity: NotificationSeverity.ERROR,
      origin: NotificationOrigin.USER,
      type: NotificationType.OK,
      userAction: NotificationUserAction.PENDING
    };

    this.loading = false;

    this.notificationService.showNotification(notification);
  }

}
