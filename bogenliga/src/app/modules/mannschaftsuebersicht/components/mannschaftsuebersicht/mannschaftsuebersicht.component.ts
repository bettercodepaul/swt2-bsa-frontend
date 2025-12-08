import {Component, OnInit} from '@angular/core';
import {isUndefined} from "@shared/functions";
import {CommonComponentDirective} from "@shared/components";
import {ActivatedRoute, Router} from "@angular/router";
import {BogenligaResponse} from "@shared/data-provider";
import {VereinDTO} from "@verwaltung/types/datatransfer/verein-dto.class";
import {DsbMannschaftDataProviderService} from "@verwaltung/services/dsb-mannschaft-data-provider.service";
import {DsbMannschaftDTO} from "@verwaltung/types/datatransfer/dsb-mannschaft-dto.class";

const ID_PATH_PARAM = 'id';

@Component({
  selector: 'bla-mannschaftsuebersicht',
  templateUrl: './mannschaftsuebersicht.component.html',
  styleUrls: ['./mannschaftsuebersicht.component.scss']
})
export class MannschaftsuebersichtComponent extends CommonComponentDirective implements OnInit {
  private providedID: number | null = null;
  private mannschaft: DsbMannschaftDTO | null = null;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private mannschaftDataProvider: DsbMannschaftDataProviderService
  ) {
    super();
  }

  ngOnInit(): void {
    // Intentionally left blank for now
    console.log('Bin in Mannschaftsuebersicht');
    this.providedID = null;
    // this.providedID = this.findFirstVereinID();

    this.loading = true;
    this.route.params.subscribe((params) => {
      if (!isUndefined(params[ID_PATH_PARAM])) {
        this.providedID = parseInt(params[ID_PATH_PARAM], 10);
        console.log('This.providedID: ' + this.providedID);
      }
    });
    this.loadMannschaftData()
  }
  loadMannschaftData(): void{
    this.mannschaftDataProvider.findById(this.providedID)
      .then((response: BogenligaResponse<DsbMannschaftDTO>) => {
        console.log(response)
        this.mannschaft = response.payload!;
      })
      .catch((response: BogenligaResponse<DsbMannschaftDTO>) => {console.error(response); });
  }
}
