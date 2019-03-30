import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {SharedModule} from '@shared/shared.module';
import {DetailsComponent} from './components/details/details.component';
import {OverviewComponent} from './components/overview/overview.component';
import {SettingsGuard} from './guards/settings.guard';
import {SETTINGS_ROUTES} from './settings.routing';


@NgModule({
  imports:      [
    CommonModule,
    RouterModule.forChild(SETTINGS_ROUTES),
    SharedModule,
    FormsModule,
    FontAwesomeModule
  ],
  declarations: [OverviewComponent, DetailsComponent],
  providers:    [SettingsGuard] // provide Guards here
})
export class SettingsModule {
}
