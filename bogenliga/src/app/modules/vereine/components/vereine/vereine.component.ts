import {Component, OnInit} from '@angular/core';
import {VEREINE_CONFIG, VEREINE_TABLE_CONFIG} from './vereine.config';
import {VereinDO} from '@verwaltung/types/verein-do.class';
import {VereinDataProviderService} from '@verwaltung/services/verein-data-provider.service';
import {CommonComponentDirective, toTableRows} from '@shared/components';
import {BogenligaResponse} from '@shared/data-provider';
import {VereinDTO} from '@verwaltung/types/datatransfer/verein-dto.class';
import {TableRow} from '@shared/components/tables/types/table-row.class';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'bla-vereine',
  templateUrl: './vereine.component.html'
})
export class VereineComponent extends CommonComponentDirective implements OnInit {

  public config = VEREINE_CONFIG;
  public config_table = VEREINE_TABLE_CONFIG;
  public vereine: VereinDO[];
  public loading = true;
  public rows: TableRow[];
  public searchTerm = 'searchTermVereine';

  constructor(private router: Router,
              private route: ActivatedRoute,
              private vereinDataProvider: VereinDataProviderService) {
    super();
  }

  ngOnInit() {
    this.loading = true;
    this.loadVereine();
  }

  public findBySearch($event: string) {
    this.vereinDataProvider.findBySearch($event)
      .then((response: BogenligaResponse<VereinDTO[]>) => this.handleLoadTableRowsSuccess(response))
      .catch((response: BogenligaResponse<VereinDTO[]>) => this.handleLoadTableRowsFailure(response));
  }

  private handleLoadTableRowsSuccess(response: BogenligaResponse<VereinDTO[]>): void {
    this.rows = []; // reset array to ensure change detection
    this.rows = toTableRows(response.payload);
    this.loading = false;
  }

  private handleLoadTableRowsFailure(): void {
    this.rows = [];
    this.loading = false;
  }

  private async loadVereine() {
    await this.vereinDataProvider.findAll()
      .then((response: BogenligaResponse<VereinDTO[]>) => this.handleLoadTableRowsSuccess(response))
      .catch((response: BogenligaResponse<VereinDTO[]>) => this.handleLoadTableRowsFailure(response));
  }

  public async getSelectedRow($event): Promise<void> {
    this.router.navigate([`vereine/${$event.id}`]);
  }

}
