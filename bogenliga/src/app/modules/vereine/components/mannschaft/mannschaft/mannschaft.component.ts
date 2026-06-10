import {Component, OnInit} from '@angular/core';
import {isUndefined} from '@shared/functions';
import {CommonComponentDirective} from '@shared/components';
import {ActivatedRoute, Router} from '@angular/router';
import {BogenligaResponse} from '@shared/data-provider';
import {DsbMannschaftDataProviderService} from '@verwaltung/services/dsb-mannschaft-data-provider.service';
import {DsbMannschaftDO} from '@verwaltung/types/dsb-mannschaft-do.class';
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
import {SchuetzenStatistikType} from '../SchuetzenStatisticEnum';


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
    public translate: TranslatePipe
  ) {
    super();
  }
  public verein: VereinDTO | null = null;
  public mannschaft: DsbMannschaftDO = new DsbMannschaftDO();
  public rows: TableRow[] | null = null;
  public loadingTable: boolean;
  public config = MANNSCHAFT_CONFIG;
  readonly config_table = MANNSCHAFTEN_TABLE_CONFIG;
  public readonly ActionButtonColors = ActionButtonColors;
  private mannschaftId: number | null = null;
  private vereinId: number | null = null;
  public veranstaltung: VeranstaltungDTO;
  public wettkaempfe: WettkampfDTO[];
  public selectedStatistic = SchuetzenStatistikType.WETTKAMPFTAGESSTATISTIK;

  public tabs = [
    {type: SchuetzenStatistikType.EINZELSTATISTIK},
    {type: SchuetzenStatistikType.WETTKAMPFTAGESSTATISTIK},
    {type: SchuetzenStatistikType.WETTKAMPFSTATISTIK},
    {type: SchuetzenStatistikType.SAISONSTATISTIK},
  ];

  ngOnInit(): void {
    this.mannschaftId = null;

    this.loading = true;
    this.loadingTable = true;
    this.route.params.subscribe((params) => {
      if (!isUndefined(params[VEREIN_PATH_PARAM]) && !isUndefined(params[MANNSCHAFT_PATH_PARAM])) {
        this.vereinId = parseInt(params[VEREIN_PATH_PARAM], 10);
        this.mannschaftId = parseInt(params[MANNSCHAFT_PATH_PARAM], 10);
        this.loadMannschaftData();
      } else {
        // no id provided
        this.loading = false;
      }
    });
  }

  loadMannschaftData(): void {
    this.loading = true;
    this.mannschaftDataProvider.findById(this.mannschaftId)
      .then((response: BogenligaResponse<DsbMannschaftDO>) => {
        this.mannschaft = response.payload!;
        if (this.vereinId !== this.mannschaft.vereinId) {
          this.showMannschaftNotFoundNotification();
          return;
        }
        this.loading = false;
        this.loadWettkampf();
      })
      .catch((response: BogenligaResponse<DsbMannschaftDO>) => {
        console.error(response);
        this.loading = false;
        this.showMannschaftNotFoundNotification();
      });
  }

  public onPushtoVerein(): void {
    this.router.navigate(['/vereine', this.vereinId]);
  }

  private loadWettkampf() {
    if (this.mannschaft.veranstaltungId === null) {
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
    this.wettkampfDataProvider.findAllByVeranstaltungId(this.mannschaft.veranstaltungId)
      .then((response: BogenligaResponse<WettkampfDTO[]>) => {
        this.wettkaempfe = response.payload!;
      });
    this.veranstaltungsDataProvider.findById(this.mannschaft.veranstaltungId)
      .then((response: BogenligaResponse<VeranstaltungDTO>) => {
        this.veranstaltung = response.payload!;
      });
  }

  public selectTab(type: SchuetzenStatistikType): void {
    this.selectedStatistic = type;
  }

  private showMannschaftNotFoundNotification(): void {
      this.notificationService.showNotification({
        id: 'NoMannschaftenFound',
        description: '',
        title: 'MANNSCHAFT.STATUS.NOT_FOUND',
        origin: NotificationOrigin.SYSTEM,
        userAction: NotificationUserAction.PENDING,
        type: NotificationType.OK,
        severity: NotificationSeverity.ERROR,
      });
      this.notificationService.observeNotification('NoMannschaftenFound').subscribe((n) => {
        if (n.userAction === NotificationUserAction.ACCEPTED) {
          this.router.navigate(['/vereine', this.vereinId]);
        }
      });
  }
}
