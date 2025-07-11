import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {DragDropModule} from '@angular/cdk/drag-drop';

import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {SharedModule} from '@shared/shared.module';
import {QRCodeModule} from 'angularx-qrcode';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import {RegisterRueckennummerComponent} from './components/maske1registrierung/register-rueckennummer.component';
import {PasseEingabeComponent} from './components/maske2eingabe/passe-eingabe.component';
import {WarteBestaetigungComponent} from './components/maske3aktualisierung/warte-bestaetigung.component';
import {SchusszettelTabletAdminComponent} from './components/setup/schusszettel-tablet-admin.component';
import {TabletComponent} from './components/tablet/tablet.component';
import {WettkampfbeendetComponent} from './components/maske4wettkampfbeendet/wettkampfbeendet.component';
import {NotAllowedComponent} from './components/maske5not-allowed/not-allowed.component';
import {Maske4ZustandComponent} from '@schusszettel/components/maske4zustand/maske4zustand.component';
import {Maske6MatchendeComponent} from './components/maske6matchende/maske6matchende.component';
import {MatchKontextComponent} from './components/shared/match-kontext/match-kontext.component';
import {SchusszettelRoutingModule} from '@schusszettel/schusszettel.routing.module';
import {MatTooltipModule} from '@angular/material/tooltip';
import {WkdurchfuehrungModule} from '../wkdurchfuehrung/wkdurchfuehrung.module';

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
    Maske6MatchendeComponent,
    MatchKontextComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    DragDropModule,
    // Use routing module to register feature routes
    SchusszettelRoutingModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    SharedModule,
    QRCodeModule,
    MatProgressSpinnerModule,
    WkdurchfuehrungModule
  ],
  exports: [
    SchusszettelTabletAdminComponent,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ]
})
export class SchusszettelModule { }
