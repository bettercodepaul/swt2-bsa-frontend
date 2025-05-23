import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
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
import {Maske4ZustandComponent} from '@schusszettel/components/maske4zustand/maske4zustand.component';
import { MatchKontextComponent } from './components/shared/match-kontext/match-kontext.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    RegisterRueckennummerComponent,
    PasseEingabeComponent,
    WarteBestaetigungComponent,
    SchusszettelTabletAdminComponent,
    TabletComponent,
    NotAllowedComponent,
    WettkampfbeendetComponent,
    Maske4ZustandComponent,
    MatchKontextComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    SharedModule,
    QRCodeModule,
    MatProgressSpinnerModule
  ],
  exports: [
    SchusszettelTabletAdminComponent
  ]
})
export class SchusszettelModule { }
