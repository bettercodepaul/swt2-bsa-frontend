import {CommonModule} from '@angular/common';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../shared/shared.module';
import {wkdurchfuehrung_ROUTES} from './wkdurchfuehrung.routing';

import {
  WkdurchfuehrungComponent,
  SchusszettelComponent,
  RingzahlTabIndexDirective,
  TabletEingabeComponent,
  TabletAdminComponent,
  PfeilNumberOnlyDirective,
  FehlerpunkteNumberOnlyDirective,
  AnzeigePhysischeIDComponent,
} from '../wkdurchfuehrung/components';

import {
  WkdurchfuehrungGuard,
  SchusszettelGuard,
  TableteingabeGuard,
  TabletadminGuard
} from '../wkdurchfuehrung/guards';
import {
  TeilnemendeManschaftenTabelleComponent
} from './components/teilnemende-manschaften-tabelle/teilnemende-manschaften-tabelle.component';
import {FullscreenComponent} from './components/fullscreen/fullscreen.component';
import {TabletAdminPopUpComponent} from './components/tablet-admin/tablet-admin-pop-up/tablet-admin-pop-up.component';
import {QRCodeModule} from 'angularx-qrcode';
import {MatButtonModule} from '@angular/material/button';
import {AnzeigeManagerComponent} from '@wkdurchfuehrung/components/anzeige-manager/anzeige-manager.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(wkdurchfuehrung_ROUTES),
    SharedModule.forChild(),
    FormsModule,
    QRCodeModule,
    MatButtonModule
  ],
  declarations: [
    WkdurchfuehrungComponent,
    SchusszettelComponent,
    PfeilNumberOnlyDirective,
    FehlerpunkteNumberOnlyDirective,
    RingzahlTabIndexDirective,
    TabletEingabeComponent,
    TabletAdminComponent,
    TeilnemendeManschaftenTabelleComponent,
    FullscreenComponent,
    TabletAdminPopUpComponent,
    AnzeigeManagerComponent,
    AnzeigePhysischeIDComponent,
  ],
  providers: [
    WkdurchfuehrungGuard,
    SchusszettelGuard,
    TableteingabeGuard,
    TabletadminGuard,
  ],
  exports: [
    SchusszettelComponent
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
