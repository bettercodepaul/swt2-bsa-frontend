import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './components/overview/overview.component';
import { DetailsComponent } from './components/details/details.component';
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';
import {SETTINGS_ROUTES} from './settings.routing';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(SETTINGS_ROUTES)
  ],
  declarations: [OverviewComponent, DetailsComponent]
})
export class SettingsModule {}
