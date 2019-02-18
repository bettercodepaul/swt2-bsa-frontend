import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CurrentUserService} from '../../../shared/services/current-user';
import {CommonSecuredComponent, OverviewDialogConfig} from '../../../shared/components';
import {TableRow} from '../../../shared/components/tables/types/table-row.class';
import {VersionedDataObject} from '../../../shared/data-provider/models/versioned-data-object.interface';

@Component({
  selector: 'bla-vereine-table',
  templateUrl: './vereine-table.component.html',
  styleUrls: ['./vereine-table.component.scss']
})
export class VereineTableComponent extends CommonSecuredComponent implements OnInit {

  @Input() public config: OverviewDialogConfig;
  @Input() public rows: TableRow[];


  @Output() public onRowClicked = new EventEmitter<VersionedDataObject>();
  @Output() public onEditClicked = new EventEmitter<VersionedDataObject>();
  @Output() public onViewClicked = new EventEmitter<VersionedDataObject>();
  @Output() public onDeleteClicked = new EventEmitter<VersionedDataObject>();

  constructor(private currentUserService: CurrentUserService) {
    super(currentUserService);
  }

  ngOnInit() {
  }

  public onRow(versionedDataObject: VersionedDataObject): void {
    this.onRowClicked.emit(versionedDataObject);
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
}
