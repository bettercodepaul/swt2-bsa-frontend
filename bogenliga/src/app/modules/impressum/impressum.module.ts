import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImpressumComponent } from './components/impressum/impressum.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared/shared.module';
import {FormsModule} from '@angular/forms';
import {IMPRESSUM_ROUTES} from './impressum.routing';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(IMPRESSUM_ROUTES),
    SharedModule,
    FormsModule
  ],
  declarations: [ImpressumComponent]
})
export class ImpressumModule { }
