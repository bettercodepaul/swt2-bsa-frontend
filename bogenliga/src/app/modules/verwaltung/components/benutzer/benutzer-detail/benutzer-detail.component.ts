import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BogenligaResponse} from '@shared/data-provider';
import {isNullOrUndefined, isUndefined} from '@shared/functions';
import {ButtonType, CommonComponent} from '../../../../shared/components';
import {BenutzerDataProviderService} from '../../../services/benutzer-data-provider.service';
import {BenutzerDO} from '../../../types/benutzer-do.class';
import {BenutzerRolleDO} from '../../../types/benutzer-rolle-do.class';
import {BenutzerRolleDTO} from '../../../types/datatransfer/benutzer-rolle-dto.class';
import {RoleDTO} from '../../../types/datatransfer/role-dto.class';
import {RoleDO} from '../../../types/role-do.class';
import {ResetCredentialsDO} from '@user/types/resetcredentials-do.class';
import {BENUTZER_DETAIL_CONFIG} from './benutzer-detail.config';

import {
  Notification,
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '../../../../shared/services/notification';
import {RoleVersionedDataObject} from '../../../services/models/roles-versioned-data-object.class';
import {RoleDataProviderService} from '../../../services/role-data-provider.service';

const ID_PATH_PARAM = 'id';
const NOTIFICATION_SAVE_BENUTZER = 'benutzer_detail_save';


@Component({
  selector:    'bla-benutzer-detail',
  templateUrl: './benutzer-detail.component.html',
  styleUrls:   ['./benutzer-detail.component.scss']
})
export class BenutzerDetailComponent extends CommonComponent implements OnInit {

  @Output() public onAction = new EventEmitter<void>();
  public config = BENUTZER_DETAIL_CONFIG;
  public ButtonType = ButtonType;
  public currentBenutzerRolleDO: BenutzerRolleDO[];
  public roles: RoleDTO[] = [];
  public tobeRole: RoleDO;
  public currentRoles: BenutzerRolleDTO[] = [];
  public roleNames;
  public resetCredentials: ResetCredentialsDO;
  public saveLoading = false;
  public savePW = false;
  public selectedDTOs: RoleVersionedDataObject[];
  public selectionRole;
  public enableButton = false;
  private notification: Notification = {
    id:          NOTIFICATION_SAVE_BENUTZER,
    title:       'MANAGEMENT.BENUTZER_DETAIL.NOTIFICATION.UPDATE.TITLE',
    description: 'MANAGEMENT.BENUTZER_DETAIL.NOTIFICATION.UPDATE.DESCRIPTION',
    severity:    NotificationSeverity.INFO,
    origin:      NotificationOrigin.USER,
    type:        NotificationType.OK,
    userAction:  NotificationUserAction.PENDING
  };

  constructor(private benutzerDataProvider: BenutzerDataProviderService,
              private roleDataProvider: RoleDataProviderService,
              private router: Router,
              private route: ActivatedRoute,
              private notificationService: NotificationService) {
    super();
  }

  ngOnInit() {
    this.loading = true;
    this.tobeRole = new RoleDO();
    this.resetCredentials = new ResetCredentialsDO();
    console.log('Auswahllisten: selectedDTO = ' + JSON.stringify(this.selectedDTOs));


    this.notificationService.discardNotification();

    this.route.params.subscribe((params) => {
      if (!isUndefined(params[ID_PATH_PARAM])) {
        const id = params[ID_PATH_PARAM];
        this.currentBenutzerRolleDO = [];
        this.currentBenutzerRolleDO.push(new BenutzerRolleDO());

        if (id !== 'add') {
          this.benutzerDataProvider.findUserRoleById(id)
              .then((response: BogenligaResponse<BenutzerRolleDO[]>) => {
                this.currentBenutzerRolleDO = response.payload;
                this.roleNames = '';
                for (const role of this.currentBenutzerRolleDO) {
                  this.roleNames += role.roleName + ' ';
                }
              })
              .catch((response: BogenligaResponse<BenutzerRolleDO>) => this.currentBenutzerRolleDO = null);

          // wir laden hiermit alle möglichen User-Rollen aus dem Backend um die Klappliste für die Auswahl zu befüllen.
          this.roleDataProvider.findAll()
              .then((response: BogenligaResponse<RoleDO[]>) => this.setVersionedDataObjects(response))
              .catch((response: BogenligaResponse<RoleDO[]>) => this.getEmptyList());
        }
      }
    });
  }

  public resetPW(ignore: any): void{
    this.savePW = true;

    this.benutzerDataProvider.resetPW(this.resetCredentials)
      .then((response: BogenligaResponse<Array<BenutzerDO>>) => {
        if (!isNullOrUndefined(response)
          && !isNullOrUndefined(response.payload[0])
          && !isNullOrUndefined(response.payload[0].id)) {
          this.notificationService.observeNotification(NOTIFICATION_SAVE_BENUTZER)
              .subscribe((myNotification) => {
                if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                  this.savePW = false;
                  this.router.navigateByUrl('/verwaltung/benutzer');
                }
              });
          this.notificationService.showNotification(this.notification);
        }
        }, (response: BogenligaResponse<BenutzerDO>) => {
        console.log('Failed');
        this.savePW = false;
      });

  }

  public resetRole(ignore: any): void {
    this.saveLoading = true;

    // persist
    this.selectedDTOs.forEach((item, index) => {

      const currentBenutzerRolleDTO = new BenutzerRolleDTO();
      currentBenutzerRolleDTO.id = this.currentBenutzerRolleDO[0].id;
      currentBenutzerRolleDTO.email = this.currentBenutzerRolleDO[0].email;
      this.tobeRole = this.selectedDTOs[index] as RoleDO;
      currentBenutzerRolleDTO.roleId = this.tobeRole.id;
      currentBenutzerRolleDTO.roleName = this.tobeRole.roleName;
      this.currentRoles.push(currentBenutzerRolleDTO);
    });

    this.benutzerDataProvider.updateRole(this.currentRoles)
        .then((response: BogenligaResponse<Array<BenutzerDO>>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload[0])
            && !isNullOrUndefined(response.payload[0].id)) {

            this.notificationService.observeNotification(NOTIFICATION_SAVE_BENUTZER)
                .subscribe((myNotification) => {
                  if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                    this.saveLoading = false;
                    this.router.navigateByUrl('/verwaltung/benutzer');
                  }
                });

            this.notificationService.showNotification(this.notification);
          }

        }, (response: BogenligaResponse<BenutzerDO>) => {
          console.log('Failed');
          this.saveLoading = false;
        });
    // show response message
  }


  public entityExists(): boolean {
    return this.currentBenutzerRolleDO[0].id > 0;
  }

  private loadById(id: number) {
    this.benutzerDataProvider.findUserRoleById(id)
        .then((response: BogenligaResponse<BenutzerRolleDO[]>) => this.handleSuccess(response))
        .catch((response: BogenligaResponse<BenutzerRolleDO>) => this.handleFailure(response));
  }

  private handleSuccess(response: BogenligaResponse<BenutzerRolleDO[]>) {
    this.currentBenutzerRolleDO = response.payload;
    this.loading = false;
  }

  private handleFailure(response: BogenligaResponse<BenutzerRolleDO>) {
    this.loading = false;

  }

  public getEmptyList(): RoleVersionedDataObject[] {
    return [];
  }

  public setVersionedDataObjects(response: BogenligaResponse<RoleDTO[]>): void {
    this.roles = []; // reset array to ensure change detection
    this.loading = false;

    response.payload.forEach((responseItem) => this.roles.push(new RoleVersionedDataObject(responseItem.id, responseItem.roleName)));
    return;
  }

  public getVersionedDataObjects() {
    return this.roles;
  }

  public onSelect($event: RoleVersionedDataObject[]): void {
    this.selectedDTOs = [];
    this.selectedDTOs = $event;
    this.enableButton = true;
  }

  public getSelectedDTO(): string {
    if (isNullOrUndefined(this.selectedDTOs)) {
      return '';
    } else {
      console.log('Auswahllisten: selectedDTO = ' + JSON.stringify(this.selectedDTOs));
      const names: string[] = [];

      this.selectedDTOs.forEach((item) => {
        names.push(item.roleName);
      });

      return names.join(', ');
    }
  }
}
