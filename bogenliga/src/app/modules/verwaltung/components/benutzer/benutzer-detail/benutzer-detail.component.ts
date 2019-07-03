import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BogenligaResponse} from '@shared/data-provider';
import {isNullOrUndefined, isUndefined} from '@shared/functions';
import {ButtonType, CommonComponent, toTableRows} from '../../../../shared/components';
import {BenutzerDataProviderService} from '../../../services/benutzer-data-provider.service';
import {BenutzerDO} from '../../../types/benutzer-do.class';
import {BenutzerRolleDO} from '../../../types/benutzer-rolle-do.class';
import {BenutzerRolleDTO} from '../../../types/datatransfer/benutzer-rolle-dto.class';
import {RoleDTO} from '../../../types/datatransfer/role-dto.class';
import {RoleDO} from '../../../types/role-do.class';
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

  public config = BENUTZER_DETAIL_CONFIG;
  public ButtonType = ButtonType;
  public currentBenutzerRolleDO: BenutzerRolleDO[];
  public roles: RoleDTO[] = [];
  public tobeRole: RoleDO;
  public currentRoles: BenutzerRolleDTO[] = [];
  public roleNames;

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

    this.route.params.subscribe((params) => {
      if (!isUndefined(params[ID_PATH_PARAM])) {
        const id = params[ID_PATH_PARAM];
        this.currentBenutzerRolleDO = new Array<BenutzerRolleDO>();

        if (id !== 'add') {
          this.benutzerDataProvider.findUserRoleById(id)
              .then((response: BogenligaResponse<BenutzerRolleDO[]>) =>  this.currentBenutzerRolleDO = response.payload)
              .catch((response: BogenligaResponse<BenutzerRolleDO>) => this.currentBenutzerRolleDO = null);

          // wir laden hiermit alle möglichen User-Rollen aus dem Backend um die Klappliste für die Auswahl zu befüllen.
          this.roleDataProvider.findAll()
              .then((response: BogenligaResponse<RoleDO[]>) => this.setVersionedDataObjects(response))
              .catch((response: BogenligaResponse<RoleDO[]>) => this.getEmptyList());
        }
      }
    });
    console.log('post rolenames***********')
    this.roleNames  = this.currentBenutzerRolleDO[0].roleName;
    console.log(this.currentBenutzerRolleDO[1].roleName)
    this.currentBenutzerRolleDO.forEach((role,index) => {
      if(index <= this.currentBenutzerRolleDO.length) {
        this.roleNames = this.roleNames + ", " + this.currentBenutzerRolleDO[index+1].roleName;
      }
    });
  }

  public onUpdate(ignore: any): void {
    this.saveLoading = true;

    // persist
    this.selectedDTOs.forEach((item, index) => {

      const currentBenutzerRolleDTO = new BenutzerRolleDTO();
      currentBenutzerRolleDTO.id = this.currentBenutzerRolleDO[0].id;
      currentBenutzerRolleDTO.email = this.currentBenutzerRolleDO[0].email;
      this.tobeRole = this.selectedDTOs[index] as RoleDO;
      currentBenutzerRolleDTO.roleId =  this.tobeRole.id;
      currentBenutzerRolleDTO.roleName =  this.tobeRole.roleName;
      this.currentRoles.push(currentBenutzerRolleDTO);
    });

    this.benutzerDataProvider.update(this.currentRoles)
        .then((response: BogenligaResponse<Array<BenutzerDO>>) => {
          console.log('pre if***********')
          console.log(response)

          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload[0])
            && !isNullOrUndefined(response.payload[0].id)) {
            console.log('Update with id: ' + response.payload[0].id);

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
                .subscribe((myNotification) => {
                  if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                    this.saveLoading = false;
                    this.router.navigateByUrl('/verwaltung/benutzer');
                  }
                });

            this.notificationService.showNotification(notification);
          }
          console.log('after if***********')

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

    response.payload.forEach((responseItem) =>  this.roles.push(new RoleVersionedDataObject(responseItem.id, responseItem.roleName)));


    return;
  }

  public getVersionedDataObjects() {


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

      this.selectedDTOs.forEach((item) => {names.push(item.roleName); });

      return names.join(', ');
    }
  }


}
