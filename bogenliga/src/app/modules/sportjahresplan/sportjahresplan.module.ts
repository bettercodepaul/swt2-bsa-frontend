import {CommonModule} from '@angular/common';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../shared/shared.module';
import {SPORTJAHRESPLAN_ROUTES} from './sportjahresplan.routing';

import {
  SportjahresplanComponent,
  SchusszettelComponent,
  RingzahlTabIndexDirective,
  SchuetzenTabIndexDirective,
  TabletEingabeComponent,
  TabletAdminComponent,
  PfeilNumberOnlyDirective,
  SchuetzeNumberOnlyDirective,
  FehlerpunkteNumberOnlyDirective,
} from '../sportjahresplan/components';

import {
  SportjahresplanGuard,
  SchusszettelGuard,
  TableteingabeGuard,
  TabletadminGuard
} from '../sportjahresplan/guards';

@NgModule({
  imports:      [
    CommonModule,
    RouterModule.forChild(SPORTJAHRESPLAN_ROUTES),
    SharedModule.forChild(),
    FormsModule
  ],
  declarations: [
    SportjahresplanComponent,
    SchusszettelComponent,
    PfeilNumberOnlyDirective,
    SchuetzeNumberOnlyDirective,
    FehlerpunkteNumberOnlyDirective,
    RingzahlTabIndexDirective,
    SchuetzenTabIndexDirective,
    TabletEingabeComponent,
    TabletAdminComponent
  ],
  providers:    [
    SportjahresplanGuard,
    SchusszettelGuard,
    TableteingabeGuard,
    TabletadminGuard
  ]
})


export class SportjahresplanModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        SportjahresplanGuard,
        SchusszettelGuard,
        TableteingabeGuard,
        TabletadminGuard
      ]
    };
  }

}

