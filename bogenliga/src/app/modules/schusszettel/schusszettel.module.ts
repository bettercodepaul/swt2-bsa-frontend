import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '@shared/shared.module';
import { QRCodeModule } from 'angularx-qrcode';
import {SchusszettelInitComponent} from '@schusszettel/setup/schusszettel-init.component';
import { RegisterRueckennummerComponent } from './maske1registrierung/register-rueckennummer.component';
import { PasseEingabeComponent } from './maske2eingabe/passe-eingabe.component';
import { WarteBestaetigungComponent } from './maske3aktualisierung/warte-bestaetigung.component';
import { SchusszettelTabletAdminComponent } from './setup/schusszettel-tablet-admin.component';
import { TabletComponent } from './tablet/tablet.component';
import { WettkampfbeendetComponent } from './maske4wettkampfbeendet/wettkampfbeendet.component';
import { NotAllowedComponent } from './maske5not-allowed/not-allowed.component';


@NgModule({
  declarations: [
    RegisterRueckennummerComponent,
    PasseEingabeComponent,
    WarteBestaetigungComponent,
    SchusszettelTabletAdminComponent,
    SchusszettelInitComponent,
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
