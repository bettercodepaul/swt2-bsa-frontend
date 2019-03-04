import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TableRow} from '../../tables/types/table-row.class';
import {VersionedDataObject} from '../../../data-provider/models/versioned-data-object.interface';
import {CurrentUserService} from '../../../services/current-user';
import {CommonSecuredComponent} from '../../common/common-secured-component.class';
import {SimpleOverviewDialogConfig} from '../types/simple-overview-dialog-config.interface';

@Component({
  selector: 'bla-simple-overview-dialog',
  templateUrl: './simple-overview-dialog.component.html',
  styleUrls: ['./simple-overview-dialog.component.scss']
})
export class SimpleOverviewDialogComponent extends CommonSecuredComponent implements OnInit {

  @Input() public config: SimpleOverviewDialogConfig;
  @Input() public rows: TableRow[];


  @Output() public onEditClicked = new EventEmitter<VersionedDataObject>();
  @Output() public onViewClicked = new EventEmitter<VersionedDataObject>();
  @Output() public onDeleteClicked = new EventEmitter<VersionedDataObject>();
  @Output() public onRowClicked = new EventEmitter<VersionedDataObject>();

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

  public onRowClick(versionedDataObject: VersionedDataObject): void {
    this.onRowClicked.emit(versionedDataObject);
  }
}
