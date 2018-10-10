import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OverviewComponent} from './components/overview/overview.component';
import {DetailsComponent} from './components/details/details.component';
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';
import {SETTINGS_ROUTES} from './settings.routing';
import {FormsModule} from '@angular/forms';
import {SettingsGuard} from './guards/settings.guard';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(SETTINGS_ROUTES),
    SharedModule,
    FormsModule
  ],
  declarations: [OverviewComponent, DetailsComponent],
  providers: [SettingsGuard] // provide Guards here
})
export class SettingsModule {}
