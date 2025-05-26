import {CommonModule} from '@angular/common';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../shared/shared.module';
import {wkdurchfuehrung_ROUTES} from './wkdurchfuehrung.routing';
import { SchusszettelModule } from '@schusszettel/schusszettel.module';

import {
  WkdurchfuehrungComponent,
  SchusszettelComponent,
  RingzahlTabIndexDirective,
  SchuetzenTabIndexDirective,
  TabletEingabeComponent,
  TabletAdminComponent,
  PfeilNumberOnlyDirective,
  SchuetzeNumberOnlyDirective,
  FehlerpunkteNumberOnlyDirective,
} from '../wkdurchfuehrung/components';

import {
  WkdurchfuehrungGuard,
  SchusszettelGuard,
  TableteingabeGuard,
  TabletadminGuard
} from '../wkdurchfuehrung/guards';
import { TeilnemendeManschaftenTabelleComponent } from './components/teilnemende-manschaften-tabelle/teilnemende-manschaften-tabelle.component';
import { FullscreenComponent } from './components/fullscreen/fullscreen.component';
import { TabletAdminPopUpComponent } from './components/tablet-admin/tablet-admin-pop-up/tablet-admin-pop-up.component';
import {QRCodeModule} from 'angularx-qrcode';
@NgModule({
  imports: [
    SchusszettelModule,
    CommonModule,
    RouterModule.forChild(wkdurchfuehrung_ROUTES),
    SharedModule.forChild(),
    FormsModule,
    QRCodeModule
  ],
  declarations: [
    WkdurchfuehrungComponent,
    SchusszettelComponent,
    PfeilNumberOnlyDirective,
    SchuetzeNumberOnlyDirective,
    FehlerpunkteNumberOnlyDirective,
    RingzahlTabIndexDirective,
    SchuetzenTabIndexDirective,
    TabletEingabeComponent,
    TabletAdminComponent,
    TeilnemendeManschaftenTabelleComponent,
    FullscreenComponent,
    TabletAdminPopUpComponent,
  ],
  providers:    [
    WkdurchfuehrungGuard,
    SchusszettelGuard,
    TableteingabeGuard,
    TabletadminGuard
  ]
})


export class WkdurchfuehrungModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        WkdurchfuehrungGuard,
        SchusszettelGuard,
        TableteingabeGuard,
        TabletadminGuard
      ]
    };
  }

}
