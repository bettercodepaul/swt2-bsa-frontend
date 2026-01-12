import {Component, OnInit} from '@angular/core';
import {isUndefined} from '@shared/functions';
import {CommonComponentDirective} from '@shared/components';
import {ActivatedRoute, Router} from '@angular/router';
import {BogenligaResponse} from '@shared/data-provider';
import {DsbMannschaftDataProviderService} from '@verwaltung/services/dsb-mannschaft-data-provider.service';
import {DsbMannschaftDTO} from '@verwaltung/types/datatransfer/dsb-mannschaft-dto.class';
import {VereinDTO} from '@verwaltung/types/datatransfer/verein-dto.class';
import {MANNSCHAFT_CONFIG, MANNSCHAFTEN_TABLE_CONFIG} from './mannschaft.config';
import {TableRow} from '@shared/components/tables/types/table-row.class';
import {TranslateService} from '@ngx-translate/core';
import {
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '@shared/services/notification';
import {ActionButtonColors} from '@shared/components/buttons/button/actionbuttoncolors';


const MANNSCHAFT_PATH_PARAM = 'mannschaftId';
const VEREIN_PATH_PARAM = 'id';


@Component({
  selector: 'bla-mannschaft',
  templateUrl: './mannschaft.component.html',
  styleUrls: ['./mannschaft.component.scss']
})
export class MannschaftComponent extends CommonComponentDirective implements OnInit {
  public mannschaften: DsbMannschaftDTO[] | null = null;
  public verein: VereinDTO | null = null;
  public currentMannschaft: DsbMannschaftDTO = new DsbMannschaftDTO();
  public rows: TableRow[] | null = null;
  public loadingTable: boolean;
  public config = MANNSCHAFT_CONFIG;
  readonly config_table = MANNSCHAFTEN_TABLE_CONFIG;
  public readonly ActionButtonColors = ActionButtonColors;
  private mannschaftId: number | null = null;
  private vereinId: number | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private mannschaftDataProvider: DsbMannschaftDataProviderService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {
    super();
  }

  ngOnInit(): void {
    this.mannschaftId = null;

    this.loading = true;
    this.loadingTable = true;
    this.route.params.subscribe((params) => {
      if (!isUndefined(params[VEREIN_PATH_PARAM])) {
        const new_id = parseInt(params[VEREIN_PATH_PARAM], 10);
        if (new_id !== this.vereinId) {
          this.mannschaften = null;
        }
        this.vereinId = new_id;
        // Load after we have the ID
        this.loadMannschaftenData();
      } else {
        // no id provided
        this.loading = false;
      }
      if (!isUndefined(params[MANNSCHAFT_PATH_PARAM])) {
        this.mannschaftId = parseInt(params[MANNSCHAFT_PATH_PARAM], 10);
        // Load after we have the ID
      } else {
        // no id provided
        this.loading = false;
      }
    });
  }

  loadMannschaftenData(): void {
    if (this.mannschaften !== null) {
      return;
    } // Don't load Mannschaften again if we already have them

    this.loading = true;
    this.mannschaftDataProvider.findAllByVereinsId(this.vereinId)
      .then((response: BogenligaResponse<DsbMannschaftDTO[]>) => {
        this.mannschaften = response.payload!;
        if (this.mannschaften.length === 0) {
          this.notificationService.showNotification({
            id: 'NoMannschaftenFound',
            description: '',
            title: 'MANNSCHAFT.STATUS.NOT_FOUND',
            origin: NotificationOrigin.SYSTEM,
            userAction: NotificationUserAction.PENDING,
            type: NotificationType.OK,
            severity: NotificationSeverity.INFO,
          });
          this.notificationService.observeNotification('NoMannschaftenFound').subscribe((n) => {
            if (n.userAction === NotificationUserAction.ACCEPTED) {
              this.router.navigate(['/vereine', this.vereinId]);
            }
          });
        }

        this.currentMannschaft = this.mannschaften.find((mannschaft) => mannschaft.id === this.mannschaftId)!;
        if (this.currentMannschaft == null) {
          this.notificationService.showNotification({
            id: 'showNotification',
            description: '',
            title: 'MANNSCHAFT.STATUS.NOT_FOUND',
            origin: NotificationOrigin.SYSTEM,
            userAction: NotificationUserAction.PENDING,
            type: NotificationType.OK,
            severity: NotificationSeverity.ERROR,
          });
          this.notificationService.observeNotification('showNotification').subscribe((n) => {
            if (n.userAction === NotificationUserAction.ACCEPTED) {
              this.router.navigate(['/vereine', this.vereinId]);
            }
          });
        }

        this.loading = false;
      })
      .catch((response: BogenligaResponse<DsbMannschaftDTO>) => {
        console.error(response);
        this.loading = false;
      });
  }

  public onPushtoVerein(): void {
    this.router.navigate(['/vereine', this.vereinId]);
  }

  public onSelectMannschaft(): void {
    this.router.navigate(['../', this.currentMannschaft.id], {relativeTo: this.route});
  }
}
