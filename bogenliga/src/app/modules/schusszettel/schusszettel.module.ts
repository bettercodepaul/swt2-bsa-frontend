import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { RegisterRueckennummerComponent } from './maske1registrierung/register-rueckennummer.component';
import { PasseEingabeComponent } from './maske2eingabe/passe-eingabe.component';
import { WarteBestaetigungComponent } from './maske3aktualisierung/warte-bestaetigung.component';

@NgModule({
  declarations: [
    RegisterRueckennummerComponent,
    PasseEingabeComponent,
    WarteBestaetigungComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    RegisterRueckennummerComponent,
    PasseEingabeComponent,
    WarteBestaetigungComponent
  ]
})
export class SchusszettelModule { }
