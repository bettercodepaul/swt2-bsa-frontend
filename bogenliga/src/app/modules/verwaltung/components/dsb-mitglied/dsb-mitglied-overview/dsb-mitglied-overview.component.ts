import {Component, OnInit} from '@angular/core';
import {DSB_MITGLIED_OVERVIEW_CONFIG} from './dsb-mitglied-overview.config';

@Component({
  selector:    'bla-dsb-mitglied-overview',
  templateUrl: './dsb-mitglied-overview.component.html',
  styleUrls:   ['./dsb-mitglied-overview.component.scss']
})
export class DsbMitgliedOverviewComponent implements OnInit {

  public config = DSB_MITGLIED_OVERVIEW_CONFIG;

  constructor() {
  }

  ngOnInit() {
  }

}
