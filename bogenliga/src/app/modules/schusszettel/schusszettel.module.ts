import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {SharedModule} from '@shared/shared.module';
import {QRCodeModule} from 'angularx-qrcode';
import {RegisterRueckennummerComponent} from './components/maske1registrierung/register-rueckennummer.component';
import {PasseEingabeComponent} from './components/maske2eingabe/passe-eingabe.component';
import {WarteBestaetigungComponent} from './components/maske3aktualisierung/warte-bestaetigung.component';
import {SchusszettelTabletAdminComponent} from './components/setup/schusszettel-tablet-admin.component';
import {TabletComponent} from './components/tablet/tablet.component';
import {WettkampfbeendetComponent} from './components/maske4wettkampfbeendet/wettkampfbeendet.component';
import {NotAllowedComponent} from './components/maske5not-allowed/not-allowed.component';


@NgModule({
  declarations: [
    RegisterRueckennummerComponent,
    PasseEingabeComponent,
    WarteBestaetigungComponent,
    SchusszettelTabletAdminComponent,
    TabletComponent,
    NotAllowedComponent,
    WettkampfbeendetComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    SharedModule,
    QRCodeModule
  ],
  exports: [
    RegisterRueckennummerComponent,
    PasseEingabeComponent,
    WarteBestaetigungComponent,
    SchusszettelTabletAdminComponent
  ]
})
export class SchusszettelModule { }
