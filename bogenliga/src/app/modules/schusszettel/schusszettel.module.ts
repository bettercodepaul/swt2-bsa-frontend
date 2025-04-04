import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { Maske1RegistrierungComponent } from './maske1registrierung/maske1registrierung.component';
import { Maske2EingabeComponent } from './maske2eingabe/maske2eingabe.component';
import { Maske3AktualisierungComponent } from './maske3aktualisierung/maske3aktualisierung.component';

@NgModule({
  declarations: [
    Maske1RegistrierungComponent,
    Maske2EingabeComponent,
    Maske3AktualisierungComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    Maske1RegistrierungComponent,
    Maske2EingabeComponent,
    Maske3AktualisierungComponent
  ]
})
export class SchusszettelModule { }
