import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SportjahresplanComponent} from './components/sportjahresplan/sportjahresplan.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared/shared.module';
import {FormsModule} from '@angular/forms';
import {SPORTJAHRESPLAN_ROUTES} from './sportjahresplan.routing';
import {SportjahresplanGuard} from './guards/sportjahresplan.guard';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(SPORTJAHRESPLAN_ROUTES),
    SharedModule,
    FormsModule
  ],
  declarations: [SportjahresplanComponent],
  providers: [SportjahresplanGuard]
})
export class SportjahresplanModule { }
