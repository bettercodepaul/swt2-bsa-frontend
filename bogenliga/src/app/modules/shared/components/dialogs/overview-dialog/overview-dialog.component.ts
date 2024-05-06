import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {VersionedDataObject} from '../../../data-provider/models/versioned-data-object.interface';
import {CurrentUserService, UserPermission} from '../../../services/current-user';
import {CommonSecuredDirective} from '../../common/common-secured-component.class';
import {TableRow} from '../../tables/types/table-row.class';
import {OverviewDialogConfig} from '../types/overview-dialog-config.interface';
import {ActionButtonColors} from '@shared/components/buttons/button/actionbuttoncolors';

@Component({
  selector:    'bla-overview-dialog',
  templateUrl: './overview-dialog.component.html',
  styleUrls:   ['./overview-dialog.component.scss']
})
export class OverviewDialogComponent extends CommonSecuredDirective implements OnInit {

  @Input() public config: OverviewDialogConfig;
  @Input() public rows: TableRow[];
  @Input() public hidden = true;
  @Input() public searchTerm: string;
  @Input() public buttonLabel: string;
  @Input() public filterButtonLabel: string;
  @Input() public isCustomActionButton: boolean = false;
  @Input() public showStatusFilter: boolean = false;
  @Input() public changePageButtons: boolean = false;
  @Input() public showFilterButton: boolean = false;
  @Input() public filterItem: string;
  @Input() public filterItems: Array<string>;
  @Input() public timeItem: string;
  @Input() public timeItems: Array<string>;

  public ActionButtonColors = ActionButtonColors;

  @Output() public onEditClicked = new EventEmitter<VersionedDataObject>();
  @Output() public onViewClicked = new EventEmitter<VersionedDataObject>();
  @Output() public onDeleteClicked = new EventEmitter<VersionedDataObject>();
  @Output() public onAddClicked = new EventEmitter<VersionedDataObject>();
  @Output() public onSearchClicked = new EventEmitter<string>();
  @Output() public onCustomActionButtonClicked = new EventEmitter<string>();
  @Output() public onNextPageButtonClicked = new EventEmitter<string>();
  @Output() public onPreviousPageButtonClicked = new EventEmitter<string>();
  @Output() public onFilterClicked = new EventEmitter<string>();
  @Output() public onDeleteButtonClicked = new EventEmitter<string>();
  @Output() public onTimestampClicked = new EventEmitter<string>();

  constructor(private currentUserService: CurrentUserService) {
    super(currentUserService);
  }

  ngOnInit() {
  }

  public onView(versionedDataObject: VersionedDataObject): void {
    this.onViewClicked.emit(versionedDataObject);
  }

  public onEdit(versionedDataObject: VersionedDataObject): void {
    this.onEditClicked.emit(versionedDataObject);
  }

  public onDelete(versionedDataObject: VersionedDataObject): void {
    this.onDeleteClicked.emit(versionedDataObject);
  }

  public onAdd(versionedDataObject: VersionedDataObject): void {
    this.onAddClicked.emit(versionedDataObject);
  }

  public onSearch(searchTerm: string): void {
    this.onSearchClicked.emit(searchTerm);
  }

  public onCustomActionButtonClick() {
    this.onCustomActionButtonClicked.emit();
  }
  public onDeleteButtonClick() {
    this.onDeleteButtonClicked.emit();
  }
  public onFilterClick() {
    this.onFilterClicked.emit();
  }
  public onPreviousPageButtonClick() {
    this.onPreviousPageButtonClicked.emit();
  }
  public onTimestampClick() {
    this.onTimestampClicked.emit();
  }
  public onNextPageButtonClick() {
    this.onNextPageButtonClicked.emit();
  }

  public hasUserPermissions(userPermissions: UserPermission[]): boolean {
    if (userPermissions === undefined) {
      return true;
    } else {
      return this.currentUserService.hasAnyPermisson(userPermissions);
    }
  }

}
