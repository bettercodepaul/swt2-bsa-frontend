import {Component, OnInit} from '@angular/core';
import {BENUTZER_DETAIL_CONFIG} from './benutzer-detail.config';
import {Response} from '../../../../shared/data-provider';
import {ButtonType, CommonComponent, toTableRows} from '../../../../shared/components';
import {BenutzerDataProviderService} from '../../../services/benutzer-data-provider.service';
import {ActivatedRoute, Router} from '@angular/router';
import {isNullOrUndefined, isUndefined} from 'util';
import {BenutzerDO} from "../../../types/benutzer-do.class";
import {RoleDTO} from "../../../types/datatransfer/role-dto.class";
import {RoleDO} from "../../../types/role-do.class";
import {BenutzerRolleDTO} from "../../../types/datatransfer/benutzer-rolle-dto.class";
import {BenutzerRolleDO} from "../../../types/benutzer-rolle-do.class";

import {
  Notification,
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '../../../../shared/services/notification';
import {RoleVersionedDataObject} from "../../../services/models/roles-versioned-data-object.class";
import {RoleDataProviderService} from "../../../services/role-data-provider.service";

const ID_PATH_PARAM = 'id';
const NOTIFICATION_SAVE_BENUTZER = 'benutzer_detail_save';


@Component({
  selector:    'bla-benutzer-detail',
  templateUrl: './benutzer-detail.component.html',
  styleUrls:   ['./benutzer-detail.component.scss']
})
export class BenutzerDetailComponent extends CommonComponent implements OnInit {

  public config = BENUTZER_DETAIL_CONFIG;
  public ButtonType = ButtonType;
  public currentBenutzerRolleDTO: BenutzerRolleDTO;
  public currentBenutzerRolleDO: BenutzerRolleDO;
  public roles: RoleDTO[] = [];
  public tobeRole: RoleDO;

  public saveLoading = false;
  public selectedDTOs: RoleVersionedDataObject[];

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

    this.notificationService.discardNotification();

    this.route.params.subscribe(params => {
      if (!isUndefined(params[ID_PATH_PARAM])) {
        const id = params[ID_PATH_PARAM];
        this.currentBenutzerRolleDO = new BenutzerRolleDO();

        if (id != 'add') {
          this.benutzerDataProvider.findUserRoleById(id)
            .then((response: Response<BenutzerRolleDO>) =>  this.currentBenutzerRolleDO= response.payload)
            .catch((response: Response<BenutzerRolleDO>) => this.currentBenutzerRolleDO= null);

          // wir laden hiermit alle möglichen User-Rollen aus dem Backend um die Klappliste für die Auswahl zu befüllen.
          this.roleDataProvider.findAll()
            .then((response: Response<RoleDO[]>) => this.setVersionedDataObjects(response))
            .catch((response: Response<RoleDO[]>) => this.getEmptyList());
        }
      }
    });
  }

  public onUpdate(ignore: any): void {
    this.saveLoading = true;

    // persist

    this.currentBenutzerRolleDTO = new BenutzerRolleDTO();
    this.currentBenutzerRolleDTO.id = this.currentBenutzerRolleDO.id;
    this.currentBenutzerRolleDTO.email = this.currentBenutzerRolleDO.email;
    this.tobeRole = <RoleDO> this.selectedDTOs[0];
    this.currentBenutzerRolleDTO.roleId =  this.tobeRole.id;
    this.currentBenutzerRolleDTO.roleName =  this.tobeRole.roleName;
    this.benutzerDataProvider.update(this.currentBenutzerRolleDTO)
      .then((response: Response<BenutzerDO>) => {
        if (!isNullOrUndefined(response)
          && !isNullOrUndefined(response.payload)
          && !isNullOrUndefined(response.payload.id)) {
          console.log('Update with id: ' + response.payload.id);

          const notification: Notification = {
            id:          NOTIFICATION_SAVE_BENUTZER,
            title:       'MANAGEMENT.BENUTZER_DETAIL.NOTIFICATION.UPDATE.TITLE',
            description: 'MANAGEMENT.BENUTZER_DETAIL.NOTIFICATION.UPDATE.DESCRIPTION',
            severity:    NotificationSeverity.INFO,
            origin:      NotificationOrigin.USER,
            type:        NotificationType.OK,
            userAction:  NotificationUserAction.PENDING
          };

          this.notificationService.observeNotification(NOTIFICATION_SAVE_BENUTZER)
            .subscribe(myNotification => {
              if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                this.saveLoading = false;
                this.router.navigateByUrl('/verwaltung/benutzer');
              }
            });

          this.notificationService.showNotification(notification);
        }
      }, (response: Response<BenutzerDO>) => {
        console.log('Failed');
        this.saveLoading = false;


      });
    // show response message
  }


  public entityExists(): boolean {
    return this.currentBenutzerRolleDO.id > 0;
  }

  private loadById(id: number) {
    this.benutzerDataProvider.findUserRoleById(id)
        .then((response: Response<BenutzerRolleDO>) => this.handleSuccess(response))
        .catch((response: Response<BenutzerRolleDO>) => this.handleFailure(response));
  }

  private handleSuccess(response: Response<BenutzerRolleDO>) {
    this.currentBenutzerRolleDO = response.payload;
    this.loading = false;
  }

  private handleFailure(response: Response<BenutzerRolleDO>) {
    this.loading = false;

  }
  public getEmptyList(): RoleVersionedDataObject[] {
    return [];
  }

  public setVersionedDataObjects(response: Response<RoleDTO[]>): void {

    this.roles = []; // reset array to ensure change detection
    this.loading = false;

    response.payload.forEach(responseItem =>  this.roles.push(new RoleVersionedDataObject(responseItem.id, responseItem.roleName)));


    return;
  }

  public getVersionedDataObjects(response: Response<RoleDTO[]>) {


    return this.roles;
  }

  public onSelect($event: RoleVersionedDataObject[]): void {
    this.selectedDTOs = [];
    this.selectedDTOs = $event;
   }

  public getSelectedDTO(): string {
    if (isNullOrUndefined(this.selectedDTOs)) {
      return '';
    } else {
      console.log('Auswahllisten: selectedDTO = ' + JSON.stringify(this.selectedDTOs));
      const names: string[] = [];

      this.selectedDTOs.forEach(item => {names.push(item.roleName);});

      return names.join(', ');
    }
  }


}
