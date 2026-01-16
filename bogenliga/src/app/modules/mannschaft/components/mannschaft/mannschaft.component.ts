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
import {
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '@shared/services/notification';
import {ActionButtonColors} from '@shared/components/buttons/button/actionbuttoncolors';
import {WettkampfDataProviderService} from '@verwaltung/services/wettkampf-data-provider.service';
import {WettkampfDTO} from '@verwaltung/types/datatransfer/wettkampf-dto.class';
import {VeranstaltungDataProviderService} from '@verwaltung/services/veranstaltung-data-provider.service';
import {VeranstaltungDTO} from '@verwaltung/types/datatransfer/veranstaltung-dto.class';
import {TranslatePipe} from '@ngx-translate/core';


const MANNSCHAFT_PATH_PARAM = 'mannschaftId';
const VEREIN_PATH_PARAM = 'id';


@Component({
  selector: 'bla-mannschaft',
  templateUrl: './mannschaft.component.html',
  styleUrls: ['./mannschaft.component.scss'],
  providers: [TranslatePipe]
})
export class MannschaftComponent extends CommonComponentDirective implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private mannschaftDataProvider: DsbMannschaftDataProviderService,
    private notificationService: NotificationService,
    private wettkampfDataProvider: WettkampfDataProviderService,
    private veranstaltungsDataProvider: VeranstaltungDataProviderService,
    private translate: TranslatePipe
  ) {
    super();
  }
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
  public veranstaltung: VeranstaltungDTO;
  private wettkaempfe: WettkampfDTO[];

  public activeIndex = 0;
  public tabs = [
    { label: this.translate.transform('MANNSCHAFT.TABS.EINZELSTATISTIK.TITLE')},
    { label: 'Mannschaften'}
  ];

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
        this.loadWettkampf();
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
    this.loadWettkampf();
  }

  private loadWettkampf() {
    if (this.currentMannschaft.veranstaltungId === null) {
      this.notificationService.showNotification({
        id: 'showNotification',
        description: '',
        title: 'MANNSCHAFT.NO_LIGA_WARNING',
        origin: NotificationOrigin.SYSTEM,
        userAction: NotificationUserAction.PENDING,
        type: NotificationType.OK,
        severity: NotificationSeverity.ERROR,
      });
      this.veranstaltung = null;
      return;
    }
    this.wettkampfDataProvider.findAllByVeranstaltungId(this.currentMannschaft.veranstaltungId)
      .then((response: BogenligaResponse<WettkampfDTO[]>) => {
        console.log('wettkampf, findAllByVeranstaltungId', response);
        this.wettkaempfe = response.payload!;
      });
    this.veranstaltungsDataProvider.findById(this.currentMannschaft.veranstaltungId)
      .then((response: BogenligaResponse<VeranstaltungDTO>) => {
        console.log('veranstaltung', response);
        this.veranstaltung = response.payload!;
      });
  }

  public selectTab(index: number): void {
    console.log('Tab chnaged to: ' + index);
    this.activeIndex = index;
  }
}
