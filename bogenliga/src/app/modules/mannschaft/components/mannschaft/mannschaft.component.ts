import {Component, OnInit} from '@angular/core';
import {isUndefined} from "@shared/functions";
import {CommonComponentDirective, toTableRows} from "@shared/components";
import {ActivatedRoute, Router} from "@angular/router";
import {BogenligaResponse} from "@shared/data-provider";
import {DsbMannschaftDataProviderService} from "@verwaltung/services/dsb-mannschaft-data-provider.service";
import {DsbMannschaftDTO} from "@verwaltung/types/datatransfer/dsb-mannschaft-dto.class";
import {VereinDataProviderService} from "@verwaltung/services/verein-data-provider.service";
import {VereinDTO} from "@verwaltung/types/datatransfer/verein-dto.class";
import {MANNSCHAFT_CONFIG, MANNSCHAFTEN_TABLE_CONFIG} from "./mannschaft.config";
import {TableRow} from "@shared/components/tables/types/table-row.class";
import {MannschaftTabelleDO} from "@verwaltung/types/mannschfttabelle-do.class";
import {
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '@shared/services/notification';


const MANNSCHAFT_PATH_PARAM = 'mannschaftId';
const VERANSTALTUNG_PATH_PARAM = 'veranstaltungId';


@Component({
  selector: 'bla-mannschaftsuebersicht',
  templateUrl: './mannschaft.component.html',
  styleUrls: ['./mannschaft.component.scss']
})
export class MannschaftComponent extends CommonComponentDirective implements OnInit {
  private mannschaftId: number | null = null;
  private veranstaltungId: number | null = null;
  public mannschaften: DsbMannschaftDTO[] | null = null;
  public verein: VereinDTO | null = null;
  public currentMannschaft : DsbMannschaftDTO = new DsbMannschaftDTO()
  public rows: TableRow[] | null = null;
  public loadingTable: boolean;
  public tableContent: MannschaftTabelleDO[]=[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private mannschaftDataProvider: DsbMannschaftDataProviderService,
    private notificationService: NotificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.mannschaftId = null;

    this.loading = true;
    this.loadingTable =true;
    this.route.params.subscribe((params) => {
      if (!isUndefined(params[VERANSTALTUNG_PATH_PARAM])) {
        this.veranstaltungId = parseInt(params[VERANSTALTUNG_PATH_PARAM], 10);
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

  loadMannschaftenData(): void{
    // set loading state
    this.loading = true;
    this.mannschaftDataProvider.findAllByVeranstaltungsId(this.veranstaltungId)
      .then((response: BogenligaResponse<DsbMannschaftDTO[]>) => {
        console.log(response)
        this.mannschaften = response.payload!;
        if (this.mannschaften.length===0){
          this.notificationService.showNotification({
            id: 'LigaIDWarning',
            description: '',
            title: 'MANNSCHAFT.STATUS.NOT_FOUND',
            origin: NotificationOrigin.SYSTEM,
            userAction: NotificationUserAction.PENDING,
            type: NotificationType.OK,
            severity: NotificationSeverity.INFO,
          });
          this.router.navigate(['/home'])
        }
        if (this.mannschaftId!=null){
          this.currentMannschaft = this.mannschaften.find(mannschaft => mannschaft.id === this.mannschaftId)!;
          if (this.currentMannschaft==null){
            this.router.navigate(['/mannschaft',this.veranstaltungId])
          }
        }else {
          this.currentMannschaft = this.mannschaften[0];
        }
        this.loading = false;
        //this.mannschaftenrows();
      })
      .catch((response: BogenligaResponse<DsbMannschaftDTO>) => {
        console.error(response);
        this.loading = false;
      });
  }

  /*mannschaftenrows(): void{
    this.mannschaften.forEach(mannschaft =>{
      const test: MannschaftTabelleDO = new MannschaftTabelleDO(mannschaft.name, mannschaft.id);
      this.tableContent.push(test)
    });

    this.rows = toTableRows(this.tableContent);
    this.tableContent = [];
    this.loadingTable = false;
  }*/

  public async getSelectedRow($event): Promise<void> {
    const rowValues = $event;
    console.log(rowValues);
    this.router.navigate(['/mannschaftsuebersicht',rowValues.id]);
  }

  readonly config = MANNSCHAFT_CONFIG;
  readonly config_table = MANNSCHAFTEN_TABLE_CONFIG;
}
