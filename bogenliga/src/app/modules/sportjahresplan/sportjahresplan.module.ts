import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SportjahresplanComponent } from './components/sportjahresplan/sportjahresplan.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared/shared.module';
import {FormsModule} from '@angular/forms';
import {SPORTJAHRESPLAN_ROUTES} from './sportjahresplan.routing';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(SPORTJAHRESPLAN_ROUTES),
    SharedModule,
    FormsModule
  ],
  declarations: [SportjahresplanComponent]
})
export class SportjahresplanModule { }
