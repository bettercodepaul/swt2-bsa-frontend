import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {isNullOrUndefined, isUndefined} from '@shared/functions';
import {
  ButtonType,
  CommonComponentDirective,
  hideLoadingIndicator,
  showDeleteLoadingIndicatorIcon,
  toTableRows
} from '../../../../shared/components';
import {BogenligaResponse, RequestResult, UriBuilder} from '../../../../shared/data-provider';
import {
  Notification,
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '../../../../shared/services/notification';
import {RegionDataProviderService} from '../../../services/region-data-provider.service';
import {VereinDataProviderService} from '../../../services/verein-data-provider.service';
import {RegionDTO} from '../../../types/datatransfer/region-dto.class';
import {DsbMitgliedDO} from '../../../types/dsb-mitglied-do.class';
import {RegionDO} from '../../../types/region-do.class';
import {VereinDO} from '../../../types/verein-do.class';
import {VEREIN_DETAIL_CONFIG, VEREIN_DETAIL_TABLE_CONFIG} from './verein-detail.config';
import {VersionedDataObject} from '@shared/data-provider/models/versioned-data-object.interface';
import {TableRow} from '@shared/components/tables/types/table-row.class';
import {DsbMannschaftDataProviderService} from '@verwaltung/services/dsb-mannschaft-data-provider.service';
import {DsbMannschaftDTO} from '@verwaltung/types/datatransfer/dsb-mannschaft-dto.class';
import {DsbMannschaftDO} from '@verwaltung/types/dsb-mannschaft-do.class';
import {VeranstaltungDataProviderService} from '@verwaltung/services/veranstaltung-data-provider.service';
import {VeranstaltungDTO} from '@verwaltung/types/datatransfer/veranstaltung-dto.class';
import {environment} from '@environment';
import {
  DownloadButtonResourceProviderService
} from '@shared/components/buttons/download-button/services/download-button-resource-provider.service';
import {CurrentUserService, OnOfflineService, UserPermission} from '@shared/services';
import {jsPDF} from 'jspdf';
import {db} from '@shared/data-provider/offlinedb/offlinedb';
import {SessionHandling} from '@shared/event-handling';
import {ActionButtonColors} from '@shared/components/buttons/button/actionbuttoncolors';
import {UserDataProviderService} from '@verwaltung/services/user-data-provider.service';
import {UserRolleDO} from '@verwaltung/types/user-rolle-do.class';
import {LigaDataProviderService} from '@verwaltung/services/liga-data-provider.service';
import {TableActionType} from '@shared/components/tables/types/table-action-type.enum';
import {WettkampfDataProviderService} from '@verwaltung/services/wettkampf-data-provider.service';
import {MannschaftsmitgliedDataProviderService} from '@verwaltung/services/mannschaftsmitglied-data-provider.service';
import {WettkampfDTO} from '@verwaltung/types/datatransfer/wettkampf-dto.class';

const ID_PATH_PARAM = 'id';
const NOTIFICATION_DELETE_VEREIN = 'verein_detail_delete';
const NOTIFICATION_DELETE_VEREIN_SUCCESS = 'verein_detail_delete_success';
const NOTIFICATION_DELETE_VEREIN_FAILURE = 'verein_detail_delete_failure';
const NOTIFICATION_SAVE_VEREIN = 'verein_detail_save';
const NOTIFICATION_UPDATE_VEREIN = 'verein_detail_update';
const NOTIFICATION_DELETE_MANNSCHAFT = 'mannschaft_detail_delete';
const NOTIFICATION_COPY_MANNSCHAFT = 'mannschaft_detail_copy';
const NOTIFICATION_DELETE_MANNSCHAFT_SUCCESS = 'mannschaft_detail_delete_success';
const NOTIFICATION_DELETE_MANNSCHAFT_FAILURE = 'mannschaft_detail_delete_failure';
const NOTIFICATION_NO_LICENSE = 'no_license_found';
const NOTIFICATION_EMPTY_MANNSCHAFT = 'download_empty_mannschaft';
const NOTIFICATION_DOWNLOAD_BEFORE_DEADLINE = 'download_before_deadline';
const NOTIFICATION_ENTITY_CONFLICT_ERROR = 'ENTITY_CONFLICT_ERROR';
const NOTIFICATION_DATABASE_ERROR = 'DATABASE_ERROR';
const PLATZHALTER_ID = 99;

@Component({
  selector:    'bla-verein-detail',
  templateUrl: './verein-detail.component.html',
  styleUrls:   ['./verein-detail.component.scss']
})
export class VereinDetailComponent extends CommonComponentDirective implements OnInit, OnDestroy {
  public regionType = 'KREIS';
  public config = VEREIN_DETAIL_CONFIG;
  public config_table = VEREIN_DETAIL_TABLE_CONFIG;
  public rows: TableRow[];
  public ButtonType = ButtonType;
  public currentVerein: VereinDO = new VereinDO();
  public currentRegion: RegionDO = new RegionDO();
  public regionen: Array<RegionDO> = [new RegionDO()];
  public mannschaften: Array<DsbMannschaftDO> = [new DsbMannschaftDO()];

  public selectedSportjahr : number = null; //Auswahl im Dropdown
  public availableSportjahre: number [] = []; //Liste im Dropdown

  public deleteLoading = false;
  public saveLoading = false;
  public ActionButtonColors = ActionButtonColors;
  public UserPermission = UserPermission;
  private isSportleiter = false;


  private sessionHandling: SessionHandling;
  private saveErrorNotificationSubscriptions = [];

  @ViewChild('downloadLink')
  private aElementRef: ElementRef;

  constructor(private vereinProvider: VereinDataProviderService,
    private downloadService: DownloadButtonResourceProviderService,
    private regionProvider: RegionDataProviderService,
    public currentUserService: CurrentUserService,
    private mannschaftsDataProvider: DsbMannschaftDataProviderService,
    private veranstaltungsProvider: VeranstaltungDataProviderService,
    private router: Router,
    private route: ActivatedRoute,
    private onOfflineService: OnOfflineService,
    private notificationService: NotificationService,
    private userDataProviderService: UserDataProviderService,
    private ligaProvider: LigaDataProviderService,
    private wettkampfDataProviderService: WettkampfDataProviderService,
    private mannschaftsmitgliedProvider: MannschaftsmitgliedDataProviderService,) {
    super();
    this.sessionHandling = new SessionHandling(this.currentUserService, this.onOfflineService);
  }

  ngOnInit() {
    this.loading = true;
    this.notificationService.discardNotification();
    this.registerSaveErrorReset(NOTIFICATION_ENTITY_CONFLICT_ERROR);
    this.registerSaveErrorReset(NOTIFICATION_DATABASE_ERROR);
    this.loadRegions(this.regionType); // Request all regions from the backend

    // Check user roles and hide the copy/add action for Sportleiter
    try {
      const currentUserId = this.currentUserService.getCurrentUserID();
      this.userDataProviderService.findUserRoleById(currentUserId)
        .then((roleresponse) => {
          if (roleresponse && roleresponse.payload) {
            this.isSportleiter = roleresponse.payload.filter(role => role.roleName === 'SPORTLEITER').length > 0;
            if (this.isSportleiter) {
              // create a deep copy of the table config and remove the COPY action so the button is hidden
              this.config_table = JSON.parse(JSON.stringify(this.config_table));
              if (this.config_table.actions && Array.isArray(this.config_table.actions.actionTypes)) {
                this.config_table.actions.actionTypes = this.config_table.actions.actionTypes
                  .filter((action) => action !== TableActionType.COPY);
              }
            }
          }
        })
        .catch(() => {
          // ignore errors here, do not block loading
        });
    } catch (e) {
      // ignore
    }
  }

  ngOnDestroy() {
    this.saveErrorNotificationSubscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  /** When a MouseOver-Event is triggered, it will call this inMouseOver-function.
   *  This function calls the checkSessionExpired-function in the sessionHandling class and get a boolean value back.
   *  If the boolean value is true, then the page will be reloaded and due to the expired session, the user will
   *  be logged out automatically.
   */

  public onMouseOver(event: any) {
    const isExpired = this.sessionHandling.checkSessionExpired();
    if (isExpired) {
      window.location.reload();
    }
  }

  private loadVerein(): void {
    this.route.params.subscribe((params) => {
      if (!isUndefined(params[ID_PATH_PARAM])) {
        const id = params[ID_PATH_PARAM];
        if (id === 'add') {
          this.currentVerein = new VereinDO();
          this.loading = false;
          this.deleteLoading = false;
          this.saveLoading = false;
        } else {
          this.loadById(params[ID_PATH_PARAM]);
        }
      }
    });
  }

  public onSave(ignore: any): void {
    this.notificationService.discardNotification();
    this.saveLoading = true;

    // persist
    this.currentVerein.regionId = this.currentRegion.id; // Set selected region id
    // check if website has http:// in it. If not then add it
    if (!this.currentVerein.website === undefined) {
      if (this.currentVerein.website.search('http://')) {
        this.currentVerein.website = 'http://' + this.currentVerein.website;
      }
    }

    console.log('Saving verein: ', this.currentVerein);

    this.vereinProvider.create(this.currentVerein)
        .then((response: BogenligaResponse<VereinDO>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload)
            && !isNullOrUndefined(response.payload.id)) {
            console.log('Saved with id: ' + response.payload.id);

            const notification: Notification = {
              id:          NOTIFICATION_SAVE_VEREIN,
              title:       'MANAGEMENT.VEREIN_DETAIL.NOTIFICATION.SAVE.TITLE',
              description: 'MANAGEMENT.VEREIN_DETAIL.NOTIFICATION.SAVE.DESCRIPTION',
              severity:    NotificationSeverity.INFO,
              origin:      NotificationOrigin.USER,
              type:        NotificationType.OK,
              userAction:  NotificationUserAction.PENDING
            };

            this.notificationService.observeNotification(NOTIFICATION_SAVE_VEREIN)
                .subscribe((myNotification) => {
                  if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                    this.saveLoading = false;
                    this.router.navigateByUrl('/verwaltung/vereine/' + response.payload.id);
                  }
                });

            this.notificationService.showNotification(notification);
          }
        }, (response: BogenligaResponse<DsbMitgliedDO>) => {
          console.log('Failed');
          this.saveLoading = false;


        });
    // show response message
  }

  public onUpdate(ignore: any): void {
    this.notificationService.discardNotification();
    this.saveLoading = true;

    // persist
    this.currentVerein.regionId = this.currentRegion.id; // Set selected region id
    // check if website has http:// in it. If not then add it
    if (this.currentVerein.website !== '') {
      if (this.currentVerein.website.search('http://')) {
        this.currentVerein.website = 'http://' + this.currentVerein.website;
      }
    }

    this.vereinProvider.update(this.currentVerein)
        .then((response: BogenligaResponse<VereinDO>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload)
            && !isNullOrUndefined(response.payload.id)) {

            const id = this.currentVerein.id;

            const notification: Notification = {
              id:          NOTIFICATION_UPDATE_VEREIN + id,
              title:       'MANAGEMENT.VEREIN_DETAIL.NOTIFICATION.SAVE.TITLE',
              description: 'MANAGEMENT.VEREIN_DETAIL.NOTIFICATION.SAVE.DESCRIPTION',
              severity:    NotificationSeverity.INFO,
              origin:      NotificationOrigin.USER,
              type:        NotificationType.OK,
              userAction:  NotificationUserAction.PENDING
            };

            this.notificationService.observeNotification(NOTIFICATION_UPDATE_VEREIN + id)
                .subscribe((myNotification) => {
                  if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                    this.saveLoading = false;
                    this.router.navigateByUrl('/verwaltung/vereine');
                  }
                });

            this.notificationService.showNotification(notification);
          }
        }, (response: BogenligaResponse<DsbMitgliedDO>) => {
          const notification: Notification = {
            id:          NOTIFICATION_UPDATE_VEREIN,
            title:       'MANAGEMENT.VEREIN_DETAIL.NOTIFICATION.SAVE_FAILURE.TITLE',
            description: 'MANAGEMENT.VEREIN_DETAIL.NOTIFICATION.SAVE_FAILURE.DESCRIPTION',
            severity:    NotificationSeverity.INFO,
            origin:      NotificationOrigin.USER,
            type:        NotificationType.OK,
            userAction:  NotificationUserAction.PENDING
          };
          this.notificationService.showNotification(notification);


          console.log('Failed');
          this.saveLoading = false;
        });
    // show response message
  }

  /**
   * Base64 is a process to store e.g. images as 8-bit binary files.
   * It is called if an image (logo) is inside the upload field.
   */
  public convertIconToBase64($event): void {
    this.readThis($event.target);
  }

  public readThis(inputValue: any): void {
    const file: File = inputValue.files[0];
    const myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.currentVerein.icon = String(myReader.result);
    };

    myReader.readAsDataURL(file);
  }


  public onDelete(ignore: any): void {
    this.deleteLoading = true;
    this.notificationService.discardNotification();

    const id = this.currentVerein.id;

    // Don´t delete the placeholder club
    if (id == PLATZHALTER_ID) {
      const notification: Notification = {
        id:               NOTIFICATION_DELETE_VEREIN + id,
        title:            'MANAGEMENT.VEREIN_DETAIL.NOTIFICATION_PLATZHALTER.DELETE.TITLE',
        description:      'MANAGEMENT.VEREIN_DETAIL.NOTIFICATION_PLATZHALTER.DELETE.DESCRIPTION',
        descriptionParam: '' + id,
        severity:         NotificationSeverity.INFO,
        origin:           NotificationOrigin.USER,
        type:             NotificationType.OK,
        userAction:       NotificationUserAction.PENDING
      };
      this.notificationService.observeNotification(NOTIFICATION_DELETE_VEREIN + id)
          .subscribe((myNotification) => {
            if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
              this.deleteLoading = false;
            }
          });

      this.notificationService.showNotification(notification)

    } else {
      const notification: Notification = {
        id:               NOTIFICATION_DELETE_VEREIN + id,
        title:            'MANAGEMENT.VEREIN_DETAIL.NOTIFICATION.DELETE.TITLE',
        description:      'MANAGEMENT.VEREIN_DETAIL.NOTIFICATION.DELETE.DESCRIPTION',
        descriptionParam: '' + id,
        severity:         NotificationSeverity.QUESTION,
        origin:           NotificationOrigin.USER,
        type:             NotificationType.YES_NO,
        userAction:       NotificationUserAction.PENDING
      };

      this.notificationService.observeNotification(NOTIFICATION_DELETE_VEREIN + id)
          .subscribe((myNotification) => {

            if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
              this.vereinProvider.deleteById(id)
                  .then((response) => this.handleDeleteSuccess(response))
                  .catch((response) => this.handleDeleteFailure(response));
            } else if (myNotification.userAction === NotificationUserAction.DECLINED) {
              this.deleteLoading = false;
            }
          });

      this.notificationService.showNotification(notification);
    }
  }

  public onDeleteMannschaft(versionedDataObject: VersionedDataObject): void {
    this.notificationService.discardNotification();

    const id = versionedDataObject.id;
    this.rows = showDeleteLoadingIndicatorIcon(this.rows, id);

    const notification: Notification = {
      id: NOTIFICATION_DELETE_MANNSCHAFT + id,
      title: 'MANAGEMENT.MANNSCHAFT_DETAIL.NOTIFICATION.DELETE.TITLE',
      description: 'MANAGEMENT.MANNSCHAFT_DETAIL.NOTIFICATION.DELETE.DESCRIPTION',
      descriptionParam: '' + id,
      severity: NotificationSeverity.QUESTION,
      origin: NotificationOrigin.USER,
      type: NotificationType.YES_NO,
      userAction: NotificationUserAction.PENDING
    };

    const notificationEvent = this.notificationService
      .observeNotification(NOTIFICATION_DELETE_MANNSCHAFT + id)
      .subscribe((myNotification) => {

        if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
          this.mannschaftsDataProvider.deleteById(id)
            .then(() => this.loadMannschaftenByVereinsIdAndSportjahr())
            .catch((response) => {
              this.rows = hideLoadingIndicator(this.rows, id);
              this.showDeleteErrorNotification(
                response?.message || 'Mannschaft konnte nicht gelöscht werden.'
              );
            });

          notificationEvent.unsubscribe();
        } else if (myNotification.userAction === NotificationUserAction.DECLINED) {
          this.rows = hideLoadingIndicator(this.rows, id);
          notificationEvent.unsubscribe();
        }
      });

    this.notificationService.showNotification(notification);
  }

  private showDeleteErrorNotification(message: string): void {
    const notification: Notification = {
      id: 'delete_mannschaft_error',
      title: 'Löschen nicht möglich',
      description: message || 'Die Mannschaft konnte nicht gelöscht werden.',
      severity: NotificationSeverity.ERROR,
      origin: NotificationOrigin.USER,
      type: NotificationType.OK,
      userAction: NotificationUserAction.PENDING
    };

    this.notificationService.showNotification(notification);
  }

  public onCopyMannschaft(versionedDataObject: VersionedDataObject): void {

    this.notificationService.discardNotification();

    const id = versionedDataObject.id;
    this.rows = showDeleteLoadingIndicatorIcon(this.rows, id);

    const notification: Notification = {
      id:               NOTIFICATION_COPY_MANNSCHAFT + id,
      title:            'MANAGEMENT.MANNSCHAFT_DETAIL.NOTIFICATION.COPY.TITLE',
      description:      'MANAGEMENT.MANNSCHAFT_DETAIL.NOTIFICATION.COPY.DESCRIPTION',
      descriptionParam: '' + id,
      severity:         NotificationSeverity.QUESTION,
      origin:           NotificationOrigin.USER,
      type:             NotificationType.YES_NO,
      userAction:       NotificationUserAction.PENDING
    };

    const notificationEvent = this.notificationService.observeNotification(NOTIFICATION_COPY_MANNSCHAFT + id)
      .subscribe((myNotification) => {

        if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
          this.mannschaftsDataProvider.copyMannschaft(id)
            .then((response) => this.loadMannschaftenByVereinsIdAndSportjahr())
            .catch((response) => this.rows = hideLoadingIndicator(this.rows, id));
        } else if (myNotification.userAction === NotificationUserAction.DECLINED) {
          this.rows = hideLoadingIndicator(this.rows, id);
          notificationEvent.unsubscribe();
        }

      });

    this.notificationService.showNotification(notification);
  }

  public onDownloadRueckennummer(versionedDataObject: VersionedDataObject): void {
    if (this.isDownloadBlocked(versionedDataObject.id)) {
      this.showBeforeDeadlineNotification();
      return;
    }
    if (!this.onOfflineService.isOffline()) {
      // Leere Mannschaft vorab abfangen -> sonst liefert das Backend einen unverständlichen
      // Fehler (keine Mitglieder). (BSAPP-2179)
      this.withNonEmptyMannschaft(versionedDataObject.id, () => this.performDownloadRueckennummer(versionedDataObject));
    } else {
      console.log('offline');
      this.returnMatch(versionedDataObject);
    }

  }

  private performDownloadRueckennummer(versionedDataObject: VersionedDataObject): void {
    const URL: string = new UriBuilder()
      .fromPath(environment.backendBaseUrl)
      .path('v1/download')
      .path('pdf/rueckennummern')
      .path('?mannschaftid=' + versionedDataObject.id)
      .build();
    this.downloadService.download(URL, 'rueckennummern.pdf', this.aElementRef)
        .then((response: BogenligaResponse<string>) => console.log(response))
        .catch((response: BogenligaResponse<string>) => console.log(response));
  }

  /**
   * Prüft, ob die Mannschaft Mitglieder hat. Ist sie leer, wird eine klare Meldung angezeigt und
   * der Download NICHT ausgeführt. Bei nicht leeren Mannschaften (oder falls die Prüfung selbst
   * fehlschlägt) wird der eigentliche Download über den Callback gestartet. (BSAPP-2179)
   */
  private withNonEmptyMannschaft(mannschaftId: number, onNonEmpty: () => void): void {
    this.mannschaftsmitgliedProvider.findAllByTeamId(mannschaftId)
        .then((response) => {
          if (isNullOrUndefined(response.payload) || response.payload.length === 0) {
            this.showEmptyMannschaftNotification();
          } else {
            onNonEmpty();
          }
        })
        .catch(() => onNonEmpty());
  }

  private showEmptyMannschaftNotification(): void {
    const notification: Notification = {
      id:          NOTIFICATION_EMPTY_MANNSCHAFT,
      title:       'MANAGEMENT.VEREIN_DETAIL.NOTIFICATION.EMPTY_MANNSCHAFT.TITLE',
      description: 'MANAGEMENT.VEREIN_DETAIL.NOTIFICATION.EMPTY_MANNSCHAFT.DESCRIPTION',
      severity:    NotificationSeverity.ERROR,
      origin:      NotificationOrigin.USER,
      type:        NotificationType.OK,
      userAction:  NotificationUserAction.PENDING
    };
    this.notificationService.observeNotification(NOTIFICATION_EMPTY_MANNSCHAFT)
        .subscribe((myNotification) => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.saveLoading = false;
          }
        });
    this.notificationService.showNotification(notification);
  }

  // Get match Info from offlineDB
  public returnMatch(versionedDataObject: VersionedDataObject): void {
    const doc = new jsPDF('p', 'mm', 'a4');
    doc.setProperties({
      title: 'Rueckennumer',
    });
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
    db.transaction('r', db.ligaTabelle, db.mannschaftsmitgliedTabelle, db.dsbMitgliedTabelle, async () => {
      console.log((await db.ligaTabelle.where('mannschaftId').equals(versionedDataObject.id).toArray()));
      const mannschaftId = await db.ligaTabelle.where('mannschaftId').equals(versionedDataObject.id).toArray();
      const nums = await db.mannschaftsmitgliedTabelle.where('mannschaftId').equals(versionedDataObject.id).toArray();
      const mannschaftsName = mannschaftId[0].mannschaftName;
      const ligaName = mannschaftId[0].veranstaltungName;
      for (let i = 0; i < nums.length; i++) {
        console.log('rueckennummer: ' + nums[0].rueckennummer);
        doc.setFontSize(10).setFont(undefined, 'normal');
        doc.text(ligaName, 20, 20,);
        doc.text(mannschaftsName, 20, 28,)// .setFontSize(25).setFont(undefined, 'bold');

          // Todo add Name Nachname to Rueckennumer if OnlineDatabase is filled
          // doc.text('Spielername', width / 2, height / 2 - 95, {align: 'center'})

           .setFontSize(100).setFont(undefined, 'bold');
        doc.text(nums[i].rueckennummer.toString(), width / 2, height / 2 - 50, {align: 'center'});
        if (i + 1 < nums.length) {
          console.log('i ist ' + i + ' length ist ' + nums.length);
          doc.addPage();
        }
      }
      // open in new tab
      const string = doc.output('datauristring');
      const embed = '<embed width=\'100%\' height=\'100%\' src=\'' + string + '\'/>';
      const x = window.open();
      x.document.open();
      x.document.write(embed);
      x.document.close();
    })
      .catch(function (error) {
        console.error('Transaction aborted due to error: ' + error);
      });
  }

   public onDownloadLizenzen(versionedDataObject: VersionedDataObject): void {
     if (this.isDownloadBlocked(versionedDataObject.id)) {
       this.showBeforeDeadlineNotification();
       return;
     }
     // Leere Mannschaft vorab abfangen -> sonst wird ein leeres/unverständliches PDF erzeugt. (BSAPP-2179)
     this.withNonEmptyMannschaft(versionedDataObject.id, () => this.performDownloadLizenzen(versionedDataObject));
   }

   private performDownloadLizenzen(versionedDataObject: VersionedDataObject): void {
    const URL: string = new UriBuilder()
       .fromPath(environment.backendBaseUrl)
       .path('v1/download')
       .path('pdf/lizenzen')
       .path('?mannschaftid=' + versionedDataObject.id)
       .build();
     this.downloadService.download(URL, 'lizenzen.pdf', this.aElementRef)
         .then((response: BogenligaResponse<string>) => console.log(response))
         .catch((response: BogenligaResponse<string>) => this.showNoLicense());
   }


   public onDownloadSchusszetteltag1(versionedDataObject: VersionedDataObject): void {
     this.downloadSchusszettel(versionedDataObject.id, 1, 'schusszettel_tag1.pdf');
   }

   public onDownloadSchusszetteltag2(versionedDataObject: VersionedDataObject): void {
     this.downloadSchusszettel(versionedDataObject.id, 2, 'schusszettel_tag2.pdf');
   }

   public onDownloadSchusszetteltag3(versionedDataObject: VersionedDataObject): void {
     this.downloadSchusszettel(versionedDataObject.id, 3, 'schusszettel_tag3.pdf');
   }

   public onDownloadSchusszetteltag4(versionedDataObject: VersionedDataObject): void {
     this.downloadSchusszettel(versionedDataObject.id, 4, 'schusszettel_tag4.pdf');
   }

   private downloadSchusszettel(mannschaftId: number, tag: number, fileName: string): void {
     // Find the mannschaft with the given id
     const mannschaft = this.mannschaften.find(m => m.id === mannschaftId);
     if (!mannschaft) {
       console.error('Mannschaft not found for id:', mannschaftId);
       return;
     }

     // Get the wettkampf ID for the requested tag
     const wettkampfIdKey = `wettkampfId${tag}`;
     const wettkampfId = (mannschaft as any)[wettkampfIdKey];

     if (!wettkampfId) {
       console.error(`No wettkampf ID found for tag ${tag}`);
       return;
     }

     // Build the download URL
     const URL: string = new UriBuilder()
       .fromPath(environment.backendBaseUrl)
       .path('v1/download')
       .path('pdf/schusszettel')
       .path('?wettkampfid=' + wettkampfId)
       .build();

     // Download the file
     this.downloadService.download(URL, fileName, this.aElementRef)
         .then((response: BogenligaResponse<string>) => console.log(response))
         .catch((response: BogenligaResponse<string>) => {
           console.error('Failed to download schusszettel:', response);
           // Optionally show an error notification
         });
   }

   public onView(versionedDataObject: VersionedDataObject): void {
     this.navigateToDetailDialog(versionedDataObject);

   }
    public onEdit(versionedDataObject: VersionedDataObject): void {
    this.navigateToDetailDialog(versionedDataObject);
  }

  public entityExists(): boolean {
    return this.currentVerein.id >= 0;
  }

  private loadById(id: number) {
    this.vereinProvider.findById(id)
        .then((response: BogenligaResponse<VereinDO>) => this.handleSuccess(response))
        .catch((response: BogenligaResponse<VereinDO>) => this.handleFailure(response));
  }

  private async loadRegions(type: string) {
    let currentUserId = this.currentUserService.getCurrentUserID();
    this.userDataProviderService.findUserRoleById(currentUserId).then(async (roleresponse: BogenligaResponse<UserRolleDO[]>) => {
      let isAdmin = false;
      if (roleresponse.payload.filter(role => role.roleName == 'ADMIN').length > 0)
        isAdmin = true;

      if (isAdmin == true) { //Wenn admin
        this.regionProvider.findAllByType(type)
            .then((response: BogenligaResponse<RegionDO[]>) => {
              this.handleResponseArraySuccess(response);
              this.loadVerein();
            })
            .catch((response: BogenligaResponse<RegionDTO[]>) => this.handleResponseArrayFailure(response));
      } else { //Wenn KEIN Admin
        let ligaRegions: any[] = [];
        await this.ligaProvider.findAll().then(async (data) => {
          data.payload.forEach(e => {
            if (e.ligaVerantwortlichId === currentUserId) {
              ligaRegions.push(e.regionId);
            }
          })
          let allowedRegions: any[] = [];

          for (const regionId of ligaRegions) {
            await this.regionProvider.findAllowedRegionsForVereine(regionId, allowedRegions);
          }

          //Erlaubte Regionen in die Klappliste schreiben
          this.regionProvider.findAll().then((value) => {
            let filteredRegions = value.payload.filter((f) => {
              return allowedRegions.includes(f.id)
            })
            this.handleResponseArraySuccessRegion(filteredRegions);
            this.loadVerein();
          }).catch(e => console.log(e))

        }).catch(err => console.log(err));
      }
    }).catch(err => console.log(err))
        .finally(() => this.loading = false);
  }


  private handleSuccess(response: BogenligaResponse<VereinDO>) {
    this.currentVerein = response.payload;
    this.loadSportjahre();
    this.loading = false;

    this.currentRegion = this.regionen.filter((region) => region.id === this.currentVerein.regionId)[0];

  }

  private handleFailure(response: BogenligaResponse<VereinDO>) {
    this.loading = false;
  }

  private handleDeleteSuccess(response: BogenligaResponse<void>): void {

    const notification: Notification = {
      id:          NOTIFICATION_DELETE_VEREIN_SUCCESS,
      title:       'MANAGEMENT.VEREIN_DETAIL.NOTIFICATION.DELETE_SUCCESS.TITLE',
      description: 'MANAGEMENT.VEREIN_DETAIL.NOTIFICATION.DELETE_SUCCESS.DESCRIPTION',
      severity:    NotificationSeverity.INFO,
      origin:      NotificationOrigin.USER,
      type:        NotificationType.OK,
      userAction:  NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_VEREIN_SUCCESS)
        .subscribe((myNotification) => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.router.navigateByUrl('/verwaltung/vereine');
            this.deleteLoading = false;
          }
        });

    this.notificationService.showNotification(notification);
  }

  private handleDeleteFailure(response: BogenligaResponse<void>): void {

    const notification: Notification = {
      id:          NOTIFICATION_DELETE_VEREIN_FAILURE,
      title:       'MANAGEMENT.VEREIN_DETAIL.NOTIFICATION.DELETE_FAILURE.TITLE',
      description: 'MANAGEMENT.VEREIN_DETAIL.NOTIFICATION.DELETE_FAILURE.DESCRIPTION',
      severity:    NotificationSeverity.ERROR,
      origin:      NotificationOrigin.USER,
      type:        NotificationType.OK,
      userAction:  NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_VEREIN_FAILURE)
        .subscribe((myNotification) => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.deleteLoading = false;
          }
        });
    this.notificationService.showNotification(notification);
  }

  private showNoLicense(): void {
    const noLicenseNotification: Notification = {
      id:          NOTIFICATION_NO_LICENSE,
      title:       'MANAGEMENT.VEREIN_DETAIL.NOTIFICATION.NO_LICENSE.TITLE',
      description: 'MANAGEMENT.VEREIN_DETAIL.NOTIFICATION.NO_LICENSE.DESCRIPTION',
      severity:    NotificationSeverity.ERROR,
      origin:      NotificationOrigin.USER,
      type:        NotificationType.OK,
      userAction:  NotificationUserAction.PENDING
    };
    this.notificationService.observeNotification(NOTIFICATION_NO_LICENSE)
        .subscribe((myNotification) => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.saveLoading = false;
          }
        });
    this.notificationService.showNotification(noLicenseNotification);
  }

  private isDownloadBlocked(mannschaftId: number): boolean {
    if (!this.isSportleiter) {
      return false;
    }
    const mannschaft = this.mannschaften.find(m => m.id === mannschaftId);
    if (!mannschaft || !mannschaft.meldeDeadline || mannschaft.meldeDeadline === '-') {
      return false;
    }
    const parts = mannschaft.meldeDeadline.split('.');
    const deadline = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today <= deadline;
  }

  private showBeforeDeadlineNotification(): void {
    const notification: Notification = {
      id:          NOTIFICATION_DOWNLOAD_BEFORE_DEADLINE,
      title:       'MANAGEMENT.VEREIN_DETAIL.NOTIFICATION.DOWNLOAD_BEFORE_DEADLINE.TITLE',
      description: 'MANAGEMENT.VEREIN_DETAIL.NOTIFICATION.DOWNLOAD_BEFORE_DEADLINE.DESCRIPTION',
      severity:    NotificationSeverity.INFO,
      origin:      NotificationOrigin.USER,
      type:        NotificationType.OK,
      userAction:  NotificationUserAction.PENDING
    };
    this.notificationService.observeNotification(NOTIFICATION_DOWNLOAD_BEFORE_DEADLINE)
        .subscribe((myNotification) => {});
    this.notificationService.showNotification(notification);
  }

  private handleResponseArrayFailure(response: BogenligaResponse<RegionDTO[]>): void {
    this.regionen = [];
    this.loading = false;
  }

  private handleResponseArraySuccess(response: BogenligaResponse<RegionDO[]>): void {
    this.handleResponseArraySuccessRegion(response.payload);
  }

  private handleResponseArraySuccessRegion(response: RegionDO[]): void {
    this.regionen = []; // reset array to ensure change detection
    this.regionen = response;
    this.currentRegion = this.regionen[0]; // Set first element of object as selected.

    this.loading = false;
  }

  private registerSaveErrorReset(notificationId: string): void {
    const subscription = this.notificationService.observeNotification(notificationId)
      .subscribe((notification) => {
        if (notification.userAction === NotificationUserAction.ACCEPTED
          || notification.userAction === NotificationUserAction.DECLINED) {
          this.saveLoading = false;
        }
      });

    this.saveErrorNotificationSubscriptions.push(subscription);
  }

  private loadMannschaften() {
    this.loading = true;
    this.mannschaftsDataProvider.findAllByVereinsId(this.currentVerein.id)
        .then((response: BogenligaResponse<DsbMannschaftDTO[]>) => this.handleLoadMannschaftenSuccess(response))
        .catch((response: BogenligaResponse<DsbMannschaftDTO[]>) => this.handleLoadMannschaftenFailure(response));
  }

  private loadMannschaftenByVereinsIdAndSportjahr() {
    this.loading = true;
    if (this.selectedSportjahr === null) {
      const jahreRequests = this.availableSportjahre.map(jahr =>
        this.mannschaftsDataProvider.findAllByVereinsIdAndSportjahr(this.currentVerein.id, jahr)
      );
      const warteschlangeRequest = this.mannschaftsDataProvider.findAllByWarteschlangeId();
      Promise.all([...jahreRequests, warteschlangeRequest])
        .then(responses => {
          const warteschlangeResponse = responses[responses.length - 1];
          const ohneJahr = (warteschlangeResponse.payload as any[]).filter(m => m.vereinId === this.currentVerein.id);
          const mitJahr = responses.slice(0, -1).reduce((acc: DsbMannschaftDTO[], r) => acc.concat(r.payload as any), []);
          this.handleLoadMannschaftenSuccess({result: RequestResult.SUCCESS, payload: [...mitJahr, ...ohneJahr]});
        })
        .catch((response: BogenligaResponse<DsbMannschaftDTO[]>) => this.handleLoadMannschaftenFailure(response));
    } else {
      this.mannschaftsDataProvider.findAllByVereinsIdAndSportjahr(this.currentVerein.id, this.selectedSportjahr)
        .then((response: BogenligaResponse<DsbMannschaftDTO[]>) => this.handleLoadMannschaftenSuccess(response))
        .catch((response: BogenligaResponse<DsbMannschaftDTO[]>) => this.handleLoadMannschaftenFailure(response));
    }
  }

  private loadSportjahre(): void {
    this.mannschaftsDataProvider.findAllSportjahre()
      .then(response => {
        const alleJahre = response.payload;
        return Promise.all(
          alleJahre.map(jahr =>
            this.mannschaftsDataProvider.findAllByVereinsIdAndSportjahr(this.currentVerein.id, jahr)
              .then(r => ({jahr, hatMannschaften: r.payload.length > 0}))
              .catch(() => ({jahr, hatMannschaften: false}))
          )
        );
      })
      .then(ergebnisse => {
        this.availableSportjahre = ergebnisse
          .filter(e => e.hatMannschaften)
          .map(e => e.jahr);
        this.selectedSportjahr = null;
        this.loadMannschaftenByVereinsIdAndSportjahr();
      })
      .catch(() => {
        this.loadMannschaften();
      });
  }

  public onSportjahrChange(year : number) : void{
    this.selectedSportjahr = year;
    this.loadMannschaftenByVereinsIdAndSportjahr();
  }

  private handleLoadMannschaftenSuccess(response: BogenligaResponse<DsbMannschaftDTO[]>): void {
    this.mannschaften = response.payload || [];

    // initialize wettkampf id placeholders on each mannschaft
    this.mannschaften.forEach((mannschaft) => {
      (mannschaft as any).wettkampfId1 = null;
      (mannschaft as any).wettkampfId2 = null;
      (mannschaft as any).wettkampfId3 = null;
      (mannschaft as any).wettkampfId4 = null;
    });

    // build table rows from the received mannschaften
    this.rows = toTableRows(this.mannschaften);

    // Initialize all schusszettel buttons as hidden by default
    // They will be revealed in addTableAttributes if a wettkampfId exists
    this.rows.forEach(row => {
      if (!row.hiddenActions) {
        row.hiddenActions = [];
      }
      row.hiddenActions.push(
        TableActionType.DOWMLOADSCHUSZETTELTAG1,
        TableActionType.DOWMLOADSCHUSZETTELTAG2,
        TableActionType.DOWMLOADSCHUSZETTELTAG3,
        TableActionType.DOWMLOADSCHUSZETTELTAG4
      );
    });

    // for each mannschaft fetch wettkaempfe and update row visibility for schusszettel buttons
    this.mannschaften.forEach((mannschaft) => this.addTableAttributes(mannschaft));

    this.loading = false;
  }

  private addTableAttributes(mannschaft: DsbMannschaftDO) {
    if (mannschaft.veranstaltungId != null) {
      this.veranstaltungsProvider.findById(mannschaft.veranstaltungId)
        .then((response: BogenligaResponse<VeranstaltungDTO>) => {
          if (response.payload && response.payload.name) {
            mannschaft.veranstaltungName = response.payload.name;
          } else {
            mannschaft.veranstaltungName = 'Unknown';
          }
          if (response.payload && response.payload.meldeDeadline) {
            const parts = response.payload.meldeDeadline.split('-');
            mannschaft.meldeDeadline = `${parts[2]}.${parts[1]}.${parts[0]}`;
          } else {
            mannschaft.meldeDeadline = '-';
          }
          // Set sportjahr from veranstaltung
          if (response.payload && response.payload.sportjahr) {
            mannschaft.sportjahr = response.payload.sportjahr;
          }
        })
        .catch(() => {
          mannschaft.veranstaltungName = '';
          mannschaft.meldeDeadline = '-';
        });
    } else {
      mannschaft.veranstaltungName = 'Not Specified';
      mannschaft.meldeDeadline = '-';
    }
    mannschaft.name = this.currentVerein.name + ' ' + mannschaft.nummer + '.Mannschaft';

    this.wettkampfDataProviderService.findAllWettkaempfeByMannschaftsId(mannschaft.id)
      .then((response: BogenligaResponse<WettkampfDTO[]>) => {
        if (response.payload) {
          (mannschaft as any).wettkampfId1 = null;
          (mannschaft as any).wettkampfId2 = null;
          (mannschaft as any).wettkampfId3 = null;
          (mannschaft as any).wettkampfId4 = null;

          response.payload.forEach(wettkampf => {
            if (wettkampf.wettkampfTag === 1) {
              (mannschaft as any).wettkampfId1 = wettkampf.id;
            } else if (wettkampf.wettkampfTag === 2) {
              (mannschaft as any).wettkampfId2 = wettkampf.id;
            } else if (wettkampf.wettkampfTag === 3) {
              (mannschaft as any).wettkampfId3 = wettkampf.id;
            } else if (wettkampf.wettkampfTag === 4) {
              (mannschaft as any).wettkampfId4 = wettkampf.id;
            }
          });
          // find corresponding table row and update hidden actions for schusszettel buttons
          try {
            const row = this.rows && this.rows.find(r => r.payload && r.payload.id === mannschaft.id);
            if (row && row.hiddenActions) {
              // Remove schusszettel button from hidden actions if wettkampfId exists
              if ((mannschaft as any).wettkampfId1) {
                row.hiddenActions = row.hiddenActions.filter(action => action !== TableActionType.DOWMLOADSCHUSZETTELTAG1);
              }
              if ((mannschaft as any).wettkampfId2) {
                row.hiddenActions = row.hiddenActions.filter(action => action !== TableActionType.DOWMLOADSCHUSZETTELTAG2);
              }
              if ((mannschaft as any).wettkampfId3) {
                row.hiddenActions = row.hiddenActions.filter(action => action !== TableActionType.DOWMLOADSCHUSZETTELTAG3);
              }
              if ((mannschaft as any).wettkampfId4) {
                row.hiddenActions = row.hiddenActions.filter(action => action !== TableActionType.DOWMLOADSCHUSZETTELTAG4);
              }
            }
          } catch (e) {
            console.error('Failed to update row hidden actions', e);
          }
        }
      })
      .catch(() => {
        // if fetching wettkaempfe fails, keep all schusszettel buttons hidden for safety
        // (they remain in hiddenActions as initialized in handleLoadMannschaftenSuccess)
      });
  }

  private handleLoadMannschaftenFailure(response: BogenligaResponse<DsbMannschaftDTO[]>): void {
    this.mannschaften = [];
    this.loading = false;
  }

  private navigateToDetailDialog(versionedDataObject: VersionedDataObject) {
    this.router.navigateByUrl('/verwaltung/vereine/' + this.currentVerein.id + '/' + versionedDataObject.id);
  }
}
