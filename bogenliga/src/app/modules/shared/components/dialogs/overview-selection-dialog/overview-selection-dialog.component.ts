import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {VersionedDataObject} from '../../../data-provider/models/versioned-data-object.interface';
import {CurrentUserService, UserPermission} from '../../../services/current-user';
import {CommonSecuredDirective} from '../../common/common-secured-component.class';
import {TableRow} from '../../tables/types/table-row.class';
import {OverviewDialogConfig} from '../types/overview-dialog-config.interface';
import {SportjahrVeranstaltungDO} from '@verwaltung/types/sportjahr-veranstaltung-do';
import {BogenligaResponse} from '@shared/data-provider';
import {VeranstaltungDTO} from '@verwaltung/types/datatransfer/veranstaltung-dto.class';
import {VeranstaltungDO} from '@verwaltung/types/veranstaltung-do.class';
import {toTableRows} from '@shared/components';
import {VeranstaltungDataProviderService} from '@verwaltung/services/veranstaltung-data-provider.service';

@Component({
  selector:    'bla-selection-overview-dialog',
  templateUrl: './overview-selection-dialog.component.html',
  styleUrls:   ['./overview-selection-dialog.component.scss']
})
export class OverviewSelectionDialogComponent extends CommonSecuredDirective implements OnInit {

  @Input() public config: OverviewDialogConfig;
  @Input() public rows: TableRow[];

  @Output() public onEditClicked = new EventEmitter<VersionedDataObject>();
  @Output() public onViewClicked = new EventEmitter<VersionedDataObject>();
  @Output() public onDeleteClicked = new EventEmitter<VersionedDataObject>();
  @Output() public onAddClicked = new EventEmitter<VersionedDataObject>();

  @Input() id: string;
  @Input() public selectedDTOs: VersionedDataObject[];

  @Input() items: string;
  @Input() optionFieldSelector: string;

  @Input() loading = false;
  @Input() multipleSelections = true;

  @Input() findOnlyGeplantLaufend = false;

  public selectedYear = this.getCurrentYear();

  constructor(private veranstaltungDataProvider: VeranstaltungDataProviderService,
    private currentUserService: CurrentUserService) {
    super(currentUserService);
  }

  ngOnInit() {
  }

  public onView(versionedDataObject: VersionedDataObject): void {
    this.onViewClicked.emit(versionedDataObject);
  }

  public onEdit(versionedDataObject: VersionedDataObject): void {
    console.log('fuck veranstaltung-overview.component.ts. ich bin der könig');
    this.onEditClicked.emit(versionedDataObject);
  }

  public onDelete(versionedDataObject: VersionedDataObject): void {
    this.onDeleteClicked.emit(versionedDataObject);
  }

  public onAdd(versionedDataObject: VersionedDataObject): void {
    this.onAddClicked.emit(versionedDataObject);
  }

  // public onSelect($event: VersionedDataObject[]): void{
  //   this.selectedDTOs = [];
  //   this.selectedDTOs = $event;
  // }
  private getCurrentYear(): number {
    this.selectedYear = new Date().getFullYear();
    return this.selectedYear;
  }
  public onSelect($event: SportjahrVeranstaltungDO[]): void {
    this.selectedYear = null;
    this.selectedYear = $event[0].sportjahr;
    console.log('onSelect Dialog: ' + this.selectedYear);
    this.loadBySportjahr();
  }

  public hasUserPermissions(userPermissions: UserPermission[]): boolean {
    if (userPermissions === undefined) {
      return true;
    } else {
      return this.currentUserService.hasAnyPermisson(userPermissions);
    }
  }


  private handleLoadTableRowsSuccess(response: BogenligaResponse<VeranstaltungDO[]>): void {
    // Check if User is a Ligaleiter, if so filter the incoming payload
    if (this.currentUserService.hasPermission(UserPermission.CAN_MODIFY_MY_VERANSTALTUNG) &&
      !this.currentUserService.hasPermission(UserPermission.CAN_MODIFY_STAMMDATEN)) {
      response.payload = response.payload.filter((entry) => this.currentUserService.getCurrentUserID() === entry.ligaleiterId);
      console.log('detected');
    }
    this.rows = []; // reset array to ensure change detection
    this.rows = toTableRows(response.payload);
    this.loading = false;
  }

  private loadBySportjahr(): void {
    this.loading = true;
    if (this.findOnlyGeplantLaufend) {
      this.veranstaltungDataProvider.findBySportyearGeplantLaufend(this.selectedYear)
          .then((newList: BogenligaResponse<VeranstaltungDO[]>) => this.handleLoadTableRowsSuccess(newList))
          .catch((newList: BogenligaResponse<VeranstaltungDTO[]>) => this.handleLoadBySportjahrfailure(newList));
    } else {
      this.veranstaltungDataProvider.findBySportyear(this.selectedYear)
          .then((newList: BogenligaResponse<VeranstaltungDO[]>) => this.handleLoadTableRowsSuccess(newList))
          .catch((newList: BogenligaResponse<VeranstaltungDTO[]>) => this.handleLoadBySportjahrfailure(newList));
    }
  }


  private handleLoadBySportjahrfailure(response: BogenligaResponse<VeranstaltungDTO[]>): void {
    this.rows = [];
    this.loading = false;
  }
}
