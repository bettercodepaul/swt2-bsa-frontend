import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared/shared.module';
import {SportjahresplanComponent} from './components/sportjahresplan/sportjahresplan.component';
import {SportjahresplanGuard} from './guards/sportjahresplan.guard';
import {SPORTJAHRESPLAN_ROUTES} from './sportjahresplan.routing';

@NgModule({
  imports:      [
    CommonModule,
    RouterModule.forChild(SPORTJAHRESPLAN_ROUTES),
    SharedModule,
    FormsModule

  ],
  declarations: [SportjahresplanComponent],
  providers:    [SportjahresplanGuard]
})
export class SportjahresplanModule {
}
