import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerwaltungComponent } from './components/verwaltung/verwaltung.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared/shared.module';
import {FormsModule} from '@angular/forms';
import {VERWALTUNG_ROUTES} from './verwaltung.routing';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(VERWALTUNG_ROUTES),
    SharedModule,
    FormsModule
  ],
  declarations: [VerwaltungComponent]
})
export class VerwaltungModule { }
