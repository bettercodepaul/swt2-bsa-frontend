import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {VersionedDataObject} from '../../../data-provider/models/versioned-data-object.interface';
import {CurrentUserService} from '../../../services/current-user';
import {CommonSecuredComponent} from '../../common/common-secured-component.class';
import {TableRow} from '../../tables/types/table-row.class';
import {OverviewDialogConfig} from '../types/overview-dialog-config.interface';

@Component({
  selector:    'bla-overview-dialog',
  templateUrl: './overview-dialog.component.html',
  styleUrls:   ['./overview-dialog.component.scss']
})
export class OverviewDialogComponent extends CommonSecuredComponent implements OnInit {

  @Input() public config: OverviewDialogConfig;
  @Input() public rows: TableRow[];


  @Output() public onEditClicked = new EventEmitter<VersionedDataObject>();
  @Output() public onViewClicked = new EventEmitter<VersionedDataObject>();
  @Output() public onDeleteClicked = new EventEmitter<VersionedDataObject>();
  @Output() public onAddClicked = new EventEmitter<VersionedDataObject>();

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
}
