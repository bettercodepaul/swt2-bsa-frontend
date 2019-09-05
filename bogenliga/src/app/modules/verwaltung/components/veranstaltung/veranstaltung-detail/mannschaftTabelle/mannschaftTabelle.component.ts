import {Component, OnInit} from '@angular/core';
import {CommonComponent} from '@shared/components';
import {VeranstaltungDataProviderService} from "@verwaltung/services/veranstaltung-data-provider.service";
import {WettkampftypDataProviderService} from "@verwaltung/services/wettkampftyp-data-provider.service";
import {RegionDataProviderService} from "@verwaltung/services/region-data-provider.service";
import {UserProfileDataProviderService} from "@user/services/user-profile-data-provider.service";
import {LigaDataProviderService} from "@verwaltung/services/liga-data-provider.service";
import {DsbMannschaftDataProviderService} from "@verwaltung/services/dsb-mannschaft-data-provider.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NotificationService} from "@shared/services";
import {isUndefined} from "@shared/functions";
import {VeranstaltungDO} from "@verwaltung/types/veranstaltung-do.class";
import {WettkampftypDO} from "@verwaltung/types/wettkampftyp-do.class";
import {LigaDO} from "@verwaltung/types/liga-do.class";


@Component({
  selector:    'bla-mannschaft-tabelle',
  templateUrl: './mannschaftTabelle.component.html',
  styleUrls:   ['./mannschaftTabelle.component.scss']
})
export class MannschaftTabelleComponent implements OnInit {

  constructor(){
  }

  ngOnInit() {

  }
}
