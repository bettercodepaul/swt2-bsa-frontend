import { Component, OnInit } from "@angular/core";
import { CommonComponent } from "../../../shared/components/common";
import { TableRow } from "../../../shared/components/tables/types/table-row.class";
import { Response } from "../../../shared/data-provider";
import { Router } from "@angular/router";
import { NotificationService } from "../../../shared/services/notification";
import { MannschaftDataProviderService } from "../../services/mannschaft-data-provider.service";
import { toTableRows } from "../../../shared/components/tables";
import { MannschaftDO } from "../../types/mannschaft-do.class";
import { MannschaftDTO } from "../../types/datatransfer/mannschaft-dto.class";
import { VersionedDataObject } from "../../../shared/data-provider/models/versioned-data-object.interface";

@Component({
  selector: "bla-mannschaft",
  templateUrl: "./mannschaft.component.html",
  styleUrls: ["./mannschaft.component.scss"]
})
export class MannschaftComponent extends CommonComponent implements OnInit {
  public rows: TableRow[];

  constructor(
    private mannschaftDataProvider: MannschaftDataProviderService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    super();
  }

  ngOnInit() {
    this.loadTableRows();
  }

  public onView(versionedDataObject: VersionedDataObject): void {
    this.navigateToDetailDialog(versionedDataObject);
  }

  private navigateToDetailDialog(versionedDataObject: VersionedDataObject) {
    this.router.navigateByUrl("/mannschaft/" + versionedDataObject.id);
  }

  private loadTableRows() {
    this.loading = true;

    this.mannschaftDataProvider
      .findAll()
      .then((response: Response<MannschaftDTO[]>) =>
        this.handleLoadTableRowsSuccess(response)
      )
      .catch((response: Response<MannschaftDTO[]>) =>
        this.handleLoadTableRowsFailure(response)
      );
  }

  private handleLoadTableRowsSuccess(response: Response<MannschaftDO[]>): void {
    this.rows = []; // reset array to ensure change detection
    this.rows = toTableRows(response.payload);
    this.loading = false;
  }

  private handleLoadTableRowsFailure(response: Response<MannschaftDO[]>): void {
    this.rows = [];
    this.loading = false;
  }
}
